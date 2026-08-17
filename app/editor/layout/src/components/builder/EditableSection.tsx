"use client";

import {
  createElement,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Edit, Plus, Trash, X, Play } from "lucide-react";
import { usePreview } from "../context/PreviewContext";
import {
  addableSectionCards,
  createAddableSection,
} from "../../data/templateFlow";
import { getSectionComponent } from "../../lib/sectionRegistry";
import {
  buildSubsectionOrderCss,
  buildSubsectionScopeId,
} from "../../lib/subsectionOrder";

const TOOLBAR_WIDTH = 520;
const TOOLBAR_HEIGHT = 64;
const TOOLBAR_CURSOR_GAP = 0;
const BOTTOM_TOOLBAR_GAP = 20;

export type EditorSubsectionScope = {
  index: number;
  label: string;
  content: string;
  fields?: string[];
  formTabFields?: string[];
  cardFields?: string[];
  fieldValues?: Record<string, string>;
  hasCardLayout?: boolean;
};

type EditableSectionProps = {
  label: string;
  children: ReactNode;
  onEdit: (scope?: EditorSubsectionScope) => void;
  onDelete: () => void;
  onDeleteSubsection?: (index: number) => void;
  onAddSection: (sectionType: string) => void;
  onInlineTextEdit: (oldText: string, newText: string) => void;
  onInlineMediaEdit: (
    oldSrc: string,
    newSrc: string,
    mediaType: "image" | "video",
    fileName: string,
  ) => void;
  stickyMode?: "scroll" | "sticky";
  boxesPerRow?: number;
  hiddenSubsections?: number[];
  subsectionOrder?: number[];
  onReorderSubsections?: (order: number[]) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

export default function EditableSection({
  label,
  children,
  onEdit,
  onDelete,
  onDeleteSubsection,
  onAddSection,
  onInlineTextEdit,
  onInlineMediaEdit,
  stickyMode = "scroll",
  boxesPerRow,
  hiddenSubsections = [],
  subsectionOrder,
  onReorderSubsections,
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
}: EditableSectionProps) {
  const { isPreview } = usePreview();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingSubsectionDelete, setPendingSubsectionDelete] = useState<{
    index: number;
    label: string;
  } | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [generatingComponent, setGeneratingComponent] = useState<string | null>(null);
  const [toolbarY, setToolbarY] = useState(48);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [subsectionBounds, setSubsectionBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [activeSubsection, setActiveSubsection] =
    useState<HTMLElement | null>(null);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const activeEditableRef = useRef<HTMLElement | null>(null);
  const originalTextRef = useRef("");
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scopeId = buildSubsectionScopeId(useId());
  const subsectionOrderCss = buildSubsectionOrderCss(scopeId, subsectionOrder);
  const subsectionOrderKey = subsectionOrder?.join(" ") ?? "";
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const pendingMediaRef = useRef<{
    oldSrc: string;
    mediaType: "image" | "video";
  } | null>(null);

  // Reordering moves the block on screen, so the hover outline has to follow it.
  useEffect(() => {
    if (!activeSubsection) return;

    const frame = requestAnimationFrame(() => {
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      if (!sectionRect) return;

      const innerRect = activeSubsection.getBoundingClientRect();

      setSubsectionBounds({
        left: innerRect.left - sectionRect.left,
        top: innerRect.top - sectionRect.top,
        width: innerRect.width,
        height: innerRect.height,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [activeSubsection, subsectionOrderKey]);

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (pendingSubsectionDelete && onDeleteSubsection) {
      onDeleteSubsection(pendingSubsectionDelete.index);
      setPendingSubsectionDelete(null);
      setActiveSubsection(null);
      setSubsectionBounds(null);
      return;
    }
    onDelete();
  };
  const handleAddComponent = (sectionType: string) => {
    setGeneratingComponent(sectionType);
    window.setTimeout(() => {
      onAddSection(sectionType);
      setGeneratingComponent(null);
      setShowAddPopup(false);
    }, 1600);
  };
  const sectionName = label.charAt(0).toUpperCase() + label.slice(1);
  const canShowSectionAddButton = !["topbar", "header", "footer"].includes(
    label.toLowerCase(),
  );
  const shouldCenterToolbar = !canShowSectionAddButton;

  const finishInlineEdit = (element: HTMLElement, shouldSave: boolean) => {
    const oldText = originalTextRef.current;
    const newText = element.innerText.trim();

    element.removeAttribute("contenteditable");
    element.removeAttribute("spellcheck");
    element.classList.remove(
      "outline",
      "outline-2",
      "outline-blue-500",
      "rounded-sm",
      "cursor-text",
    );

    activeEditableRef.current = null;
    originalTextRef.current = "";
    setIsInlineEditing(false);

    if (shouldSave && oldText && newText && oldText !== newText) {
      onInlineTextEdit(oldText, newText);
    } else if (!shouldSave) {
      element.innerText = oldText;
    }
  };

  const startInlineEdit = (element: HTMLElement) => {
    if (activeEditableRef.current === element) return;

    if (activeEditableRef.current) {
      finishInlineEdit(activeEditableRef.current, true);
    }

    originalTextRef.current = element.innerText.trim();
    activeEditableRef.current = element;
    setIsInlineEditing(true);

    element.setAttribute("contenteditable", "true");
    element.setAttribute("spellcheck", "false");
    element.classList.add(
      "outline",
      "outline-2",
      "outline-blue-500",
      "rounded-sm",
      "cursor-text",
    );
    element.focus();

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleInlineTextClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isPreview) return;

    const target = event.target as HTMLElement;

    if (target.closest("[data-editor-toolbar]")) return;
    if (target.closest("[data-editor-no-inline]")) return;

    const mediaElement = target.closest<HTMLElement>("[data-editor-media]");
    if (mediaElement && event.currentTarget.contains(mediaElement)) {
      const mediaType =
        mediaElement.dataset.editorMediaType === "video" ? "video" : "image";
      const oldSrc =
        mediaElement.dataset.editorMediaSrc ||
        mediaElement.getAttribute("src") ||
        "";

      if (!oldSrc) return;

      event.preventDefault();
      event.stopPropagation();
      pendingMediaRef.current = { oldSrc, mediaType };

      if (mediaInputRef.current) {
        mediaInputRef.current.accept =
          mediaType === "video" ? "video/*" : "image/*";
        mediaInputRef.current.click();
      }
      return;
    }

    const editableElement = target.closest<HTMLElement>(
      "h1,h2,h3,h4,h5,h6,p,span,a,button,li",
    );

    if (!editableElement || !event.currentTarget.contains(editableElement)) {
      return;
    }

    const text = editableElement.innerText.trim();

    if (!text) return;

    event.preventDefault();
    event.stopPropagation();
    startInlineEdit(editableElement);
  };

  const handleInlineTextBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target === activeEditableRef.current) {
      finishInlineEdit(target, true);
    }
  };

  const handleInlineTextKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;

    if (target !== activeEditableRef.current) return;

    if (event.key === "Enter") {
      event.preventDefault();
      finishInlineEdit(target, true);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      finishInlineEdit(target, false);
    }
  };

  const handleMediaFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    const pendingMedia = pendingMediaRef.current;

    if (!file || !pendingMedia) {
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onInlineMediaEdit(
          pendingMedia.oldSrc,
          reader.result,
          pendingMedia.mediaType,
          file.name,
        );
      }

      pendingMediaRef.current = null;
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const findInnerSubsections = (innerMain: HTMLElement) => {
    const allLabeled = Array.from(
      innerMain.querySelectorAll<HTMLElement>("[data-editor-section-label]"),
    );
    const directLabeled = Array.from(innerMain.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.hasAttribute("data-editor-section-label"),
    );

    if (directLabeled.length === 0) return allLabeled;

    // When every labeled block is a direct main child (or nested only for
    // field editing inside one), reorder against main > flex order CSS.
    const allBelongToDirectParents = allLabeled.every(
      (el) =>
        directLabeled.includes(el) ||
        directLabeled.some((parent) => parent !== el && parent.contains(el)),
    );

    if (allBelongToDirectParents && directLabeled.length > 1) {
      return directLabeled;
    }

    if (directLabeled.length === allLabeled.length) {
      return directLabeled;
    }

    return allLabeled;
  };

  const findActiveSubsection = (
    target: HTMLElement,
    innerMain: HTMLElement,
  ): HTMLElement | null => {
    const labeledSection = target.closest<HTMLElement>(
      "[data-editor-section-label]",
    );
    if (labeledSection && innerMain.contains(labeledSection)) {
      return labeledSection;
    }

    let candidate: HTMLElement | null = target;
    while (candidate && candidate.parentElement !== innerMain) {
      candidate = candidate.parentElement;
    }

    return candidate?.parentElement === innerMain ? candidate : null;
  };

  const handleSectionMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isPreview) return;

    const sectionRect = sectionRef.current?.getBoundingClientRect();
    if (!sectionRect) return;

    const target = event.target as HTMLElement;
    if (target.closest("[data-editor-toolbar]")) return;
    const innerMain = target.closest("main");
    let innerSection: HTMLElement | null = null;

    if (innerMain && sectionRef.current?.contains(innerMain)) {
      innerSection = findActiveSubsection(target, innerMain);
    }

    setActiveSubsection(innerSection);
    if (innerSection) {
      const innerRect = innerSection.getBoundingClientRect();
      setSubsectionBounds({
        left: innerRect.left - sectionRect.left,
        top: innerRect.top - sectionRect.top,
        width: innerRect.width,
        height: innerRect.height,
      });
    } else {
      setSubsectionBounds(null);
    }

    setSectionHeight(sectionRect.height);

    const halfToolbarHeight = TOOLBAR_HEIGHT / 2;
    const padding = 12;
    const minY = halfToolbarHeight + padding;
    const maxY = Math.max(
      minY,
      sectionRect.height - halfToolbarHeight - padding,
    );
    const cursorY = event.clientY - sectionRect.top + TOOLBAR_CURSOR_GAP;

    setToolbarY(Math.min(Math.max(cursorY, minY), maxY));
  };

  const isBottomToolbar =
    canShowSectionAddButton &&
    sectionHeight > 0 &&
    toolbarY >= sectionHeight - TOOLBAR_HEIGHT - BOTTOM_TOOLBAR_GAP;
  const normalizedLabel = label.toLowerCase();
  const sectionStackClass =
    normalizedLabel === "topbar"
      ? "z-[130]"
      : normalizedLabel === "header"
        ? "z-[120]"
        : "z-0";
  const sectionPositionClass =
    stickyMode === "sticky" ? "sticky top-0" : "relative";
  const innerMainElement = sectionRef.current?.querySelector("main");
  const innerSections = innerMainElement
    ? findInnerSubsections(innerMainElement)
    : [];
  const activeSubsectionIndex = activeSubsection
    ? innerSections.indexOf(activeSubsection)
    : -1;
  const visibleInnerSectionCount = innerSections.filter(
    (_, index) => !hiddenSubsections.includes(index),
  ).length;
  const activeSubsectionLabel = activeSubsection
    ? activeSubsection.dataset.editorSectionLabel ||
      (activeSubsectionIndex === 0
        ? "Page Banner"
        : `${sectionName} Content`)
    : sectionName;

  const currentSubsectionOrder =
    subsectionOrder?.length === innerSections.length && innerSections.length > 0
      ? subsectionOrder
      : innerSections.map((_, index) => index);
  const visibleSubsectionOrder = currentSubsectionOrder.filter(
    (index) => !hiddenSubsections.includes(index),
  );
  const activeSubsectionPosition = visibleSubsectionOrder.indexOf(
    activeSubsectionIndex,
  );
  // Inner pages render one section with several blocks, so up/down has to
  // reorder those blocks instead of the whole section.
  const canReorderSubsections =
    Boolean(onReorderSubsections) &&
    activeSubsectionPosition >= 0 &&
    visibleSubsectionOrder.length > 1;

  const moveSubsection = (direction: -1 | 1) => {
    if (!onReorderSubsections || activeSubsectionPosition < 0) return;

    const targetIndex =
      visibleSubsectionOrder[activeSubsectionPosition + direction];

    if (targetIndex === undefined) return;

    const fromPosition = currentSubsectionOrder.indexOf(activeSubsectionIndex);
    const toPosition = currentSubsectionOrder.indexOf(targetIndex);

    if (fromPosition === -1 || toPosition === -1) return;

    const nextOrder = [...currentSubsectionOrder];
    [nextOrder[fromPosition], nextOrder[toPosition]] = [
      nextOrder[toPosition],
      nextOrder[fromPosition],
    ];

    onReorderSubsections(nextOrder);
  };

  const moveTargetName = canReorderSubsections
    ? activeSubsectionLabel
    : sectionName;
  const isMoveUpEnabled = canReorderSubsections
    ? activeSubsectionPosition > 0
    : canMoveUp;
  const isMoveDownEnabled = canReorderSubsections
    ? activeSubsectionPosition < visibleSubsectionOrder.length - 1
    : canMoveDown;
  const handleMoveUp = canReorderSubsections
    ? () => moveSubsection(-1)
    : onMoveUp;
  const handleMoveDown = canReorderSubsections
    ? () => moveSubsection(1)
    : onMoveDown;

  const openEditor = () => {
    if (!activeSubsection) {
      onEdit();
      return;
    }

    const attributeContent = Array.from(
      activeSubsection.querySelectorAll<HTMLElement>(
        "[src], [href], [alt], [placeholder], [data-editor-media-src]",
      ),
    ).flatMap((element) => [
      element.getAttribute("src") ?? "",
      element.getAttribute("href") ?? "",
      element.getAttribute("alt") ?? "",
      element.getAttribute("placeholder") ?? "",
      element.dataset.editorMediaSrc ?? "",
    ]);

    const explicitFields = activeSubsection.dataset.editorFields
      ?.split(/[\s,]+/)
      .map((field) => field.trim())
      .filter(Boolean);
    const formTabFields = activeSubsection.dataset.editorFormFields
      ?.split(/[\s,]+/)
      .map((field) => field.trim())
      .filter(Boolean);
    const cardLayout = activeSubsection.matches("[data-box-layout-grid]")
      ? activeSubsection
      : activeSubsection.querySelector<HTMLElement>("[data-box-layout-grid]");
    const cardFields = cardLayout?.dataset.editorCardFields
      ?.split(/[\s,]+/)
      .map((field) => field.trim())
      .filter(Boolean);
    const fieldValues = Object.fromEntries(
      Array.from(
        activeSubsection.querySelectorAll<HTMLElement>("[data-editor-field]"),
      ).flatMap((element) => {
        const field = element.dataset.editorField?.trim();
        const value =
          element.dataset.editorValue ??
          (element instanceof HTMLImageElement
            ? element.currentSrc || element.src
            : element.innerText.trim());
        return field && value ? [[field, value]] : [];
      }),
    );

    onEdit({
      index: activeSubsectionIndex,
      label: activeSubsectionLabel,
      content: [activeSubsection.innerText, ...attributeContent].join("\n"),
      fields: explicitFields?.length ? explicitFields : undefined,
      formTabFields: formTabFields?.length ? formTabFields : undefined,
      cardFields: cardFields?.length ? cardFields : undefined,
      fieldValues:
        Object.keys(fieldValues).length > 0 ? fieldValues : undefined,
      hasCardLayout: Boolean(
        cardLayout,
      ),
    });
  };

  const editDeleteControls = (
    <>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
        {activeSubsectionLabel} :
      </span>

      {canShowSectionAddButton && (
        <button
          type="button"
          aria-label={`Add component after ${sectionName}`}
          data-editor-toolbar
          title="Add section"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setShowAddPopup(true);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-500 bg-white text-slate-900 hover:bg-slate-100"
        >
          <Plus size={16} />
        </button>
      )}

      <button
        type="button"
        data-editor-toolbar
        aria-label={`Move ${moveTargetName} up`}
        title={
          isMoveUpEnabled ? `Move ${moveTargetName} up` : "Already at the top"
        }
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleMoveUp?.();
        }}
        disabled={!isMoveUpEnabled}
        className="flex h-8 w-11 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-gray-100 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-gray-100"
      >
        <Play size={15} className="rotate-150" />
      </button>

      <button
        type="button"
        data-editor-toolbar
        aria-label={`Move ${moveTargetName} down`}
        title={
          isMoveDownEnabled
            ? `Move ${moveTargetName} down`
            : "Already at the bottom"
        }
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleMoveDown?.();
        }}
        disabled={!isMoveDownEnabled}
        className="flex h-8 w-11 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-gray-100 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-gray-100"
      >
        <Play size={15} className="rotate-90" />
      </button>

      <button
        type="button"
        onClick={openEditor}
        className="flex h-8 shrink-0 items-center gap-1 rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
      >
        <Edit size={13} />
        Edit
      </button>

      <button
        type="button"
        onClick={() => {
          setPendingSubsectionDelete(
            activeSubsection &&
              activeSubsectionIndex >= 0 &&
              visibleInnerSectionCount > 1
              ? { index: activeSubsectionIndex, label: activeSubsectionLabel }
              : null,
          );
          setShowDeleteConfirm(true);
        }}
        className="flex h-8 shrink-0 items-center gap-1 rounded-full border border-red-300 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
      >
        <Trash size={13} />
        Delete
      </button>
    </>
  );

  return (
    <div
      ref={sectionRef}
      id={scopeId}
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      data-hidden-subsections={hiddenSubsections.join(" ") || undefined}
      className={`group/editor-section isolate ${sectionPositionClass} ${sectionStackClass}`}
      onMouseMove={handleSectionMouseMove}
    >
      {subsectionOrderCss && <style>{subsectionOrderCss}</style>}
      {!isPreview && (
        <input
          ref={mediaInputRef}
          type="file"
          className="sr-only"
          tabIndex={-1}
          onChange={handleMediaFileChange}
        />
      )}
      {!isPreview && !isInlineEditing && (
        <div
          data-editor-toolbar
          className="pointer-events-none invisible absolute inset-0 z-40 opacity-0 transition-opacity duration-300 group-hover/editor-section:visible group-hover/editor-section:opacity-100"
        >
          {isBottomToolbar ? (
            <div className="absolute bottom-3 left-1/2 flex w-[min(94vw,520px)] -translate-x-1/2 items-center justify-center gap-3">
              <div className="pointer-events-auto flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 shadow-lg">
                {editDeleteControls}
              </div>
            </div>
          ) : (
            <div
              className="absolute left-0 right-0 flex -translate-y-1/2 justify-center gap-3 py-0"
              style={{ top: shouldCenterToolbar ? "50%" : toolbarY }}
            >
              <div
                className="pointer-events-auto flex h-10 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-3 py-1 shadow-lg"
                style={{ maxWidth: TOOLBAR_WIDTH }}
              >
                {editDeleteControls}
              </div>
            </div>
          )}
        </div>
      )}

      {!isPreview && subsectionBounds && !isInlineEditing && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-30 rounded-sm outline outline-2 outline-blue-500/70"
          style={subsectionBounds}
        />
      )}

      {showDeleteConfirm &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[10001] flex items-center justify-center px-4">
            <div className="pointer-events-auto w-[min(92vw,390px)] rounded-2xl border border-slate-300 bg-white p-6 text-center shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Delete {pendingSubsectionDelete?.label ?? sectionName}
              </p>

              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                Are you sure you want to delete {pendingSubsectionDelete?.label ?? label} section?
              </h3>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="rounded-full bg-red-600 px-7 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Yes
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-full border border-slate-300 px-7 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {showAddPopup &&
        createPortal(
          <div className="fixed inset-0 z-[10002] bg-[#fff6df] px-5 py-5">
            <div className="relative mx-auto h-full max-w-6xl overflow-y-auto">
              <button
                type="button"
                aria-label="Close add component popup"
                onClick={() => setShowAddPopup(false)}
                className="absolute right-2 top-2 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-slate-700 hover:bg-amber-100"
              >
                <X size={18} />
              </button>

              <div className="grid gap-x-16 gap-y-10 px-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
                {addableSectionCards.map((item) => (
                  <AddComponentCard
                    key={item.type}
                    type={item.type}
                    title={item.title}
                    onClick={() => handleAddComponent(item.type)}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {generatingComponent &&
        createPortal(
          <div className="fixed inset-0 z-[10003] flex items-center justify-center bg-white/80 px-4 backdrop-blur-sm" role="status" aria-live="polite">
            <div className="w-[min(92vw,420px)] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <h3 className="mt-5 text-xl font-semibold text-slate-950">Generating component</h3>
              <p className="mt-2 text-sm text-slate-500">Preparing your {generatingComponent} section...</p>
            </div>
          </div>,
          document.body,
        )}

      <div
        className="relative z-0"
        onClick={handleInlineTextClick}
        onBlur={handleInlineTextBlur}
        onKeyDown={handleInlineTextKeyDown}
      >
        {children}
      </div>
    </div>
  );
}

function AddComponentCard({
  type,
  title,
  onClick,
}: {
  type: string;
  title: string;
  onClick: () => void;
}) {
  const previewSection = createAddableSection(type, "Realestate");
  const Component = previewSection
    ? getSectionComponent(
        "Realestate",
        previewSection.type,
        previewSection.variant,
      )
    : null;
  const defaultVariant = previewSection
    ? `${previewSection.type}-1`
    : undefined;
  const data =
    previewSection && defaultVariant
      ? (previewSection.data[previewSection.variant] ??
        previewSection.data[defaultVariant])
      : undefined;

  return (
    <button type="button" onClick={onClick} className="group text-left">
      <div className="aspect-[16/9] overflow-hidden rounded-[28px] border-[5px] border-[#202020] bg-white transition group-hover:-translate-y-1 group-hover:bg-white/60">
        {Component ? (
          <div className="h-[520px] w-[1200px] origin-top-left scale-[0.28] bg-white">
            {createElement(Component, { data })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-700">
            {title}
          </div>
        )}
      </div>

      <p className="mt-4 text-base font-semibold text-[#202020]">{title}</p>
    </button>
  );
}

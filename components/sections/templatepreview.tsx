"use client";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  getCategoryLayoutOptions,
  getTemplateComponentVariant,
  getTemplatesForCategory,
  hasCategoryContent,
  type BuilderTemplate,
} from "@/app/editor/layout/src/data/templateFlow";

type TemplatePreviewProps = {
  selectedCategory: string;
  selectedTemplate: string;
  showPreview: boolean;
  onTemplateChange: (templateId: string) => void;
  onClosePreview: () => void;
};

const PREVIEW_WIDTH = 1440;
const DEFAULT_PREVIEW_VIEWPORT = {
  scale: 0.45,
  height: 900,
};

export default function Templatepreview({
  selectedCategory,
  selectedTemplate,
  showPreview,
  onTemplateChange,
  onClosePreview,
}: TemplatePreviewProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [previewViewport, setPreviewViewport] = useState(
    DEFAULT_PREVIEW_VIEWPORT,
  );
  const previewScreenRef = useRef<HTMLDivElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const bannerLayoutOptions = useMemo(
    () => getCategoryLayoutOptions(selectedCategory, "Banner"),
    [selectedCategory],
  );
  const availableTemplates = useMemo(() => {
    return selectedCategory
      ? getTemplatesForCategory(selectedCategory)
      : [];
  }, [selectedCategory]);
  const bannerLayoutByTemplateId = useMemo(
    () =>
      new Map(
        availableTemplates.map((template) => [
          template.id,
          bannerLayoutOptions.find(
            (layout) =>
              layout.componentVariant ===
              getTemplateComponentVariant(
                selectedCategory,
                template.id,
                "Banner",
              ),
          ),
        ]),
      ),
    [availableTemplates, bannerLayoutOptions, selectedCategory],
  );
  const previewTemplate = useMemo(
    () =>
      showPreview
        ? (availableTemplates.find(
          (item) => item.id === selectedTemplate,
        ) ?? null)
        : null,
    [availableTemplates, selectedTemplate, showPreview],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = previewTemplate ? "hidden" : "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [previewTemplate]);

  useLayoutEffect(() => {
    if (!previewTemplate || !previewScreenRef.current) return;

    const screen = previewScreenRef.current;
    let animationFrame = 0;

    const updateScale = () => {
      const { clientHeight, clientWidth } = screen;

      if (clientHeight <= 0 || clientWidth <= 0) return;

      const scale = clientWidth / PREVIEW_WIDTH;
      const height = clientHeight / scale;

      if (!Number.isFinite(scale) || !Number.isFinite(height)) return;

      setPreviewViewport((current) => {
        const scaleIsStable = Math.abs(current.scale - scale) < 0.001;
        const heightIsStable = Math.abs(current.height - height) < 1;

        return scaleIsStable && heightIsStable
          ? current
          : { scale, height };
      });
    };
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateScale);
    };
    const observer = new ResizeObserver(scheduleUpdate);

    observer.observe(screen);
    updateScale();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [previewTemplate]);

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sourceTemplates = availableTemplates;

    return sourceTemplates.filter((item) => {
      const displayTitle =
        bannerLayoutByTemplateId.get(item.id)?.name ?? item.title;
      const matchesSearch =
        !query ||
        `${selectedCategory} ${displayTitle}`.toLowerCase().includes(query) ||
        displayTitle.toLowerCase().includes(query) ||
        selectedCategory.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [
    availableTemplates,
    bannerLayoutByTemplateId,
    search,
    selectedCategory,
  ]);

  const visibleTemplates = filteredTemplates;

  const previewFeatures = previewTemplate
    ? [
      `${previewTemplate.componentCount} mapped sections`,
      "Components selected by this category template",
      "Content loaded from the selected category",
      "Editable header, banner, about, products, and footer",
      "Mobile-first modular structure",
    ]
    : [];
  const previewTemplateIndex = previewTemplate
    ? filteredTemplates.findIndex(
      (template) => template.id === previewTemplate.id,
    )
    : -1;
  const clearSearch = () => {
    setSearch("");
  };

  const openEditor = (template: BuilderTemplate) => {
    onTemplateChange(template.id);
    const params = new URLSearchParams({
      templateId: template.id,
      category: selectedCategory,
    });

    router.push(`/editor?${params.toString()}`);
  };

  const getTemplateDisplayTitle = (template: BuilderTemplate) =>
    bannerLayoutByTemplateId.get(template.id)?.name ?? template.title;

  const getTemplateComponentName = (template: BuilderTemplate) =>
    bannerLayoutByTemplateId.get(template.id)?.componentVariant ??
    getTemplateComponentVariant(selectedCategory, template.id, "Banner") ??
    "No banner";

  const selectPreviewTemplate = (template: BuilderTemplate) => {
    onTemplateChange(template.id);
  };

  const closePreview = () => {
    onClosePreview();
  };

  const handlePreviewSlide = (direction: "previous" | "next") => {
    if (!filteredTemplates.length) return;

    const currentIndex = Math.max(previewTemplateIndex, 0);
    const offset = direction === "next" ? 1 : -1;
    const nextIndex =
      (currentIndex + offset + filteredTemplates.length) %
      filteredTemplates.length;

    selectPreviewTemplate(filteredTemplates[nextIndex]);
  };

  return (
    <div className="w-full">
      <section className="onboarding-responsive-scroll relative mx-auto max-h-[calc(100dvh-156px)] w-full overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(23,38,76,.08)] lg:max-h-none lg:overflow-visible">
        <div className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6 2xl:px-9">
          <div className="flex shrink-0 justify-center items-center gap-3 border-b border-slate-200 pb-5">
            <div className="text-center">
              <h2 className="text-xl font-semibold tracking-[-.035em] text-[#08132f] sm:text-2xl">
                Pick a look for your {selectedCategory || "website"}
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Preview a direction, then make every section and detail your own.
              </p>
            </div>
          </div>

          <div className="mt-5 flex shrink-0">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 sm:left-5" />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                type="text"
                placeholder="Search template e.g. template-2, Realestate, Business..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-11 text-sm text-[#08132f] outline-none transition placeholder:text-slate-400 focus:border-[#315ff4] focus:ring-3 focus:ring-blue-100/70"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#315ff4] sm:right-5"
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

          </div>

          {previewTemplate &&
            typeof document !== "undefined" &&
            createPortal(
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#f7fbff] p-1 sm:p-2">
                <section className="relative flex h-[calc(100dvh-8px)] w-[calc(100vw-8px)] max-w-[1400px] flex-col overflow-hidden rounded-[22px] border border-blue-100 bg-white shadow-[0_24px_70px_rgba(40,91,145,.14)] sm:h-[calc(100dvh-16px)] sm:w-[calc(100vw-16px)] sm:rounded-[28px] lg:h-[92dvh] lg:max-h-[860px] lg:w-[94vw]">
                  <div className="onboarding-responsive-scroll relative z-10 grid min-h-0 flex-1 content-start gap-4 overflow-y-auto px-3 py-3 sm:px-5 lg:grid-cols-[minmax(0,1fr)_310px] lg:content-stretch lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="relative order-1 flex h-[clamp(260px,62vw,520px)] min-h-0 items-center justify-center overflow-hidden rounded-[22px] border border-blue-100 bg-transparent p-3 lg:h-auto lg:min-h-0">
                      <button
                        type="button"
                        onClick={closePreview}
                        className="absolute right-3 top-3 z-30 grid size-8 place-items-center rounded-full border border-blue-100 bg-white text-slate-500 shadow-md transition hover:border-blue-300 hover:text-[#315ff4] lg:hidden"
                        aria-label="Close template preview"
                      >
                        <X size={17} />
                      </button>

                      <div className="relative inline-block max-h-full max-w-full">
                        <Image
                          src="/macbook-frame.png"
                          alt={`${getTemplateDisplayTitle(previewTemplate)} shown on a laptop`}
                          width={1071}
                          height={694}
                          priority
                          className="pointer-events-none relative z-20 block h-auto max-h-full w-auto max-w-full lg:max-h-[55dvh]"
                        />

                        <div
                          ref={previewScreenRef}
                          className="absolute left-[7.65%] top-[3%] z-10 isolate h-[87.7%] w-[84.7%] overflow-hidden overscroll-contain bg-white"
                          onWheel={(event) => {
                            event.preventDefault();
                            previewIframeRef.current?.contentWindow?.scrollBy({
                              top: event.deltaY,
                              behavior: "auto",
                            });
                          }}
                        >
                          <iframe
                            ref={previewIframeRef}
                            key={`${previewTemplate.id}-${selectedCategory}`}
                            src={`/template-preview?templateId=${encodeURIComponent(previewTemplate.id)}&category=${encodeURIComponent(selectedCategory)}`}
                            title={`${getTemplateDisplayTitle(previewTemplate)} scrollable website preview`}
                            scrolling="yes"
                            tabIndex={0}
                            className="absolute left-0 top-0 border-0 bg-white"
                            style={{
                              width: `${PREVIEW_WIDTH}px`,
                              height: `${previewViewport.height}px`,
                              display: "block",
                              transform: `scale(${previewViewport.scale})`,
                              transformOrigin: "top left",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <aside className="relative order-2 h-fit flex flex-col rounded-[22px] border border-blue-100/80 bg-white p-4 shadow-[0_20px_50px_rgba(41,91,151,.12)] ">
                      <button
                        type="button"
                        onClick={closePreview}
                        className="absolute right-3 top-3 z-10 hidden size-8 place-items-center rounded-full border border-blue-100 bg-white text-slate-500 shadow-sm transition hover:border-blue-300 hover:text-[#315ff4] lg:grid"
                        aria-label="Close template preview"
                      >
                        <X size={17} />
                      </button>

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-emerald-600">
                            Ready to customize
                          </p>
                          <h3 className="mt-1 text-xl font-semibold leading-tight tracking-[-.04em] text-[#08132f]">
                            {getTemplateDisplayTitle(previewTemplate)}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4 min-h-0 flex-1 border-t border-blue-100 pt-3">
                        <h4 className="text-xs font-semibold text-[#08132f]">
                          What&apos;s included
                        </h4>
                        <ul className="mt-2 space-y-2">
                          {previewFeatures.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-[11px] leading-4 text-slate-600"
                            >
                              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#315ff4,#20c997)] text-white">
                                <Check size={9} strokeWidth={3} />
                              </span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditor(previewTemplate)}
                        className="mt-4 w-full rounded-xl bg-[linear-gradient(120deg,#315ff4,#3478f6_52%,#20c997)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(49,95,244,.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(49,95,244,.3)]"
                      >
                        Edit Template
                      </button>
                    </aside>
                  </div>

                  {filteredTemplates.length > 0 && (
                    <div className="relative z-10 shrink-0 border-t border-blue-100/80 bg-white/68 px-3 pb-3 pt-2.5 backdrop-blur-xl sm:px-5">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[.18em] text-[#315ff4]">
                          Choose more templates
                        </span>
                        <span className="h-px flex-1 bg-gradient-to-r from-blue-300 via-emerald-200 to-transparent" />
                      </div>

                      <div className="relative px-8 sm:px-10">
                        {filteredTemplates.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => handlePreviewSlide("previous")}
                              className="absolute left-0 top-1/2 z-20 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-blue-100 bg-white text-slate-600 shadow-md transition hover:border-blue-300 hover:text-[#315ff4]"
                              aria-label="Previous template"
                            >
                              <ChevronLeft size={16} strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePreviewSlide("next")}
                              className="absolute right-0 top-1/2 z-20 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-blue-100 bg-white text-slate-600 shadow-md transition hover:border-blue-300 hover:text-[#315ff4]"
                              aria-label="Next template"
                            >
                              <ChevronRight size={16} strokeWidth={2.5} />
                            </button>
                          </>
                        )}

                        <div className="flex snap-x gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {filteredTemplates.map((item) => {
                            const isActive = previewTemplate.id === item.id;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => selectPreviewTemplate(item)}
                                className={`group relative w-[180px] shrink-0 snap-start overflow-hidden rounded-xl border bg-white p-1.5 text-left transition sm:w-[220px] ${isActive
                                  ? "border-[#315ff4] shadow-[0_8px_22px_rgba(49,95,244,.18)]"
                                  : "border-blue-100 hover:-translate-y-0.5 hover:border-blue-300"
                                  }`}
                              >
                                <Image
                                  src={item.image}
                                  alt={getTemplateDisplayTitle(item)}
                                  width={320}
                                  height={120}
                                  className="h-[62px] w-full rounded-lg object-cover transition duration-300 group-hover:scale-[1.02] sm:h-[72px]"
                                />
                                {isActive && (
                                  <span className="absolute left-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-[#315ff4] text-white shadow-md">
                                    <Check size={11} strokeWidth={3} />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>,
              document.body,
            )}

          <div className="mt-5 flex-1 px-1 pt-1">
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {visibleTemplates.map((item) => {
                const isActive = selectedTemplate === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTemplateChange(item.id);
                    }}
                    className={`group relative cursor-pointer overflow-hidden rounded-lg border bg-white p-2.5 text-left transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(49,95,244,.1)] ${isActive
                      ? "border-[#315ff4] bg-blue-50/30 shadow-[0_8px_24px_rgba(49,95,244,.1)] ring-1 ring-[#315ff4]"
                      : "border-slate-200"
                      }`}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={item.image}
                        alt={getTemplateDisplayTitle(item)}
                        width={480}
                        height={260}
                        className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {isActive && (
                        <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#315ff4] text-white shadow-lg">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}

                    </div>

                    <div className="px-1 pb-1 pt-3">
                      <h3 className="truncate text-sm font-semibold text-[#08132f] sm:text-base">
                        {getTemplateDisplayTitle(item)}
                      </h3>

                      <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[.08em] text-slate-400">
                        {getTemplateComponentName(item)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">
                {selectedCategory && !hasCategoryContent(selectedCategory)
                  ? "No JSON data found for this category."
                  : "No template found."}
              </p>
            )}
          </div>

          {/* {filteredTemplates.length > 4 && (
          <div className="mt-5 flex justify-center gap-3">
            {!isFirstPage && (
              <button
                type="button"
                onClick={handlePrevious}
                className="cursor-pointer rounded-full border border-slate-400 px-8 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-700 hover:text-white"
              >
                Previous
              </button>
            )}

            <button
              type="button"
              onClick={handleLoadMore}
              className="cursor-pointer rounded-full border border-red-600 px-8 py-2 text-sm font-bold text-red-600 transition hover:bg-red-700 hover:text-white"
            >
              {isLastPage ? "View Less" : "Load More"}
            </button>
          </div>
        )} */}
        </div>
      </section>
    </div>
  );
}

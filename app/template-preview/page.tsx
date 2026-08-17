import { buildSelectedConfig } from "@/app/editor/layout/src/data/templateFlow";
import TemplatePreviewSite from "./TemplatePreviewSite";

type TemplatePreviewPageProps = {
  searchParams: Promise<{
    templateId?: string;
    category?: string;
  }>;
};

export default async function TemplatePreviewPage({
  searchParams,
}: TemplatePreviewPageProps) {
  const params = await searchParams;
  const templateId = params.templateId ?? "template-1";
  const category = params.category ?? "Business";
  const config = buildSelectedConfig(templateId, category);

  return (
    <>
      <TemplatePreviewSite
        category={category}
        templateId={templateId}
        sections={config.sections}
      />

      <style>{`
        html {
          min-height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          scroll-behavior: auto;
          scrollbar-color: rgba(49, 95, 244, .45) transparent;
          scrollbar-width: thin;
        }

        body {
          min-height: 100%;
          margin: 0;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: white;
        }

        .animate-marquee {
          animation: none !important;
          transform: translateX(0) !important;
        }

        body::-webkit-scrollbar {
          width: 8px;
        }

        body::-webkit-scrollbar-track {
          background: transparent;
        }

        body::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(49, 95, 244, .45);
        }
      `}</style>
    </>
  );
}

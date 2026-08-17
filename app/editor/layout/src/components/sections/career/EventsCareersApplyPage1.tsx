import type { EventsCareersRoleData, SectionProps } from "../../../types/section";
import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";
import EventsCareersApplyForm1 from "./EventsCareersApplyForm1";
import EventsCareersApplyJobDetails1 from "./EventsCareersApplyJobDetails1";
import EventsCareersApplyWhyJoinUs1 from "./EventsCareersApplyWhyJoinUs1";

export default function EventsCareersApplyPage1({ data = {} }: SectionProps) {
  const job = data as EventsCareersRoleData;
  const jobId = job.id ?? job.slug ?? "role";
  const bannerTitle = job.title ? `Apply: ${job.title}` : "Join Our Team";
  const bannerSubtitle = job.title
    ? [job.department, job.location, job.type ? `(${job.type})` : ""]
        .filter(Boolean)
        .join(" · ")
        .replace(" · (", " (")
    : "Please provide your details to apply.";
  const breadcrumb = [
    ...(data.breadcrumb ?? []),
    {
      label: "Apply",
      href: `/careers/apply/${jobId}`,
    },
  ];

  return (
    <main className="min-h-screen font-sans">
      <EventsPageBanner1
        title={bannerTitle}
        subtitle={bannerSubtitle}
        backgroundImage={data.backgroundImage}
        breadcrumb={breadcrumb}
        textColor={data.textColor}
        backgroundColor={data.backgroundColor}
      />

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <EventsCareersApplyForm1 data={data} />
          <div className="space-y-6">
            <EventsCareersApplyJobDetails1 data={data} />
            <EventsCareersApplyWhyJoinUs1 data={data} />
          </div>
        </div>
      </div>
    </main>
  );
}

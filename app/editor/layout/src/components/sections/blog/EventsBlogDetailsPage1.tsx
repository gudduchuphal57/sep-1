import type { EventsBlogPostData, SectionProps } from "../../../types/section";
import EventsPageBanner1, {
  getEventsPageBannerProps,
} from "../breadcrumb/EventsPageBanner1";
import EventsBlogDetailsContent1 from "./EventsBlogDetailsContent1";
import EventsBlogRecentPosts1 from "./EventsBlogRecentPosts1";

export default function EventsBlogDetailsPage1({ data = {} }: SectionProps) {
  const item = data as EventsBlogPostData;

  return (
    <main className="min-h-screen font-sans text-slate-900">
      <EventsPageBanner1
        {...getEventsPageBannerProps(data, {
          title: item.title ?? data.title,
          subtitle: item.subtitle ?? data.subtitle,
          backgroundImage: item.backgroundImage ?? data.backgroundImage,
          breadcrumb: item.breadcrumb ?? data.breadcrumb,
          textColor: item.textColor ?? data.textColor,
          backgroundColor: item.backgroundColor ?? data.backgroundColor,
        })}
      />

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:grid lg:grid-cols-[1.4fr_0.6fr] lg:items-start lg:gap-10 lg:px-8">
        <EventsBlogDetailsContent1 data={data} />
        <EventsBlogRecentPosts1 data={data} />
      </div>
    </main>
  );
}

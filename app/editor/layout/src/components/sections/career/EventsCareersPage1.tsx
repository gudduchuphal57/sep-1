import type { SectionProps } from "../../../types/section";

import EventsPageBanner1 from "../breadcrumb/EventsPageBanner1";

import EventsCareersOverview1 from "./EventsCareersOverview1";

import EventsCareersQuoteCta1 from "./EventsCareersQuoteCta1";

import EventsCareersRoles1 from "./EventsCareersRoles1";



export default function EventsCareersPage1({ data = {} }: SectionProps) {

  return (

    <main className="min-h-screen bg-white font-sans">

      <EventsPageBanner1

        title={data.title}

        subtitle={data.subtitle}

        backgroundImage={data.backgroundImage}

        breadcrumb={data.breadcrumb}

        textColor={data.textColor}

        backgroundColor={data.backgroundColor}

      />



      <EventsCareersOverview1 data={data} />

      <EventsCareersRoles1 data={data} />

      <EventsCareersQuoteCta1 data={data} />

    </main>

  );

}


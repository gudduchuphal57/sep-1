import fs from "fs";
import path from "path";

const root = "E:/ai/events/css-ai-builder";
const sectionsDir = path.join(
  root,
  "app/editor/layout/src/components/sections",
);
const registryPath = path.join(
  root,
  "app/editor/layout/src/lib/sectionRegistry.ts",
);
const contentPath = path.join(
  root,
  "app/editor/layout/src/data/categoryContent.json",
);
const dataPath = path.join(root, ".tmp-ngo2/data_data.json");
const layoutsPath = path.join(
  root,
  "app/editor/layout/src/lib/ngoSubsectionLayouts.tsx",
);

const ngoFiles = [];
function walk(dir, prefix = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, rel);
    else if (/^NGO.*\.tsx$/.test(entry.name)) ngoFiles.push(rel.replace(/\\/g, "/"));
  }
}
walk(sectionsDir);
ngoFiles.sort();

const imports = ngoFiles.map((rel) => {
  const name = path.basename(rel, ".tsx");
  return `import ${name} from "../components/sections/${rel.replace(/\.tsx$/, "")}";`;
});

const registryEntries = ngoFiles.map(
  (rel) => `  ${path.basename(rel, ".tsx")},`,
);

let registry = fs.readFileSync(registryPath, "utf8");

// Remove existing NGO import lines
registry = registry.replace(
  /^import NGO[A-Za-z0-9]+ from .*NGO.*\r?\n/gm,
  "",
);
// Remove existing NGO registry shorthand entries (lines that are only NGO*)
registry = registry.replace(/^\s*NGO[A-Za-z0-9]+,\r?\n/gm, "");

// Insert imports before BusinessWhyChooseUs1 or after SchoolTopbar2 block
const importAnchor = 'import BusinessWhyChooseUs1 from "../components/sections/whychooseus/BusinessWhyChooseUs1";';
if (!registry.includes(importAnchor)) {
  throw new Error("import anchor missing");
}
registry = registry.replace(
  importAnchor,
  `${imports.join("\n")}\n${importAnchor}`,
);

// Insert registry entries before EventsHeader1 block
const regAnchor = "  EventsHeader1,";
if (!registry.includes(regAnchor)) {
  throw new Error("registry anchor missing");
}
registry = registry.replace(
  regAnchor,
  `${registryEntries.join("\n")}\n${regAnchor}`,
);

fs.writeFileSync(registryPath, registry);
console.log(`Registry: ${ngoFiles.length} NGO components`);

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));

const crumb = (current, bg, home = "Home") => ({
  title: current,
  backgroundImage: bg || "/NGO_Images/children-holding-hand-group.jpg",
  banner: {
    bgImageUrl: bg || "/NGO_Images/children-holding-hand-group.jpg",
    breadcrumbHome: home,
    breadcrumbCurrent: current,
    title: current,
  },
  breadcrumb: [
    { label: home, href: "/" },
    { label: current },
  ],
});

const pickBanner = (source, fallbackTitle) => {
  const b = source?.banner || {};
  return crumb(
    b.breadcrumbCurrent || b.title || fallbackTitle,
    b.bgImageUrl,
    b.breadcrumbHome || "Home",
  );
};

const existingHome = content.categories.NGO?.sections || {};

content.categories.NGO = {
  templateComponents: {
    "template-1": {
      "font-family": "Inter",
      shared: {
        Topbar: "NGOTopbar1",
        Header: "NGOHeader1",
        Footer: "NGOFooter1",
      },
      pages: {
        home: {
          components: [
            { key: "Banner", component: "NGOBanner1" },
            { key: "About", component: "NGOAbout1" },
            { key: "Causes", component: "NGOCauses1" },
            { key: "Projects", component: "NGOProjects1" },
            { key: "Events", component: "NGOEvents1" },
            { key: "Testimonial", component: "NGOTestimonial1" },
            { key: "Blog", component: "NGOBlog1" },
          ],
        },
        about: {
          components: [{ key: "AboutPage", component: "NGOAboutPage1" }],
        },
        gallery: {
          components: [{ key: "Gallery", component: "NGOGalleryPage1" }],
        },
        blog: {
          components: [{ key: "Blog", component: "NGOBlogPage1" }],
        },
        "blog-detail": {
          expand: "blogItems",
          expandSection: "Blog",
          expandVariant: "NGOBlogPage1",
          components: [{ key: "BlogDetails", component: "NGOBlogDetailsPage1" }],
        },
        contact: {
          components: [{ key: "Contact", component: "NGOContactPage1" }],
        },
        faq: {
          components: [{ key: "FAQ", component: "NGOFAQPage1" }],
        },
        teams: {
          components: [{ key: "Teams", component: "NGOTeamsPage1" }],
        },
        "team-detail": {
          expand: "members",
          expandSection: "Teams",
          expandVariant: "NGOTeamsPage1",
          components: [{ key: "TeamDetail", component: "NGOTeamDetailPage1" }],
        },
        careers: {
          components: [{ key: "Careers", component: "NGOCareersPage1" }],
        },
        "careers-apply": {
          expand: "roles",
          expandSection: "Careers",
          expandVariant: "NGOCareersPage1",
          components: [
            { key: "CareersApply", component: "NGOCareersApplyPage1" },
          ],
        },
        events: {
          components: [{ key: "EventsPage", component: "NGOEventsPage1" }],
        },
        "event-detail": {
          expand: "events",
          expandSection: "EventsPage",
          expandVariant: "NGOEventsPage1",
          components: [
            { key: "EventDetail", component: "NGOEventDetailPage1" },
          ],
        },
        awards: {
          components: [{ key: "AwardsPage", component: "NGOAwardsPage1" }],
        },
        testimonials: {
          components: [
            { key: "TestimonialsPage", component: "NGOTestimonialsPage1" },
          ],
        },
        projects: {
          components: [{ key: "ProjectsPage", component: "NGOProjectsPage1" }],
        },
        "project-detail": {
          expand: "items",
          expandSection: "ProjectsPage",
          expandVariant: "NGOProjectsPage1",
          components: [
            { key: "ProjectDetail", component: "NGOProjectDetailPage1" },
          ],
        },
        services: {
          components: [{ key: "Services", component: "NGOServicesPage1" }],
        },
        "service-detail": {
          expand: "items",
          expandSection: "Services",
          expandVariant: "NGOServicesPage1",
          components: [
            { key: "ServiceDetail", component: "NGOServiceDetailPage1" },
          ],
        },
        donate: {
          components: [{ key: "Donate", component: "NGODonatePage1" }],
        },
        support: {
          components: [{ key: "Support", component: "NGOSupportPage1" }],
        },
        partners: {
          components: [{ key: "Partners", component: "NGOPartnersPage1" }],
        },
        "case-study": {
          components: [{ key: "CaseStudy", component: "NGOCaseStudyPage1" }],
        },
        branches: {
          components: [{ key: "Branches", component: "NGOBranchesPage1" }],
        },
        industry: {
          components: [{ key: "Industry", component: "NGOIndustryPage1" }],
        },
        media: {
          components: [{ key: "Media", component: "NGOMediaPage1" }],
        },
        privacy: {
          components: [
            { key: "PrivacyPolicy", component: "NGOPrivacyPolicyPage1" },
          ],
        },
        terms: {
          components: [
            { key: "TermsCondition", component: "NGOTermsConditionPage1" },
          ],
        },
        cookie: {
          components: [
            { key: "CookiePolicy", component: "NGOCookiePolicyPage1" },
          ],
        },
        disclaimer: {
          components: [
            { key: "Disclaimer", component: "NGODisclaimerPage1" },
          ],
        },
        refund: {
          components: [
            { key: "RefundPolicy", component: "NGORefundPolicyPage1" },
          ],
        },
      },
    },
  },
  sections: {
    ...existingHome,
    Topbar: existingHome.Topbar,
    Header: existingHome.Header,
    Banner: existingHome.Banner,
    About: existingHome.About,
    Causes: existingHome.Causes,
    Projects: existingHome.Projects,
    Events: existingHome.Events,
    Testimonial: existingHome.Testimonial,
    Blog: {
      variants: {
        ...(existingHome.Blog?.variants || {}),
        NGOBlog1: existingHome.Blog?.variants?.NGOBlog1,
        NGOBlogPage1: {
          ...pickBanner(data.news, "Blogs & News"),
          ...data.news,
          blogItems: data.news?.articles || [],
          articles: data.news?.articles || [],
        },
      },
    },
    Footer: existingHome.Footer,
    AboutPage: {
      variants: {
        NGOAboutPage1: {
          ...pickBanner(data.about, "About Us"),
          ...data.about,
          aboutContent: data.about,
          mission: data.mission,
          whyChooseUs: data.whyChooseUs,
        },
      },
    },
    Gallery: {
      variants: {
        NGOGalleryPage1: {
          ...pickBanner(data.gallery, "Gallery"),
          ...data.gallery,
        },
      },
    },
    BlogDetails: {
      variants: {
        NGOBlogDetailsPage1: {
          ...pickBanner(data.blogDetails, "Blog Details"),
          ...data.blogDetails,
          blogItems: data.news?.articles || [],
        },
      },
    },
    Contact: {
      variants: {
        ...(existingHome.Contact?.variants || {}),
        NGOContactPage1: {
          ...pickBanner(data.contact, "Contact Us"),
          ...data.contact,
        },
      },
    },
    FAQ: {
      variants: {
        NGOFAQPage1: {
          ...pickBanner(data.faq, "FAQs"),
          ...data.faq,
        },
      },
    },
    Teams: {
      variants: {
        NGOTeamsPage1: {
          ...pickBanner(data.team, "Our Team"),
          ...data.team,
          members: data.team?.members || data.team?.items || [],
        },
      },
    },
    TeamDetail: {
      variants: {
        NGOTeamDetailPage1: {
          ...pickBanner(data.teamDetails, "Team Details"),
          ...data.teamDetails,
        },
      },
    },
    Careers: {
      variants: {
        NGOCareersPage1: {
          ...pickBanner(data.career, "Careers"),
          ...data.career,
          roles: data.career?.roles || data.career?.jobs || [],
        },
      },
    },
    CareersApply: {
      variants: {
        NGOCareersApplyPage1: {
          ...pickBanner(data.jobDetails, "Apply Now"),
          ...data.jobDetails,
          ...(data.jobApply || {}),
          ...(data.careerApplication || {}),
        },
      },
    },
    EventsPage: {
      variants: {
        NGOEventsPage1: {
          ...pickBanner(data.events, "Events"),
          ...data.events,
          events: data.events?.events || data.events?.items || [],
        },
      },
    },
    EventDetail: {
      variants: {
        NGOEventDetailPage1: {
          ...pickBanner(data.eventDetails, "Event Details"),
          ...data.eventDetails,
        },
      },
    },
    AwardsPage: {
      variants: {
        NGOAwardsPage1: {
          ...pickBanner(data.awardsPage, "Awards"),
          ...data.awardsPage,
        },
      },
    },
    TestimonialsPage: {
      variants: {
        NGOTestimonialsPage1: {
          ...pickBanner(data.testimonial, "Testimonials"),
          ...data.testimonial,
        },
      },
    },
    ProjectsPage: {
      variants: {
        NGOProjectsPage1: {
          ...pickBanner(data.projects, "Projects"),
          ...data.projects,
          items: data.projects?.items || [],
        },
      },
    },
    ProjectDetail: {
      variants: {
        NGOProjectDetailPage1: {
          ...pickBanner(data.projectDetails, "Project Details"),
          ...data.projectDetails,
        },
      },
    },
    Services: {
      variants: {
        NGOServicesPage1: {
          ...pickBanner(data.servicesPage, "Services"),
          ...data.servicesPage,
          items: data.servicesPage?.items || data.servicesPage?.services || [],
        },
      },
    },
    ServiceDetail: {
      variants: {
        NGOServiceDetailPage1: {
          ...pickBanner(data.serviceDetails, "Service Details"),
          ...data.serviceDetails,
        },
      },
    },
    Donate: {
      variants: {
        NGODonatePage1: {
          ...pickBanner(data.donateNow, "Donate"),
          ...data.donateNow,
        },
      },
    },
    Support: {
      variants: {
        NGOSupportPage1: {
          ...pickBanner(data.supportPage, "Support"),
          ...data.supportPage,
        },
      },
    },
    Partners: {
      variants: {
        NGOPartnersPage1: {
          ...pickBanner(data.partners, "Partners"),
          ...data.partners,
        },
      },
    },
    CaseStudy: {
      variants: {
        NGOCaseStudyPage1: {
          ...pickBanner(data.caseStudyDetails, "Case Study"),
          ...data.caseStudyDetails,
        },
      },
    },
    Branches: {
      variants: {
        NGOBranchesPage1: {
          ...pickBanner(data.branchesPage, "Branches"),
          ...data.branchesPage,
        },
      },
    },
    Industry: {
      variants: {
        NGOIndustryPage1: {
          ...pickBanner(data.industryPage, "Industry"),
          ...data.industryPage,
        },
      },
    },
    Media: {
      variants: {
        NGOMediaPage1: {
          ...pickBanner(data.media, "Media"),
          ...data.media,
        },
      },
    },
    PrivacyPolicy: {
      variants: {
        NGOPrivacyPolicyPage1: {
          ...pickBanner(data.privacy, "Privacy Policy"),
          ...data.privacy,
        },
      },
    },
    TermsCondition: {
      variants: {
        NGOTermsConditionPage1: {
          ...pickBanner(data.terms, "Terms & Conditions"),
          ...data.terms,
        },
      },
    },
    CookiePolicy: {
      variants: {
        NGOCookiePolicyPage1: {
          ...pickBanner(data.cookie, "Cookie Policy"),
          ...data.cookie,
        },
      },
    },
    Disclaimer: {
      variants: {
        NGODisclaimerPage1: {
          ...pickBanner(data.disclaimer, "Disclaimer"),
          ...data.disclaimer,
        },
      },
    },
    RefundPolicy: {
      variants: {
        NGORefundPolicyPage1: {
          ...pickBanner(data.refund, "Refund Policy"),
          ...data.refund,
        },
      },
    },
  },
};

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2) + "\n");
console.log(
  "NGO pages:",
  Object.keys(content.categories.NGO.templateComponents["template-1"].pages)
    .length,
);
console.log(
  "NGO sections:",
  Object.keys(content.categories.NGO.sections).length,
);

const layouts = `"use client";

import type { ComponentType } from "react";

import type { SectionData } from "../types/section";
import NGOPageBanner1, {
  getNGOPageBannerProps,
} from "../components/sections/breadcrumb/NGOPageBanner1";
import NGOLegalSections1 from "../components/sections/privacy-policy/NGOLegalSections1";
import { sectionRegistry } from "./sectionRegistry";

export type NGOSubsectionLayoutOption = {
  id: string;
  name: string;
  componentVariant: string;
};

const ngoSubsectionLayoutByPage: Record<string, Record<string, string>> = {
  NGOAboutPage1: {
    breadcrumb: "NGOPageBanner1",
    "about content": "NGOAbout1",
    mission: "NGOMission1",
    "why choose us": "NGOWhyChooseUs1",
  },
  NGOGalleryPage1: {
    breadcrumb: "NGOPageBanner1",
    "gallery grid": "NGOGalleryGrid1",
  },
  NGOBlogPage1: {
    breadcrumb: "NGOPageBanner1",
    "blog posts": "NGOBlogGrid1",
  },
  NGOBlogDetailsPage1: {
    breadcrumb: "NGOPageBanner1",
    "article content": "NGOBlogDetailsContent1",
    "recent posts": "NGOBlogRecentPosts1",
  },
  NGOContactPage1: {
    breadcrumb: "NGOPageBanner1",
    "contact overview": "NGOContactOverview1",
    map: "NGOContactMap1",
  },
  NGOFAQPage1: {
    breadcrumb: "NGOPageBanner1",
    "faq content": "NGOFAQContent1",
  },
  NGOTeamsPage1: {
    breadcrumb: "NGOPageBanner1",
    "team members": "NGOTeamMembers1",
  },
  NGOTeamDetailPage1: {
    breadcrumb: "NGOPageBanner1",
    "team profile": "NGOTeamDetailContent1",
  },
  NGOCareersPage1: {
    breadcrumb: "NGOPageBanner1",
    "careers overview": "NGOCareersOverview1",
    "open roles": "NGOCareersRoles1",
  },
  NGOCareersApplyPage1: {
    breadcrumb: "NGOPageBanner1",
    "job details": "NGOCareersApplyJobDetails1",
    "application form": "NGOCareersApplyForm1",
  },
  NGOEventsPage1: {
    breadcrumb: "NGOPageBanner1",
    "events list": "NGOEventsList1",
  },
  NGOEventDetailPage1: {
    breadcrumb: "NGOPageBanner1",
    "event detail": "NGOEventDetailContent1",
  },
  NGOAwardsPage1: {
    breadcrumb: "NGOPageBanner1",
    "awards content": "NGOAwardsContent1",
  },
  NGOTestimonialsPage1: {
    breadcrumb: "NGOPageBanner1",
    testimonials: "NGOTestimonial1",
  },
  NGOProjectsPage1: {
    breadcrumb: "NGOPageBanner1",
    "projects grid": "NGOProjectsGrid1",
  },
  NGOProjectDetailPage1: {
    breadcrumb: "NGOPageBanner1",
    "project detail": "NGOProjectDetailContent1",
  },
  NGOServicesPage1: {
    breadcrumb: "NGOPageBanner1",
    "services content": "NGOServicesContent1",
  },
  NGOServiceDetailPage1: {
    breadcrumb: "NGOPageBanner1",
    "service detail": "NGOServiceDetailContent1",
  },
  NGODonatePage1: {
    breadcrumb: "NGOPageBanner1",
    "donate content": "NGODonateContent1",
  },
  NGOSupportPage1: {
    breadcrumb: "NGOPageBanner1",
    "support overview": "NGOSupportOverview1",
  },
  NGOPartnersPage1: {
    breadcrumb: "NGOPageBanner1",
    partners: "NGOPartners1",
  },
  NGOCaseStudyPage1: {
    breadcrumb: "NGOPageBanner1",
    "case study overview": "NGOCaseStudyOverview1",
  },
  NGOBranchesPage1: {
    breadcrumb: "NGOPageBanner1",
    "branches content": "NGOBranchesContent1",
  },
  NGOIndustryPage1: {
    breadcrumb: "NGOPageBanner1",
    "industry content": "NGOIndustryContent1",
  },
  NGOMediaPage1: {
    breadcrumb: "NGOPageBanner1",
    "media content": "NGOMediaContent1",
  },
  NGOPrivacyPolicyPage1: {
    breadcrumb: "NGOPageBanner1",
    "privacy policy content": "NGOLegalSections1",
  },
  NGOTermsConditionPage1: {
    breadcrumb: "NGOPageBanner1",
    "terms content": "NGOLegalSections1",
  },
  NGOCookiePolicyPage1: {
    breadcrumb: "NGOPageBanner1",
    "cookie content": "NGOLegalSections1",
  },
  NGODisclaimerPage1: {
    breadcrumb: "NGOPageBanner1",
    "disclaimer content": "NGOLegalSections1",
  },
  NGORefundPolicyPage1: {
    breadcrumb: "NGOPageBanner1",
    "refund content": "NGOLegalSections1",
  },
};

export const getNGOSubsectionLayouts = (
  pageVariant: string,
  label: string,
): NGOSubsectionLayoutOption[] => {
  const componentVariant =
    ngoSubsectionLayoutByPage[pageVariant]?.[label.trim().toLowerCase()];
  if (!componentVariant) return [];

  return [
    {
      id: componentVariant,
      name: \`\${label} 1\`,
      componentVariant,
    },
  ];
};

type NGOSubsectionLayoutPreviewProps = {
  componentVariant: string;
  data?: SectionData;
  subsectionLabel: string;
};

export function NGOSubsectionLayoutPreview({
  componentVariant,
  data = {},
  subsectionLabel,
}: NGOSubsectionLayoutPreviewProps) {
  if (componentVariant === "NGOPageBanner1") {
    return <NGOPageBanner1 {...getNGOPageBannerProps(data)} />;
  }

  if (componentVariant === "NGOLegalSections1") {
    return (
      <NGOLegalSections1 data={data} editorLabel={subsectionLabel} />
    );
  }

  const Component = sectionRegistry[componentVariant] as
    | ComponentType<{ data?: SectionData }>
    | undefined;

  if (!Component) return null;

  return <Component data={data} />;
}
`;

fs.writeFileSync(layoutsPath, layouts);
console.log("Wrote ngoSubsectionLayouts.tsx");

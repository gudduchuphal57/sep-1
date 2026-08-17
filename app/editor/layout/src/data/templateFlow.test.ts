import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeTemplatePageComponents,
  resolveTemplateSections,
} from "./templateFlow";

test("normalizes enabled page entries and omits invalid or disabled entries", () => {
  assert.deepEqual(
    normalizeTemplatePageComponents([
      { key: " Banner ", component: " Banner1 " },
      { key: "Hidden", component: "Hidden1", enabled: false },
      { key: "", component: "MissingKey1" },
      null,
    ]),
    [{ key: "Banner", component: "Banner1", enabled: true }],
  );
});

test("resolves shared shell and homepage components in JSON order", () => {
  const sections = resolveTemplateSections("Realestate", "template-1");
  const homeSections = sections.filter((section) => !section.page);

  assert.deepEqual(
    homeSections.slice(0, 4).map((section) => section.type),
    ["Topbar", "Header", "Banner", "Features"],
  );
  assert.equal(homeSections.at(-1)?.type, "Footer");
  assert.ok(sections.every((section) => section.id));
});

test("resolves inner-page components independently in JSON order", () => {
  const sections = resolveTemplateSections("Realestate", "template-1");
  const aboutSections = sections.filter(
    (section) => section.page === "about",
  );

  assert.deepEqual(
    aboutSections.map((section) => section.type),
    ["PageBanner", "AboutStory", "ExperienceStats", "PropertySearchCTA"],
  );
  assert.deepEqual(
    aboutSections.map((section) => section.variant),
    [
      "RealEstateInnerBanner1",
      "RealEstateAboutStory1",
      "RealEstateAboutStats1",
      "RealEstateAboutCTA1",
    ],
  );

  assert.deepEqual(
    sections
      .filter((section) => section.page === "projects")
      .map((section) => section.type),
    ["PageBanner", "ProjectCatalog"],
  );
});

test("expands every property detail record into ordered page components", () => {
  const sections = resolveTemplateSections("Realestate", "template-1");
  const detailSections = sections.filter(
    (section) => section.type === "PropertyOverview",
  );

  assert.ok(detailSections.length > 0);
  for (const overview of detailSections) {
    const siblings = sections.filter(
      (section) => section.page === overview.page,
    );
    assert.deepEqual(
      siblings.map((section) => section.type),
      ["PropertyOverview", "PropertyAmenities"],
    );
  }
});

test("expands project cards into reusable project detail pages", () => {
  const sections = resolveTemplateSections("Realestate", "template-1");
  const details = sections.filter(
    (section) => section.type === "ProjectOverview",
  );

  assert.ok(details.length > 0);
  assert.ok(details.every((section) => section.variant === "RealEstateProjectDetail1"));
  assert.equal(new Set(details.map((section) => section.page)).size, details.length);
});

test("expands blog detail records to stable article routes", () => {
  const sections = resolveTemplateSections("Realestate", "template-1");
  const details = sections.filter((section) => section.type === "BlogDetail");

  assert.ok(details.length > 0);
  assert.ok(details.every((section) => section.page !== "blog-detail"));
  assert.equal(
    new Set(details.map((section) => section.page)).size,
    details.length,
  );
});

test("produces stable IDs and supports the legacy flat schema", () => {
  const first = resolveTemplateSections("Realestate", "template-1");
  const second = resolveTemplateSections("Realestate", "template-1");
  assert.deepEqual(
    first.map((section) => section.id),
    second.map((section) => section.id),
  );
  assert.equal(
    new Set(first.map((section) => section.id)).size,
    first.length,
  );

  const legacy = resolveTemplateSections("Realestate", "template-2");
  assert.ok(legacy.some((section) => section.type === "Banner"));
  assert.ok(legacy.some((section) => section.page === "about"));
});

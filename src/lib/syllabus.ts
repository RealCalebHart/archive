export type SyllabusSection = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  relatedSlugs: string[];
};

// Syllabus content. Not part of the Supabase schema — edit this array
// directly to add real sections. `relatedSlugs` creates a link from this
// section to another; backlinks (which sections link here) are computed
// automatically from that, so you only ever declare the link once.
export const SYLLABUS_SECTIONS: SyllabusSection[] = [
  {
    slug: "example-section",
    title: "Example Section — replace me",
    summary:
      "Placeholder syllabus section. Edit src/lib/syllabus.ts to add your real courses and sections.",
    body: "This is placeholder body content for a syllabus section. Replace it with real course material, notes, or links. You can reference other sections, entries, or the books page using normal markdown-style links.",
    relatedSlugs: ["another-example-section"],
  },
  {
    slug: "another-example-section",
    title: "Another Example Section — replace me",
    summary:
      "A second placeholder section, linked from the first, to show how related sections and backlinks connect to each other.",
    body: "This section is linked from \"Example Section\" via `relatedSlugs`. Notice that this page automatically shows that link back, under \"Linked from\" below — you never have to declare it twice.",
    relatedSlugs: [],
  },
];

export function getSyllabusSection(slug: string): SyllabusSection | undefined {
  return SYLLABUS_SECTIONS.find((section) => section.slug === slug);
}

export function getBacklinks(slug: string): SyllabusSection[] {
  return SYLLABUS_SECTIONS.filter((section) =>
    section.relatedSlugs.includes(slug),
  );
}

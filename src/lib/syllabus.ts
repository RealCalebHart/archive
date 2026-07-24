import { getSupabaseClient } from "./supabase";
import { getPublishedEntriesByCategory, type SidebarEntry } from "./queries";

export type SyllabusSection = {
  id: string;
  slug: string;
  parent_id: string | null;
  title: string;
  summary: string | null;
  body: string | null;
  youtube_url: string | null;
  related_slugs: string[] | null;
  position: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SyllabusTreeNode = SyllabusSection & {
  children: SyllabusTreeNode[];
};

// Lightweight nav-only projection of the tree, safe to pass to a client
// component (no body/summary/timestamps in the payload).
export type SyllabusNavNode = {
  slug: string;
  title: string;
  children: SyllabusNavNode[];
};

export async function getSyllabusSections(): Promise<SyllabusSection[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("syllabus_sections")
    .select("*")
    .not("published_at", "is", null)
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to load syllabus sections:", error.message);
    return [];
  }
  return (data as SyllabusSection[]) ?? [];
}

export type SyllabusSearchItem = { slug: string; title: string };

export async function getSyllabusSearchIndex(): Promise<SyllabusSearchItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("syllabus_sections")
    .select("slug, title")
    .not("published_at", "is", null);

  if (error) {
    console.error("Failed to load syllabus search index:", error.message);
    return [];
  }
  return (data as SyllabusSearchItem[]) ?? [];
}

export function findSyllabusSection(
  sections: SyllabusSection[],
  slug: string,
): SyllabusSection | undefined {
  return sections.find((section) => section.slug === slug);
}

export function buildSyllabusTree(
  sections: SyllabusSection[],
): SyllabusTreeNode[] {
  const byId = new Map<string, SyllabusTreeNode>(
    sections.map((section) => [section.id, { ...section, children: [] }]),
  );
  const roots: SyllabusTreeNode[] = [];

  for (const node of byId.values()) {
    const parent = node.parent_id ? byId.get(node.parent_id) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const byPosition = (a: SyllabusTreeNode, b: SyllabusTreeNode) =>
    a.position - b.position;
  for (const node of byId.values()) node.children.sort(byPosition);
  roots.sort(byPosition);

  return roots;
}

export function toSyllabusNavTree(tree: SyllabusTreeNode[]): SyllabusNavNode[] {
  return tree.map((node) => ({
    slug: node.slug,
    title: node.title,
    children: toSyllabusNavTree(node.children),
  }));
}

// Chain of ancestors from top-level down to (not including) `section`.
export function getSyllabusAncestors(
  sections: SyllabusSection[],
  section: SyllabusSection,
): SyllabusSection[] {
  const byId = new Map(sections.map((s) => [s.id, s]));
  const chain: SyllabusSection[] = [];
  let current = section.parent_id ? byId.get(section.parent_id) : undefined;
  while (current) {
    chain.unshift(current);
    current = current.parent_id ? byId.get(current.parent_id) : undefined;
  }
  return chain;
}

export function getSyllabusChildren(
  sections: SyllabusSection[],
  parentId: string,
): SyllabusSection[] {
  return sections
    .filter((section) => section.parent_id === parentId)
    .sort((a, b) => a.position - b.position);
}

// The top-level section a given section belongs to (itself, if already
// top-level). Entries associate with a syllabus branch via
// entries.category === this slug.
export function getSyllabusRootSlug(
  sections: SyllabusSection[],
  section: SyllabusSection,
): string {
  const ancestors = getSyllabusAncestors(sections, section);
  return ancestors.length > 0 ? ancestors[0].slug : section.slug;
}

export function getSyllabusBacklinks(
  sections: SyllabusSection[],
  slug: string,
): SyllabusSection[] {
  return sections.filter((section) =>
    (section.related_slugs ?? []).includes(slug),
  );
}

export type SyllabusSidebarData = {
  tree: SyllabusNavNode[];
  entriesByTopLevelSlug: Record<string, SidebarEntry[]>;
};

// Shared by the /syllabus layout and any other page (e.g. an entry page)
// that wants to keep the syllabus sidebar visible.
export async function getSyllabusSidebarData(): Promise<SyllabusSidebarData> {
  const [sections, entriesByCategory] = await Promise.all([
    getSyllabusSections(),
    getPublishedEntriesByCategory(),
  ]);

  return {
    tree: toSyllabusNavTree(buildSyllabusTree(sections)),
    entriesByTopLevelSlug: Object.fromEntries(entriesByCategory),
  };
}

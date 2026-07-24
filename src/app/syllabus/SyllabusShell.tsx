import { getSyllabusSidebarData } from "@/lib/syllabus";
import SyllabusSidebar from "./SyllabusSidebar";

// Wraps content in the syllabus sidebar layout. Used by the /syllabus
// section itself, and by any other page (e.g. an entry opened from the
// syllabus) that should keep the sidebar visible for easy navigation.
export default async function SyllabusShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tree, entriesByTopLevelSlug } = await getSyllabusSidebarData();
  const hasSidebar = tree.length > 0;

  return (
    <main
      className={`container syllabus-layout${
        hasSidebar ? "" : " syllabus-layout--no-sidebar"
      }`}
    >
      {hasSidebar && (
        <SyllabusSidebar
          tree={tree}
          entriesByTopLevelSlug={entriesByTopLevelSlug}
        />
      )}
      <div className="syllabus-content">{children}</div>
    </main>
  );
}

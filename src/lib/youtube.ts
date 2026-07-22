// Extract a YouTube video id from the common URL shapes, or null if none.
export function youtubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    let id: string | null = null;
    if (host === "youtu.be") {
      id = parsed.pathname.slice(1);
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        id = parsed.pathname.split("/embed/")[1];
      } else if (parsed.pathname.startsWith("/shorts/")) {
        id = parsed.pathname.split("/shorts/")[1];
      }
    }

    if (!id) return null;
    id = id.split("/")[0];
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}

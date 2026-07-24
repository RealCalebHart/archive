// Extract a YouTube video id from the common URL shapes, or null if none.
export function youtubeVideoId(url: string | null): string | null {
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
    return id.split("/")[0];
  } catch {
    return null;
  }
}

export function youtubeEmbedUrl(url: string | null): string | null {
  const id = youtubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

// Thumbnail qualities to try, highest first. Not every video has a
// maxresdefault (only HD uploads do) — callers should fall back down
// this list on image load error.
const THUMBNAIL_QUALITIES = ["maxresdefault", "sddefault", "hqdefault"] as const;

export type ThumbnailQuality = (typeof THUMBNAIL_QUALITIES)[number];

// Hotlinked to YouTube's image CDN — never fetched/stored by this app.
export function youtubeThumbnailUrl(
  url: string | null,
  quality: ThumbnailQuality = THUMBNAIL_QUALITIES[0]
): string | null {
  const id = youtubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;
}

export function nextThumbnailQuality(
  quality: ThumbnailQuality
): ThumbnailQuality | null {
  const next = THUMBNAIL_QUALITIES[THUMBNAIL_QUALITIES.indexOf(quality) + 1];
  return next ?? null;
}

export const DEFAULT_THUMBNAIL_QUALITY: ThumbnailQuality = THUMBNAIL_QUALITIES[0];

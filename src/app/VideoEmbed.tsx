"use client";

import { useState } from "react";
import {
  DEFAULT_THUMBNAIL_QUALITY,
  nextThumbnailQuality,
  youtubeThumbnailUrl,
  youtubeVideoId,
  type ThumbnailQuality,
} from "@/lib/youtube";

// YouTube doesn't 404 a missing maxresdefault — it silently serves a
// 120x90 gray placeholder with a 200 status, so we have to detect that
// by its known dimensions and fall back to a lower quality that exists.
const PLACEHOLDER_WIDTH = 120;
const PLACEHOLDER_HEIGHT = 90;

export default function VideoEmbed({
  url,
  title,
}: {
  url: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [quality, setQuality] = useState<ThumbnailQuality>(
    DEFAULT_THUMBNAIL_QUALITY
  );
  const videoId = youtubeVideoId(url);

  if (!videoId) return null;

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="video-thumb"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={youtubeThumbnailUrl(url, quality) ?? undefined}
        alt=""
        onError={() => {
          const next = nextThumbnailQuality(quality);
          if (next) setQuality(next);
        }}
        onLoad={(e) => {
          const img = e.currentTarget;
          const isPlaceholder =
            img.naturalWidth === PLACEHOLDER_WIDTH &&
            img.naturalHeight === PLACEHOLDER_HEIGHT;
          const next = nextThumbnailQuality(quality);
          if (isPlaceholder && next) setQuality(next);
        }}
      />
      <span className="video-thumb-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor">
          <path d="M6 6.2 Q6 4 7.9 5.1 L18.1 10.9 Q20 12 18.1 13.1 L7.9 18.9 Q6 20 6 17.8 Z" />
        </svg>
      </span>
    </button>
  );
}

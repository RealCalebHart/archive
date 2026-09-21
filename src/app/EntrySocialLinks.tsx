import type { Entry } from "@/lib/types";
import { externalUrl } from "@/lib/format";

type Platform = {
  key: string;
  label: string;
  url: string | null;
  icon: React.ReactNode;
};

function getPlatforms(entry: Entry): Platform[] {
  return [
    {
      key: "youtube",
      label: "YouTube",
      url: entry.youtube_url,
      icon: (
        <path d="M6 4.5v7l6-3.5-6-3.5Z" fill="currentColor" />
      ),
    },
    {
      key: "instagram",
      label: "Instagram",
      url: entry.instagram_url,
      icon: (
        <>
          <rect
            x="2.5"
            y="2.5"
            width="11"
            height="11"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle
            cx="8"
            cy="8"
            r="2.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="11.3" cy="4.7" r="0.6" fill="currentColor" />
        </>
      ),
    },
    {
      key: "facebook",
      label: "Facebook",
      url: entry.facebook_url,
      icon: (
        <path
          d="M9 14V8.6h1.7l.3-2.1H9V5c0-.6.2-.9 1-.9h1V2c-.2 0-.8-.1-1.6-.1-1.7 0-2.7 1-2.7 2.8v1.6H5v2.1h1.7V14Z"
          fill="currentColor"
        />
      ),
    },
    {
      key: "tiktok",
      label: "TikTok",
      url: entry.tiktok_url,
      icon: (
        <>
          <path
            d="M9.5 2v7.3a2.6 2.6 0 1 1-1.7-2.45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M9.5 2c.3 1.7 1.6 3 3.2 3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </>
      ),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: entry.linkedin_url,
      icon: (
        <>
          <circle cx="5.2" cy="5" r="1" fill="currentColor" />
          <path
            d="M5.2 7.3V13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8.4 13V9.6c0-1 .7-1.7 1.7-1.7s1.7.7 1.7 1.7V13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M8.4 8.2V13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ),
    },
    {
      key: "x",
      label: "X",
      url: entry.x_url,
      icon: (
        <path
          d="M3.5 3.5l9 9M12.5 3.5l-9 9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ),
    },
    {
      key: "threads",
      label: "Threads",
      url: entry.threads_url,
      icon: (
        <path
          d="M11 5.2c-.8-1.1-2-1.7-3.4-1.7-2.5 0-4.3 1.9-4.3 4.6s1.8 4.6 4.4 4.6c2.2 0 3.6-1.1 3.8-2.8.2-1.6-.7-2.6-2.3-2.8-1.3-.2-2.3.3-2.4 1.3-.1.8.5 1.3 1.3 1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
  ];
}

export default function EntrySocialLinks({ entry }: { entry: Entry }) {
  const platforms = getPlatforms(entry).filter((p) => p.url);

  if (platforms.length === 0) return null;

  return (
    <div className="entry-social-row">
      <span className="entry-social-label mono">View on...</span>
      <div className="entry-social-icons">
        {platforms.map((p) => (
          <a
            key={p.key}
            href={externalUrl(p.url as string)}
            target="_blank"
            rel="noopener noreferrer"
            className="entry-social-icon"
            aria-label={`View on ${p.label}`}
            title={p.label}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              {p.icon}
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

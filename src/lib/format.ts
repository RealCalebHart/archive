export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatEntryNumber(n: number): string {
  return String(n).padStart(4, "0");
}

// Custom book links are free-typed in the admin (e.g. "personalmba.com"
// instead of "https://personalmba.com") — without a scheme, an <a href>
// resolves as a path relative to the current page instead of an external
// site, so this defaults a missing scheme to https before rendering.
export function externalUrl(url: string): string {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
}

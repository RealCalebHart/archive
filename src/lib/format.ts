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

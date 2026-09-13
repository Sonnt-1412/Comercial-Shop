export function siteUrl(requestOrigin?: string | null) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = configured || requestOrigin || "http://localhost:3000";

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported site URL protocol");
    }
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const API_URL = (configuredApiUrl || "http://localhost:5000/api").replace(
  /\/$/,
  ""
);

export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || API_URL.replace(/\/api$/, "")
).replace(/\/$/, "");

export function productImageUrl(thumbnail?: string | null): string {
  if (!thumbnail) return "/images/products/teddy.png";
  if (/^https?:\/\//i.test(thumbnail) || thumbnail.startsWith("/")) {
    return thumbnail;
  }

  return `${BACKEND_URL}/uploads/${thumbnail.replace(/^uploads\//, "")}`;
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

function resolveApiUrl(): string {
  let url = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  if (!url || url.includes("balmitra-final.onrender.com")) {
    url = "https://swhub.onrender.com/api";
  }
  return url.replace(/\/+$/, "");
}

function resolveBackendUrl(): string {
  let url = (process.env.NEXT_PUBLIC_BACKEND_URL || "").trim();
  if (!url || url.includes("balmitra-final.onrender.com")) {
    url = API_URL.replace(/\/api$/, "");
  }
  return url.replace(/\/+$/, "");
}

export const API_URL = resolveApiUrl();
export const BACKEND_URL = resolveBackendUrl();

export function productImageUrl(thumbnail?: string | null): string {
  if (!thumbnail) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600";
  }
  if (/^https?:\/\//i.test(thumbnail) || thumbnail.startsWith("/")) {
    return thumbnail;
  }

  return `${BACKEND_URL}/uploads/${thumbnail.replace(/^uploads\//, "")}`;
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 15000
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
  } catch (err: any) {
    clearTimeout(timer);
    if (err?.name === "AbortError") {
      // Return a graceful timeout representation or rethrow with clear message
      throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
    }
    throw err;
  }
}

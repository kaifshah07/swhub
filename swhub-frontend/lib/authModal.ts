// Global event dispatcher for Customer Auth Modal

export type AuthModalOptions = {
  defaultTab?: "login" | "register";
  onSuccess?: () => void;
  message?: string;
};

export function openCustomerAuthModal(options?: AuthModalOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("openCustomerAuthModal", {
        detail: options || {},
      })
    );
  }
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    // Add 10-second buffer
    return Date.now() >= (payload.exp * 1000 - 10000);
  } catch {
    return true;
  }
}

export function clearCustomerSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer");
    localStorage.removeItem("customer_user");
    window.dispatchEvent(new Event("customerAuthChanged"));
    window.dispatchEvent(new Event("userLoggedOut"));
  }
}

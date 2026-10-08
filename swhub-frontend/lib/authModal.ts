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

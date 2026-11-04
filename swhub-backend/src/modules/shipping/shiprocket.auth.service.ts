import axios from "axios";
import { env } from "../../config/env";
import { ShiprocketLoginResponse } from "./shiprocket.types";

export class ShiprocketAuthService {
  private static cachedToken: string | null = null;
  private static tokenExpiresAt: number = 0;
  private static pendingAuthPromise: Promise<string> | null = null;

  /**
   * Returns whether Shiprocket integration is configured and enabled.
   */
  public static isConfigured(): boolean {
    return (
      Boolean(env.SHIPROCKET_ENABLED) &&
      Boolean(env.SHIPROCKET_EMAIL) &&
      Boolean(env.SHIPROCKET_PASSWORD)
    );
  }

  /**
   * Retrieves a valid Shiprocket JWT access token.
   * Reuses unexpired token or executes login with thread-safe deduplication.
   */
  public static async getToken(): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(
        "Shiprocket shipping is currently disabled or missing API credentials."
      );
    }

    const now = Date.now();
    // Return cached token if valid with at least 1 hour safety margin
    if (this.cachedToken && this.tokenExpiresAt > now + 60 * 60 * 1000) {
      return this.cachedToken;
    }

    // Reuse in-flight request if another concurrent caller triggered login
    if (this.pendingAuthPromise) {
      return this.pendingAuthPromise;
    }

    this.pendingAuthPromise = this.performLogin().finally(() => {
      this.pendingAuthPromise = null;
    });

    return this.pendingAuthPromise;
  }

  /**
   * Executes authentication against Shiprocket API.
   */
  private static async performLogin(): Promise<string> {
    const url = `${env.SHIPROCKET_BASE_URL}/auth/login`;

    try {
      const response = await axios.post<ShiprocketLoginResponse>(
        url,
        {
          email: env.SHIPROCKET_EMAIL,
          password: env.SHIPROCKET_PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      const token = response.data?.token;
      if (!token) {
        throw new Error("Shiprocket authentication succeeded but no token was returned.");
      }

      this.cachedToken = token;
      // Shiprocket tokens expire in 10 days (240 hrs). Cache for 8 days.
      this.tokenExpiresAt = Date.now() + 8 * 24 * 60 * 60 * 1000;
      return token;
    } catch (error: any) {
      this.cachedToken = null;
      this.tokenExpiresAt = 0;

      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unknown error";

      console.error(
        `[ShiprocketAuth] Authentication failed with status ${status}: ${message}`
      );

      throw new Error(
        `Shiprocket authentication failed (${status || "Network"}): ${message}`
      );
    }
  }

  /**
   * Manually invalidates cached token (e.g. after receiving a 401 response).
   */
  public static invalidateToken(): void {
    this.cachedToken = null;
    this.tokenExpiresAt = 0;
  }
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "../../config/env";
import { ShiprocketAuthService } from "./shiprocket.auth.service";

export class ShiprocketClient {
  private static axiosInstance: AxiosInstance = axios.create({
    baseURL: env.SHIPROCKET_BASE_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  /**
   * Executes an authenticated HTTP request to Shiprocket API.
   * Retries once on 401 Unauthorized after refreshing the JWT token.
   */
  public static async request<T = any>(
    config: AxiosRequestConfig,
    retryCount: number = 0
  ): Promise<T> {
    const token = await ShiprocketAuthService.getToken();

    try {
      const mergedConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };

      const response: AxiosResponse<T> = await this.axiosInstance.request<T>(mergedConfig);
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const responseData = error?.response?.data;

      // Token might be expired or revoked on Shiprocket's end
      if (status === 401 && retryCount === 0) {
        console.warn("[ShiprocketClient] Received 401 Unauthorized, refreshing token and retrying...");
        ShiprocketAuthService.invalidateToken();
        return this.request<T>(config, retryCount + 1);
      }

      const errorMessage =
        (typeof responseData === "object" && (responseData?.message || responseData?.error)) ||
        error?.message ||
        "Shiprocket API request failed";

      console.error(
        `[ShiprocketClient] Request ${config.method?.toUpperCase()} ${config.url} failed with status ${status}:`,
        typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage)
      );

      throw new Error(`Shiprocket error (${status || "Network"}): ${errorMessage}`);
    }
  }

  public static async get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: "GET", url, params });
  }

  public static async post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: "POST", url, data });
  }
}

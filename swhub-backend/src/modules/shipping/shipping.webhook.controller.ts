import { Request, Response } from "express";
import { ShippingService } from "./shipping.service";
import { env } from "../../config/env";

export class ShippingWebhookController {
  public static async handleWebhook(req: Request, res: Response) {
    try {
      const apiKeyHeader =
        (req.headers["x-api-key"] as string) ||
        (req.headers["authorization"] as string) ||
        (req.query.token as string);

      // Verify security token if configured
      if (env.SHIPROCKET_WEBHOOK_TOKEN) {
        if (!apiKeyHeader || apiKeyHeader.trim() !== env.SHIPROCKET_WEBHOOK_TOKEN.trim()) {
          console.warn(
            "[ShippingWebhookController] Rejected unauthorized webhook call: missing or invalid token."
          );
          return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid webhook token.",
          });
        }
      }

      const payload = req.body;
      const result = await ShippingService.handleWebhook(payload, apiKeyHeader);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("[ShippingWebhookController] Webhook handling error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message || "Webhook processing failed",
      });
    }
  }
}

import { Request, Response } from "express";
import { TrustFeatureService } from "./trust-feature.service";

export class TrustFeatureController {
  static async getAll(req: Request, res: Response) {
    try {
      const features = await TrustFeatureService.getAll();
      return res.json({ success: true, data: features });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getActive(req: Request, res: Response) {
    try {
      const features = await TrustFeatureService.getActive();
      return res.json({ success: true, data: features });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const feature = await TrustFeatureService.create(req.body);
      return res.status(201).json({ success: true, message: "Created successfully", data: feature });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const feature = await TrustFeatureService.update(Number(req.params.id), req.body);
      return res.json({ success: true, message: "Updated successfully", data: feature });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await TrustFeatureService.delete(Number(req.params.id));
      return res.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

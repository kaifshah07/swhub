import { Request, Response } from "express";
import { FranchiseInvoiceService } from "./franchise-invoice.service";

export class FranchiseInvoiceController {
  static async generate(req: Request, res: Response): Promise<void> {
    try {
      const franchiseId = (req as any).user.id;
      const invoice = await FranchiseInvoiceService.generateInvoice(franchiseId, req.body);
      res.status(201).json({ success: true, data: invoice });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMyInvoices(req: Request, res: Response): Promise<void> {
    try {
      const franchiseId = (req as any).user.id;
      const invoices = await FranchiseInvoiceService.getMyInvoices(franchiseId);
      res.json({ success: true, data: invoices });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

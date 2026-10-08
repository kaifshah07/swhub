import { Request, Response } from "express";
import { VendorEnquiryService } from "./vendor-enquiry.service";

export class VendorEnquiryController {
  static async create(req: Request, res: Response) {
    try {
      const enquiry = await VendorEnquiryService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Vendor enquiry submitted successfully",
        data: enquiry,
      });
    } catch (error: any) {
      console.error("Vendor Enquiry Error:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const enquiries = await VendorEnquiryService.getAll();

      return res.json({
        success: true,
        data: enquiries,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const enquiry = await VendorEnquiryService.getById(
        Number(req.params.id)
      );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: "Vendor enquiry not found",
        });
      }

      return res.json({
        success: true,
        data: enquiry,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const enquiry =
        await VendorEnquiryService.updateStatus(
          Number(req.params.id),
          req.body.status
        );

      return res.json({
        success: true,
        message: "Vendor enquiry status updated",
        data: enquiry,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await VendorEnquiryService.delete(
        Number(req.params.id)
      );

      return res.json({
        success: true,
        message: "Vendor enquiry deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
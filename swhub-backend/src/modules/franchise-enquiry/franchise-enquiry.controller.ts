import { Request, Response } from "express";
import { FranchiseEnquiryService } from "./franchise-enquiry.service";

export class FranchiseEnquiryController {
  static async create(
    req: Request,
    res: Response
  ) {
    try {
      const enquiry =
        await FranchiseEnquiryService.create(req.body);

      return res.status(201).json({
        success: true,
        message:
          "Franchise enquiry submitted successfully",
        data: enquiry,
      });
    } catch (error: any) {
      console.error(
        "Franchise Enquiry Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Unable to submit franchise enquiry",
      });
    }
  }

  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const enquiries =
        await FranchiseEnquiryService.getAll();

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

  static async getById(
    req: Request,
    res: Response
  ) {
    try {
      const enquiry =
        await FranchiseEnquiryService.getById(
          Number(req.params.id)
        );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: "Franchise enquiry not found",
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

  static async updateStatus(
    req: Request,
    res: Response
  ) {
    try {
      const enquiry =
        await FranchiseEnquiryService.updateStatus(
          Number(req.params.id),
          req.body.status
        );

      return res.json({
        success: true,
        message: "Franchise enquiry status updated",
        data: enquiry,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
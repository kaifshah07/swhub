import { Request, Response } from "express";
import { FranchiseUserService } from "./franchise-user.service";

export class FranchiseUserController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await FranchiseUserService.createFranchiseUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(400).json({ success: false, message: "Email or phone already exists." });
        return;
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await FranchiseUserService.getAllFranchiseUsers();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await FranchiseUserService.getFranchiseUserById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ success: false, message: "Franchise user not found" });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await FranchiseUserService.updateFranchiseUser(Number(req.params.id), req.body);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async toggleStatus(req: Request, res: Response): Promise<void> {
    try {
      const { isActive } = req.body;
      const user = await FranchiseUserService.toggleStatus(Number(req.params.id), isActive);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

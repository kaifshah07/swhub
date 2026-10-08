import { Request, Response } from "express";
import { HomepageSectionService } from "./homepage-section.service";

export class HomepageSectionController {

  static async getAll(
    req: Request,
    res: Response
  ) {

    const sections =
      await HomepageSectionService.getAll();

    return res.json({
      success: true,
      data: sections,
    });

  }

  static async update(
    req: Request,
    res: Response
  ) {

    const section =
      await HomepageSectionService.update(
        String(req.params.key),
        req.body
      );

    return res.json({
      success: true,
      data: section,
    });

  }

}
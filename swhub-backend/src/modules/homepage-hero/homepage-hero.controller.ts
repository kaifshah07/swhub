import { Request, Response } from "express";
import { HomepageHeroService } from "./homepage-hero.service";
import { uploadToCloudinary } from "../../utils/cloudinaryUploads";

export class HomepageHeroController {

  static async getAll(req: Request, res: Response) {
    const data =
      await HomepageHeroService.getAll();

    return res.json({
      success: true,
      data,
    });
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {

      let desktopImage = "";
      let mobileImage = "";

      if (req.files) {

        const files =
          req.files as {
            [fieldname: string]: Express.Multer.File[];
          };

        if (files.desktopImage?.[0]) {
          const upload =
            await uploadToCloudinary(
              files.desktopImage[0].buffer,
              "balmitra/heroes"
            );

          desktopImage =
            upload.secure_url;
        }

        if (files.mobileImage?.[0]) {
          const upload =
            await uploadToCloudinary(
              files.mobileImage[0].buffer,
              "balmitra/heroes"
            );

          mobileImage =
            upload.secure_url;
        }
      }

      const hero =
        await HomepageHeroService.create({
          title: req.body.title,
          subtitle: req.body.subtitle || null,
          buttonText: req.body.buttonText || null,
          buttonUrl: req.body.buttonUrl || null,
          displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : 0,
          isActive: req.body.isActive === undefined ? true : (req.body.isActive === true || req.body.isActive === "true"),
          desktopImage,
          mobileImage: mobileImage || null,
        });

      return res.status(201).json({
        success: true,
        data: hero,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }

  static async update(
  req: Request,
  res: Response
) {
  try {

    let desktopImage;
    let mobileImage;

    if (req.files) {

      const files =
        req.files as {
          [fieldname: string]:
          Express.Multer.File[];
        };

      if (files.desktopImage?.[0]) {

        const upload =
          await uploadToCloudinary(
            files.desktopImage[0].buffer,
            "balmitra/heroes"
          );

        desktopImage =
          upload.secure_url;
      }

      if (files.mobileImage?.[0]) {

        const upload =
          await uploadToCloudinary(
            files.mobileImage[0].buffer,
            "balmitra/heroes"
          );

        mobileImage =
          upload.secure_url;
      }

    }

    const updateData: any = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.subtitle !== undefined) updateData.subtitle = req.body.subtitle || null;
    if (req.body.buttonText !== undefined) updateData.buttonText = req.body.buttonText || null;
    if (req.body.buttonUrl !== undefined) updateData.buttonUrl = req.body.buttonUrl || null;
    if (req.body.displayOrder !== undefined) updateData.displayOrder = Number(req.body.displayOrder);
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive === true || req.body.isActive === "true";
    if (desktopImage) updateData.desktopImage = desktopImage;
    if (mobileImage) updateData.mobileImage = mobileImage;

    const hero =
      await HomepageHeroService.update(
        Number(req.params.id),
        updateData
      );

    return res.json({
      success: true,
      data: hero,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}

static async delete(
  req: Request,
  res: Response
) {

  await HomepageHeroService.delete(
    Number(req.params.id)
  );

  return res.json({
    success: true,
    message:
      "Hero deleted successfully",
  });

}

}
import { Request, Response } from "express";
import { HomepageAdvertisementService } from "./homepage-advertisement.service";
import { uploadToCloudinary } from "../../utils/cloudinaryUploads";

export class HomepageAdvertisementController {

  static async getAll(
    req: Request,
    res: Response
  ) {

    const ads =
      await HomepageAdvertisementService.getAll();

    return res.json({
      success: true,
      data: ads,
    });
  }

  static async getById(
  req: Request,
  res: Response
) {

  const ad =
    await HomepageAdvertisementService.getById(
      Number(req.params.id)
    );

  return res.json({
    success: true,
    data: ad,
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
              "balmitra/ads"
            );

          desktopImage =
            upload.secure_url;
        }

        if (files.mobileImage?.[0]) {

          const upload =
            await uploadToCloudinary(
              files.mobileImage[0].buffer,
              "balmitra/ads"
            );

          mobileImage =
            upload.secure_url;
        }
      }

      const ad =
        await HomepageAdvertisementService.create({
          title: req.body.title || null,
          redirectUrl: req.body.redirectUrl || null,
          position: req.body.position || "banner_strip",
          displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : 0,
          isActive: req.body.isActive === undefined ? true : (req.body.isActive === true || req.body.isActive === "true"),
          desktopImage,
          mobileImage: mobileImage || null,
        });

      return res.status(201).json({
        success: true,
        data: ad,
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
            "balmitra/ads"
          );

        desktopImage =
          upload.secure_url;
      }

      if (files.mobileImage?.[0]) {

        const upload =
          await uploadToCloudinary(
            files.mobileImage[0].buffer,
            "balmitra/ads"
          );

        mobileImage =
          upload.secure_url;
      }
    }

    const updateData: any = {};
    if (req.body.title !== undefined) updateData.title = req.body.title || null;
    if (req.body.redirectUrl !== undefined) updateData.redirectUrl = req.body.redirectUrl || null;
    if (req.body.position !== undefined) updateData.position = req.body.position;
    if (req.body.displayOrder !== undefined) updateData.displayOrder = Number(req.body.displayOrder);
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive === true || req.body.isActive === "true";
    if (desktopImage) updateData.desktopImage = desktopImage;
    if (mobileImage) updateData.mobileImage = mobileImage;

    const ad =
      await HomepageAdvertisementService.update(
        Number(req.params.id),
        updateData
      );

    return res.json({
      success: true,
      data: ad,
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

  await HomepageAdvertisementService.delete(
    Number(req.params.id)
  );

  return res.json({
    success: true,
    message:
      "Advertisement deleted",
  });
}
}
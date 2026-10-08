import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder = "balmitra/products"
) => {
  return new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
if (error) {
  console.error("========== CLOUDINARY ERROR ==========");
  console.error("MESSAGE:", error?.message);
  console.error("HTTP CODE:", error?.http_code);
  console.error("ERROR:", JSON.stringify(error, null, 2));

  reject(error);
  return;
}
          if (!result) {
            reject(
              new Error(
                "Cloudinary upload failed"
              )
            );
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

    Readable.from(buffer).pipe(stream);
  });
};
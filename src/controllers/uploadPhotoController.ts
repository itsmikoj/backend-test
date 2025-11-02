import { Request, Response } from "express";
import multer from "multer";
import {
  updatePhotoUrlService,
  uploadUserPhotoService,
} from "../services/profileService";
import { createResponse } from "../utils/globalResponse";
import sharp from "sharp";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5 MB
  // fileFilter: (req, file, cb) => {
  //   const allowed = [
  //     "image/jpeg",
  //     "image/png",
  //     "image/webp",
  //     "image/heic",
  //     "image/heif",
  //   ];
  //   if (!allowed.includes(file.mimetype)) {
  //     return cb(
  //       new Error("Only JPG, PNG, WEBP, HEIC or HEIF images are allowed.")
  //     );
  //   }
  //   cb(null, true);
  // },
});

export const uploadPhotoController = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const file = req.file;

    if (!file) throw new Error("No file uploaded");

    // ✅ Validar tipo de archivo
    if (!file.mimetype.startsWith("image/"))
      throw new Error("Invalid file type");

    // ✅ Optimizar imagen
    const optimized = await sharp(file.buffer)
      .resize(256, 256, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();

    // Subida a Supabase
    const publicUrl = await uploadUserPhotoService(optimized, user.id);

    // Guardar en tabla profile
    const profile = await updatePhotoUrlService(user.id, publicUrl);

    return res.json(
      createResponse({
        message: "Avatar uploaded successfully",
        data: profile,
      })
    );
  } catch (error: any) {
    res.status(500).json(
      createResponse({
        statusCode: 500,
        message: "Error uploading photo",
        detail: error.message || "Internal Server Error",
        data: null,
      })
    );
  }
};

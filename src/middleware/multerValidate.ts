/*import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

export const videoUpload = multer({
  dest: "uploads/",
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});*/

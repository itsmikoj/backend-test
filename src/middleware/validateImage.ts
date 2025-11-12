import { Request, Response, NextFunction } from "express";

export function validateImage(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "You must send an image in the 'image' field" });
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: `Unsupported format. Only allowed: ${allowedTypes.join(", ")}`,
    });
  }

  next();
}

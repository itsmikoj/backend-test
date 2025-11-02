import multer from "multer";
import { Request, Response, NextFunction } from "express";

export function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: `El campo '${err.field}' no es válido. Solo aceptamos el campo 'image'.`,
      });
    }
    return res
      .status(400)
      .json({ message: `Error en subida de archivo: ${err.message}` });
  }

  next(err);
}

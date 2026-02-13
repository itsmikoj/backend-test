import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validatePathParameter =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        message: "Invalid request params",
        errors: result.error.format(),
      });
      return;
    }

    req.params = result.data;
    next();
  };

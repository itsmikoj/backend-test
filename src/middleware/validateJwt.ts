import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabaseClient";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  // Verify token against Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (user === null || error) {
    // console.log("error->", error);
    res.status(401).json({ error: "Token is invalid or expired" });
    return;
  }

  req["user"] = user;
  next();
};

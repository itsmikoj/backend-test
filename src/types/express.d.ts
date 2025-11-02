import { User } from "@supabase/supabase-js";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

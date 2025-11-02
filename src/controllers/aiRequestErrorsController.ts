import { Request, Response } from "express";
import { AiRequestErrorsInput } from "../validators/ai_request_errors/ai_request_errors.validator";
import { createAiRequestErrorsService } from "../services/aiRequestErrorsService";

export const createAiRequestErrorsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { endpoint, request_payload, status_code } =
      req.body as AiRequestErrorsInput;

    const data = await createAiRequestErrorsService({
      endpoint,
      request_payload,
      status_code,
    });

    res.status(201).json({
      ok: true,
      message: "AI request error logged successfully",
      data,
      dateTime: new Date().toISOString(),
      detail: "Returned newly created AI request error",
    });
  } catch (error) {
    console.log("Error logging AI request error:", error);

    res.status(500).json({
      ok: false,
      message: "Error logging AI request error",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

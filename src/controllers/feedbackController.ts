import { Request, Response } from "express";
import { FeedbackInput } from "../validators/feedback/feedbackValidator";
import { sendFeedbackService } from "../services/feedbackService";

export const feedbackController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as FeedbackInput;

    const feedback = await sendFeedbackService(body);

    res.status(201).json({
      ok: true,
      message: "Feedback received successfully",
      data: feedback,
      dateTime: new Date().toISOString(),
      detail: null,
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error processing feedback",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

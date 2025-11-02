import { Feedback } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";
import { FeedbackInput } from "../validators/feedback/feedbackValidator";

export const sendFeedbackService = async (
  body: FeedbackInput
): Promise<Feedback> => {
  const { data, error } = await supabase
    .from("feedback")
    .insert({ message: body.message })
    .select("message, created_at")
    .single();

  if (error) {
    throw new Error(`DB: ${error.message}`);
  }

  return data as Feedback;
};

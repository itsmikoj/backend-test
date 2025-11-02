import { AiRequestErrorsInput } from "../validators/ai_request_errors/ai_request_errors.validator";
import { supabase } from "../utils/supabaseClient";

export const createAiRequestErrorsService = async (
  body: AiRequestErrorsInput
) => {
  const { data, error } = await supabase
    .from("ai_request_errors")
    .insert(body)
    .select("*");

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data;
};

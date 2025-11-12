import { supabase } from "../../utils/supabaseClient";

export const getDailyPhaseHistory = async (day: string) => {
  const { data, error } = await supabase
    .from("phrase_history_en_cloudinary")
    .select("phrase, createdAt, phrase_es, id")
    .eq("createdAt", day)
    .maybeSingle();

  if (error) throw new Error(`DB getDailyPhaseHistory: ${error.message}`);

  return data;
};

import { generatePrayer } from "../prompts/dailyPrayerPrompt";
import { fetchOpenAIResponse } from "../utils/fetchOpenAI";
import { supabase } from "../utils/supabaseClient";

type Answer = "Good" | "Bad" | "Bien" | "Mal" | "Neutral";

export const getCitationService = async (): Promise<any> => {
  const fetchPhrase = async (id: number) => {
    const { data, error } = await supabase
      .from("phrase")
      .select("phrase, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) throw new Error(`DB(id: ${id}): ${error?.message}`);

    return data;
  };

  const updatePhrase = async (
    id: number,
    phrase: string,
    updated_at: string
  ) => {
    const { error } = await supabase
      .from("phrase")
      .update({ phrase, updated_at })
      .eq("id", id);

    if (error) throw new Error(`Update failed for id ${id}: ${error.message}`);
  };

  const randomID = async (): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from("phrase_history_en")
        .select("*", { count: "exact", head: true });

      if (error) throw new Error(`DB Count: ${error.message}`);
      if (!count || count === 0) throw new Error("No phrases in DB");

      return Math.floor(Math.random() * count) + 1;
    } catch (error) {
      console.error("Error fetching random ID:", error);
      return 1;
    }
  };

  const fetchRandomPhrase = async (table: string, randomID: number) => {
    const { data, error } = await supabase
      .from(table)
      .select("id, phrase")
      .eq("id", String(randomID))
      .maybeSingle();

    if (error) throw new Error(`DB: ${error.message}`);

    return data?.phrase ?? null;
  };

  const enData = await fetchPhrase(1);
  const esData = await fetchPhrase(2);

  const currentHour = new Date().getHours();
  const updatedHour = parseInt(enData.updated_at.split(":")[0]);

  if (currentHour !== updatedHour) {
    try {
      const randomIDValue = await randomID();
      const newEN = await fetchRandomPhrase("phrase_history_en", randomIDValue);
      const newES = await fetchRandomPhrase("phrase_history_es", randomIDValue);

      const newTime = `${currentHour.toString().padStart(2, "0")}:00:00`;

      await updatePhrase(1, newEN, newTime);
      await updatePhrase(2, newES, newTime);

      enData.phrase = newEN;
      esData.phrase = newES;
      enData.updated_at = newTime;
      console.log(`Phrases updated to ID ${randomIDValue}`);
    } catch (error) {
      console.error("Error updating phrases, keeping existing ones.", error);
    }
  }

  return {
    phrase: {
      en: enData.phrase,
      es: esData.phrase,
    },
    updated_at: enData.updated_at,
  };
};

export const createPrayerService = async (
  answer: Answer,
  lang: string
): Promise<string> => {
  const type = resolveType(answer, lang);

  const { data, error } = await supabase
    .from("prayer")
    .select("prayer")
    .eq("answer", type);

  if (error) {
    console.error("Supabase error:", error.message);
    throw new Error("No se pudo obtener la oración");
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  const randomItem = data[randomIndex].prayer;

  return randomItem;
};

function resolveType(answer: Answer, lang: string): string {
  const map: Record<Answer, string> = {
    Good: "Good",
    Bad: "Bad",
    Bien: "Bien",
    Mal: "Mal",
    Neutral: lang === "en" ? "NeutralEn" : "NeutralEs",
  };

  return map[answer] ?? "NeutralEn";
}

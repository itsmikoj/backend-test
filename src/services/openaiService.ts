import { generatePrayer } from "../prompts/dailyPrayerPrompt";
import { fetchOpenAIResponse } from "../utils/fetchOpenAI";
import { supabase } from "../utils/supabaseClient";

type Answer = "Good" | "Bad" | "Bien" | "Mal" | "Neutral";

export const getCitationService = async (table: string): Promise<any> => {
  const fetchPhrase = async (id: number) => {
    const { data, error } = await supabase
      .from(table)
      .select("phrase, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) throw new Error(`DB(id: ${id}): ${error?.message}`);
    return data;
  };

  const updatePhrase = async (id: number, phrase: string) => {
    const now = new Date();

    if (table === "phrase") {
      const timeOnly = now.toTimeString().split(" ")[0];
      const { error } = await supabase
        .from(table)
        .update({ phrase, updated_at: timeOnly })
        .eq("id", id);

      if (error) throw new Error(`Update failed (phrase) id ${id}: ${error.message}`);
    } else {
      const timestamp = now.toISOString();
      const { error } = await supabase
        .from(table)
        .update({ phrase, updated_at: timestamp })
        .eq("id", id);

      if (error) throw new Error(`Update failed (phrase_app) id ${id}: ${error.message}`);
    }
  };

  const randomID = async (): Promise<number> => {
    const { count, error } = await supabase
      .from("phrase_history_en")
      .select("*", { count: "exact", head: true });

    if (error) throw new Error(`DB Count: ${error.message}`);
    if (!count || count === 0) throw new Error("No phrases in DB");

    return Math.floor(Math.random() * count) + 1;
  };

  const fetchRandomPhrase = async (tableHistory: string, randomID: number) => {
    const { data, error } = await supabase
      .from(tableHistory)
      .select("phrase")
      .eq("id", String(randomID))
      .maybeSingle();

    if (error) throw new Error(`DB Fetch: ${error.message}`);
    return data?.phrase ?? null;
  };

  const enData = await fetchPhrase(1);
  const esData = await fetchPhrase(2);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updatedAt = new Date(enData.updated_at || 0);
  updatedAt.setHours(0, 0, 0, 0);

  if (today.getTime() !== updatedAt.getTime()) {
    try {
      const randomIDValue = await randomID();
      const newEN = await fetchRandomPhrase("phrase_history_en", randomIDValue);
      const newES = await fetchRandomPhrase("phrase_history_es", randomIDValue);

      await updatePhrase(1, newEN);
      await updatePhrase(2, newES);

      enData.phrase = newEN;
      esData.phrase = newES;
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

  if (error) throw new Error("No se pudo obtener la oración");

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex].prayer;
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
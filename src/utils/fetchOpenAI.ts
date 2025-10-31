import OpenAI from "openai";
import { config } from "../config/config";

const client = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const fetchOpenAIResponse = async (prompt: string): Promise<string> => {
  const today = new Date().toISOString().slice(0, 10);
  const randomSeed = Math.random().toString(36).substring(2, 8);

  const dynamicPrompt = `${prompt}\nToday: ${today}, Seed: ${randomSeed}`;

  try {
    const data = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: dynamicPrompt }],
      max_tokens: 150,
    });

    return data.choices[0]?.message?.content || "No response";
  } catch (error: any) {
    throw new Error("OpenAI Error: " + (error.message || error.toString()));
  }
};

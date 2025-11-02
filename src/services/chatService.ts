import { Response } from "express";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { MODEL_GPT_4O_MINI } from "../prompts/model";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface StreamChatOptions {
  messages: ChatCompletionMessageParam[];
  temperature?: number;
  maxTokens?: number;
}

export const streamChat = async (res: Response, options: StreamChatOptions) => {
  const { messages, temperature = 0.7, maxTokens = 500 } = options;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: MODEL_GPT_4O_MINI,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Stream error:", err);
    res.write(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`);
    res.end();
  }
};

import { Request, Response } from "express";
import { streamChat } from "../services/chatService";
import type { StreamingDTO } from "../validators/streamingValidator";

export const streamChatController = async (req: Request, res: Response) => {
  const { messages } = req.body as StreamingDTO;

  await streamChat(res, { messages });
};

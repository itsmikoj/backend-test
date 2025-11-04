import { Request, Response } from "express";
import * as triviaService from "../services/trivia.service";
import { getOneQuestionPerTopic } from "../utils/triviaQuestion";

export const createTriviaSessionController = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        console.log(user)
        const result = await triviaService.createSession(user.id);
        res.json(result);
    } catch (error: any) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: error.message || "Error creating session" });
    }
};

export const joinTriviaSessionController = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        const { sessionCode } = req.body;
        const result = await triviaService.joinSession(sessionCode, user.id);
        console.log("Player: ", result.player)
        console.log("GameState: ", result.gameState)
        res.json(result);
    } catch (error: any) {
        console.error("Error joining session:", error);
        res.status(500).json({ error: error.message || "Error joining session" });
    }
};

export const startTriviaSessionController = async (req: Request, res: Response) => {
    try {
        const user = req.user!
        const { sessionCode } = req.body;
        await triviaService.startGame(sessionCode, user.id);
        res.json({ success: true });
    } catch (error: any) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: error.message || "Error starting game" });
    }
};

export const submitFinalScoresController = async (req: Request, res: Response) => {
    try {
        const user = req.user!
        const { sessionCode, score } = req.body;
        console.log(user.id)
        console.log(sessionCode)
        console.log(score)
        if (!sessionCode || !user.id || score === undefined) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }
        console.log("Received score from:", user.id)
        const result = await triviaService.processFinalScore(sessionCode, user.id, score);
        res.json({
            success: true,
            message: 'Score recibido',
            received: result?.received,
            total: result?.total
        });

    } catch (error: any) {
        console.error('Error en submit-final-scores:', error);
        res.status(500).json({ error: error.message });
    }
};

export const leaveTriviaSessionController = async (req: Request, res: Response) => {
    try {
        const user = req.user!
        const { sessionCode } = req.body;
        if (!sessionCode || !user.id)
            return res.status(400).json({ error: "Datos incompletos" });

        await triviaService.leaveSession(sessionCode, user.id);
        res.json({ success: true, message: "Jugador eliminado del lobby" });
    } catch (error: any) {
        console.error("Error leaving session:", error);
        res.status(500).json({ error: error.message || "Error leaving session" });
    }
};

export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await getOneQuestionPerTopic();

        res.status(200).json({
            ok: true,
            message: "Questions retrieved successfully",
            data: questions,
            dateTime: new Date().toISOString(),
            detail: "",
        });
    } catch (error: any) {
        console.error('Error fetching questions:', error);

        res.status(500).json({
            ok: false,
            message: "Error retrieving questions",
            data: null,
            dateTime: new Date().toISOString(),
            detail: error.message,
        });
    }
};

export const getTriviaStatusController = async (req: Request, res: Response) => {
    try {
        const { sessionCode } = req.body;
        const result = await triviaService.statusSession(sessionCode);
        res.json({
            status: result
        });
    } catch (error: any) {
        console.error("Error status session:", error);
        res.status(500).json({ error: error.message || "Error status session" });
    }
};

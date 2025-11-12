import { Router } from "express";
import {
    createTriviaSessionController,
    getQuestions,
    joinTriviaSessionController,
    leaveTriviaSessionController,
    startTriviaSessionController,
    submitFinalScoresController
} from "../controllers/triviaController";
import { authenticate } from "../middleware/validateJwt";

const triviaRoutes = Router();
triviaRoutes.use(authenticate)

triviaRoutes.post('/create-session', createTriviaSessionController)
triviaRoutes.post('/join-session', joinTriviaSessionController)
triviaRoutes.post('/start-game', startTriviaSessionController)
triviaRoutes.post('/final-scores', submitFinalScoresController)
triviaRoutes.post("/leave-session", leaveTriviaSessionController);
triviaRoutes.get("/questions", getQuestions)

export default triviaRoutes;

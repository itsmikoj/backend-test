import { GameSession } from "../types/TriviaTypes";
import {
    createInitialGameState,
    createPlayer,
    broadcastGameState,
    requireHost,
    generateSessionCode,
} from "../utils/triviaSession";
import { playerOperations } from "../utils/playerOperations";
import { getOneQuestionPerTopic } from "../utils/triviaQuestion";
import { gameSessionManager } from "../utils/sessionManager";
import { sessionPlayersUpdater } from "../utils/triviaSession";
import { finalScoreProcessor } from "../utils/finalScoreProcessor";
import { sendToChannel } from "../utils/supabaseChannel";
import { getProfileService } from "./profileService";

export const getSession = gameSessionManager.getSession;
export const processFinalScore = finalScoreProcessor.processFinalScore;
export const cleanupPendingScores = finalScoreProcessor.cleanupPendingScores;

export const createSession = async (userId: string) => {
    console.log("Creando session para:", userId);
    const profile = await getProfileService(userId);

    const sessionCode = generateSessionCode();
    const player = createPlayer(
        {
            id: profile.id,
            username: profile.username || "",
            fullName: profile.full_name,
        },
        true
    );

    const gameState = createInitialGameState();

    gameState.players = [player];
    gameState.host = player.id;

    const session: GameSession = {
        gameState,
        players: new Map([[player.id, player]]),
        lastActivity: Date.now(),
    };

    gameSessionManager.setSession(sessionCode, session);
    console.log("session creada")
    return { sessionCode, player, gameState };
};

export const joinSession = async (sessionCode: string, userId: string) => {
    const session = gameSessionManager.getSession(sessionCode);
    
    if (session.gameState.gameStarted === true) {
        throw new Error("Game Started");
    }
    const profile = await getProfileService(userId);

    const newPlayer = createPlayer(
        {
            id: profile.id,
            username: profile.username || "",
            fullName: profile.full_name,
        },
        false
    );

    session.players.set(newPlayer.id, newPlayer);
    sessionPlayersUpdater.updateSessionPlayers(session);
    await broadcastGameState(sessionCode, session);

    return { player: newPlayer, gameState: session.gameState };
};

export const startGame = async (sessionCode: string, playerId: string) => {
    const session = gameSessionManager.getSession(sessionCode);
    requireHost(session, playerId);

    const selectedQuestions = getOneQuestionPerTopic();

    session.gameState = {
        ...session.gameState,
        gameStarted: true,
        gameEnded: false,
        currentQuestion: 0,
        showResults: false,
        questions: selectedQuestions,
        timeRemaining: 15,
    };

    playerOperations.resetAll(session.players);
    sessionPlayersUpdater.updateSessionPlayers(session);

    await broadcastGameState(sessionCode, session);
};

export const leaveSession = async (sessionCode: string, playerId: string) => {
    console.log("Recibido leave de:", playerId, "en", sessionCode);
    const session = gameSessionManager.getSession(sessionCode);
    if (!session) throw new Error("Session not found");

    const wasHost = session.gameState.host === playerId;
    session.players.delete(playerId);

    if (wasHost) {
        console.log(`El host (${playerId}) abandonó la sesión ${sessionCode}. Eliminando sesión completa.`);
        gameSessionManager.deleteSession(sessionCode);
        await sendToChannel(sessionCode, "host-left", { reason: "host_left" });
        return;
    }

    if (session.players.size === 0) {
        console.log(`La sesión ${sessionCode} quedó vacía. Eliminando...`);
        gameSessionManager.deleteSession(sessionCode);
        return;
    }

    sessionPlayersUpdater.updateSessionPlayers(session);
    await broadcastGameState(sessionCode, session);
    console.log("Broadcast actualizado tras salida");
};

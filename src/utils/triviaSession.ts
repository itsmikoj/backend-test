import { GameSession, GameState, Player } from "../types/TriviaTypes";
import { playerOperations } from "./playerOperations";
import { sendToChannel } from "./supabaseChannel";

export const generateSessionCode = (): string =>
    Array.from({ length: 4 }, () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
    ).join("");

export const createInitialGameState = (): GameState => ({
    currentQuestion: 0,
    questions: {},
    players: [],
    gameStarted: false,
    finalScores: {},
    gameEnded: false,
    timeRemaining: 30,
    showResults: false,
    host: null,
});

export const createPlayer = (
    profile: { id: string; username?: string; fullName: string },
    isHost = false
): Player => ({
    id: profile.id,
    fullName: profile.fullName,
    username: profile.username,
    score: 0,
    hasAnswered: false,
    currentAnswer: undefined,
    isHost,
});

export const sessionPlayersUpdater = {
    updateSessionPlayers: (session: GameSession): void => {
        session.gameState.players = playerOperations.getAllPlayersArray(session.players);
        session.lastActivity = Date.now();
    }
};

export const broadcastGameState = async (sessionCode: string, session: GameSession): Promise<void> => {
    await sendToChannel(sessionCode, "game-state-update", {
        gameState: session.gameState,
        source: "backend"
    });
};

export const requireHost = (session: GameSession, playerId: string): GameSession => {
    const player = session.players.get(playerId);
    if (!player || !player.isHost) {
        throw new Error("You do not have permissions to perform this action");
    }
    return session;
};


import { GameSession } from "../types/TriviaTypes";

const gameSessions = new Map<string, GameSession>();

export const gameSessionManager = {
    getSession: (sessionCode: string): GameSession => {
        console.log("Todas las sessiones: ", gameSessions)
        const session = gameSessions.get(sessionCode);
        if (!session) {
            throw new Error("Session not found");
        }
        return session;
    },

    setSession: (sessionCode: string, session: GameSession): void => {
        gameSessions.set(sessionCode, session);
        console.log("Todas las Sesiones: ", gameSessions)
    },

    hasSession: (sessionCode: string): boolean => {
        return gameSessions.has(sessionCode);
    },

    deleteSession: (sessionCode: string): boolean => {
        return gameSessions.delete(sessionCode);
    }
};
import { GameSession } from "../types/TriviaTypes";
import { sendToChannel } from "./supabaseChannel";
import { gameSessionManager } from "./sessionManager";

const { getSession } = gameSessionManager;

const pendingFinalScores = new Map<string, {
    scores: Map<string, number>;
    submittedPlayers: Set<string>;
    timeout: NodeJS.Timeout | null;
    session: GameSession;
    isFinalizing: boolean;
}>();

const getMedalForPosition = (position: number): string => {
    switch (position) {
        case 0: return '🥇';
        case 1: return '🥈';
        case 2: return '🥉';
        default: return '🎯';
    }
};

const initializePendingScores = (sessionCode: string, session: GameSession) => {
    if (pendingFinalScores.has(sessionCode)) return;

    const pendingSession = {
        scores: new Map<string, number>(),
        submittedPlayers: new Set<string>(),
        timeout: setTimeout(() => {
            finalizeAndBroadcastLeaderboard(sessionCode, session, true);
        }, 15000),
        session: session,
        isFinalizing: false
    };

    pendingFinalScores.set(sessionCode, pendingSession);
};

const finalizeAndBroadcastLeaderboard = async (sessionCode: string, session: GameSession, isTimeout: boolean = false) => {
    const pendingSession = pendingFinalScores.get(sessionCode);
    if (!pendingSession) {
        return;
    }

    if (pendingSession.isFinalizing) {
        return;
    }
    pendingSession.isFinalizing = true;

    try {
        if (pendingSession.timeout) {
            clearTimeout(pendingSession.timeout);
            pendingSession.timeout = null;
        }

        const leaderboard = Array.from(pendingSession.scores.entries())
            .map(([playerId, score]) => {
                const player = session.players.get(playerId);
                return {
                    playerId,
                    username: player?.username || `user-${playerId.slice(-4)}`,
                    fullName: player?.fullName || `Jugador ${playerId.slice(-4)}`,
                    score: score,
                    position: 0,
                    isHost: player?.isHost || false
                };
            })
            .sort((a, b) => b.score - a.score)
            .map((player, index) => ({
                ...player,
                position: index + 1,
                medal: getMedalForPosition(index)
            }));

        pendingSession.scores.forEach((score, playerId) => {
            const player = session.players.get(playerId);
            if (player) {
                player.score = score;
            }
        });

        await sendToChannel(sessionCode, "final-leaderboard", {
            leaderboard,
            timestamp: new Date().toISOString(),
            totalPlayers: leaderboard.length,
            sessionCode,
            isTimeout,
            allPlayersSubmitted: !isTimeout
        });

    } catch (error) {
        pendingSession.isFinalizing = false;
        throw error;
    } finally {
        if (pendingSession.isFinalizing) {
            try {
                gameSessionManager.deleteSession(sessionCode);
            } catch (e) {
                console.error(`Error eliminando sesión:`, e);
            }
            pendingFinalScores.delete(sessionCode);
        }
    }

    return {
        success: true,
        received: pendingSession.scores.size,
        total: session.players.size,
        isTimeout
    };
};

export const finalScoreProcessor = {
    processFinalScore: async (sessionCode: string, playerId: string, score: number) => {

        const session = getSession(sessionCode);
        if (!session) {
            throw new Error('Sesión no encontrada');
        }

        if (!pendingFinalScores.has(sessionCode)) {
            initializePendingScores(sessionCode, session);
        }

        const pendingSession = pendingFinalScores.get(sessionCode);
        if (!pendingSession) {
            throw new Error('Error inicializando sesión pendiente');
        }

        pendingSession.scores.set(playerId, score);
        pendingSession.submittedPlayers.add(playerId);

        const allPlayers = Array.from(session.players.keys());
        const allSubmitted = allPlayers.every(playerId =>
            pendingSession.submittedPlayers.has(playerId)
        );

        if (allSubmitted) {
            return await finalizeAndBroadcastLeaderboard(sessionCode, session, false);
        } else {
            const waitingPlayers = allPlayers.filter(id => !pendingSession.submittedPlayers.has(id));
            const waitingMsg = `⏳ Esperando ${waitingPlayers.length} jugadores: ${waitingPlayers.join(', ')}`;

            return {
                success: true,
                received: pendingSession.submittedPlayers.size,
                total: allPlayers.length,
                waiting: true,
                message: waitingMsg,
                waitingPlayers: waitingPlayers
            };
        }
    },

    cleanupPendingScores: (sessionCode: string) => {
        const pendingSession = pendingFinalScores.get(sessionCode);
        if (pendingSession) {
            if (pendingSession.timeout) {
                clearTimeout(pendingSession.timeout);
            }
            pendingFinalScores.delete(sessionCode);
            console.log(`✅ Sesión ${sessionCode} limpiada manualmente`);
        }
    },

    forceFinalize: async (sessionCode: string) => {
        const session = getSession(sessionCode);
        if (!session) {
            throw new Error('Sesión no encontrada');
        }
        return await finalizeAndBroadcastLeaderboard(sessionCode, session, true);
    },

    getPendingStatus: (sessionCode: string) => {
        const pending = pendingFinalScores.get(sessionCode);
        if (!pending) return null;

        return {
            scores: Array.from(pending.scores.entries()),
            submittedPlayers: Array.from(pending.submittedPlayers),
            totalPlayers: pending.session.players.size,
            isFinalizing: pending.isFinalizing,
            waitingPlayers: Array.from(pending.session.players.keys())
                .filter(id => !pending.submittedPlayers.has(id))
        };
    }
};

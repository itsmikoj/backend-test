import { Player } from "../types/TriviaTypes";

export const playerOperations = {
    resetAnswers(players: Map<string, Player>): void {
        players.forEach(player => {
            player.hasAnswered = false;
            player.currentAnswer = undefined;
        });
    },

    updateScores(players: Map<string, Player>, finalScores: Record<string, number>): void {
        Object.entries(finalScores).forEach(([playerId, score]) => {
            const player = players.get(playerId);
            if (player) {
                player.score = score;
            }
        });
    },

    getScores(players: Map<string, Player>): Record<string, number> {
        const scores: Record<string, number> = {};
        players.forEach((player, playerId) => {
            scores[playerId] = player.score;
        });
        return scores;
    },

    resetAll(players: Map<string, Player>): void {
        players.forEach(player => {
            player.hasAnswered = false;
            player.currentAnswer = undefined;
            player.score = 0;
        });
    },

    getAllPlayersArray(players: Map<string, Player>): Player[] {
        return Array.from(players.values());
    },

    hasAllPlayersAnswered(players: Map<string, Player>): boolean {
        return Array.from(players.values()).every(player => player.hasAnswered);
    }
};

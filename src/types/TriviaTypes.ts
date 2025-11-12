export interface Player {
    id: string;
    fullName: string;
    username?: string;
    score: number;
    hasAnswered: boolean;
    currentAnswer?: string;
    isHost: boolean;
}

export interface Question {
    topic: string;
    question: string;
    options: string[];
    answer: string;
}

export interface GameState {
    currentQuestion: number;
    questions: Record<string, Question[]>;
    players: Player[];
    gameStarted: boolean;
    finalScores: Record<string, number>,
    gameEnded: boolean;
    timeRemaining: number;
    showResults: boolean;
    host: string | null;
}

export interface GameSession {
    gameState: GameState;
    lastActivity: number;
    players: Map<string, Player>;
    timerInterval?: NodeJS.Timeout;
}

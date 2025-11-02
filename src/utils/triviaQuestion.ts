import { Question } from "../types/TriviaTypes";
import { loadTopicQuestions } from "../utils/fileLoader";

export function getOneQuestionPerTopic(): { en: Question[], es: Question[] } {
    const topics = [
        'bible-stories',
        'faith-beliefs',
        'people-bible',
        'places-events',
        'worship-music',
        'christian-life',
        'faith-culture'
    ];

    const questionsEn: Question[] = [];
    const questionsEs: Question[] = [];

    for (const topic of topics) {
        // Cargar preguntas del topic en ambos idiomas
        const topicQuestionsEn = loadTopicQuestions('en', topic);
        const topicQuestionsEs = loadTopicQuestions('es', topic);

        if (topicQuestionsEn.length > 0 && topicQuestionsEs.length > 0) {
            // Seleccionar el MISMO índice aleatorio para ambos idiomas
            const randomIndex = Math.floor(Math.random() * topicQuestionsEn.length);

            questionsEn.push(topicQuestionsEn[randomIndex]);
            questionsEs.push(topicQuestionsEs[randomIndex]);
        }
    }

    // Mezclar el orden (mismo orden para ambos idiomas)
    const shuffledIndices = shuffleArray([...Array(questionsEn.length).keys()]);

    return {
        en: shuffledIndices.map(i => questionsEn[i]),
        es: shuffledIndices.map(i => questionsEs[i])
    };
}

// Función para mezclar arrays
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
import { Question } from "../types/TriviaTypes";
import { loadTopicQuestions } from "../utils/fileLoader";

export function getOneQuestionPerTopic(): { en: Question[], es: Question[] } {
    const topics = [
        'famous-stories',
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
        const topicQuestionsEn = loadTopicQuestions('en', topic);
        const topicQuestionsEs = loadTopicQuestions('es', topic);

        if (topicQuestionsEn.length > 0 && topicQuestionsEs.length > 0) {
            const randomIndex = Math.floor(Math.random() * topicQuestionsEn.length);

            const shuffleOrder = shuffleArray([...Array(topicQuestionsEn[randomIndex].options.length).keys()]);

            const questionEn = {
                ...topicQuestionsEn[randomIndex],
                options: shuffleOrder.map(i => topicQuestionsEn[randomIndex].options[i])
            };

            const questionEs = {
                ...topicQuestionsEs[randomIndex],
                options: shuffleOrder.map(i => topicQuestionsEs[randomIndex].options[i])
            };

            questionsEn.push(questionEn);
            questionsEs.push(questionEs);
        }
    }

    const shuffledIndices = shuffleArray([...Array(questionsEn.length).keys()]);

    return {
        en: shuffledIndices.map(i => questionsEn[i]),
        es: shuffledIndices.map(i => questionsEs[i])
    };
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

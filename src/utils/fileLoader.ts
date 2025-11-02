import fs from "node:fs"
import path from "path";
import { Question } from "../types/TriviaTypes";

export const loadTopicQuestions = (language: string, topic: string): Question[] => {
    try {
        const filePath = path.join(process.cwd(), 'src', 'questions', language, `${topic}.json`);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        return Array.isArray(data.questions) ? data.questions : [];
    } catch (error) {
        console.error(`Error loading ${topic} questions for ${language}:`, error);
        return [];
    }
};
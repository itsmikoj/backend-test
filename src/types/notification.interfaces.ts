export interface NotificationResult {
    totalMessages: number;
    totalChunks: number;
    results: OneSignalResponse[];
    message?: string;
    status?: 'success' | 'outside_hours' | 'no_users' | 'error';
}

export interface OneSignalResponse {
    id: string;
    errors?: any;
    url?: string;
}

export interface Message {
    title: string;
    body: string;
}

export interface MultiLanguageMessage {
    en: Message;
    es: Message;
}

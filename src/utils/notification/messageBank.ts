import { Message, MultiLanguageMessage } from "../../types/notification.interfaces";

const MESSAGE_BANK: {
    es: Message;
    en: Message;
}[] = [
        {
            es: {
                title: "Tu racha de oración te espera 🙏",
                body: "No la rompas ahora, abre la app y di la oración de hoy. Mantén tu fuego encendido. 🔥"
            },
            en: {
                title: "Your prayer streak is waiting 🙏",
                body: "Don't break it now, open the app and say today's prayer. Keep your fire burning. 🔥"
            }
        },
        {
            es: {
                title: "Él espera escucharte 🙏",
                body: "Solo una oración puede cambiarlo todo. Continúa tu racha hoy."
            },
            en: {
                title: "He's waiting to hear from you 🙏",
                body: "Just one prayer can change everything. Continue your streak today."
            }
        },
        {
            es: {
                title: "Toma 2 minutos para reconectar con Dios 🙏",
                body: "Tu racha de oración te ayuda a mantener la constancia, una oración a la vez."
            },
            en: {
                title: "Take 2 minutes to reconnect with God 🙏",
                body: "Your prayer streak helps you stay consistent, one prayer at a time."
            }
        }
    ];

export function getRandomMessage(): MultiLanguageMessage {
    const randomIndex = Math.floor(Math.random() * MESSAGE_BANK.length);
    return MESSAGE_BANK[randomIndex];
}

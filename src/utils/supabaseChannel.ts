import { supabase } from "../utils/supabaseClient";

const channels = new Map<string, any>();

export const getChannel = async (sessionCode: string) => {
    if (!channels.has(sessionCode)) {
        const newChannel = supabase.channel(`session-${sessionCode}`);
        await newChannel.subscribe();
        channels.set(sessionCode, newChannel);
    }
    return channels.get(sessionCode)!;
};

export const sendToChannel = async (sessionCode: string, event: string, data: any): Promise<boolean> => {
    try {
        const channel = await getChannel(sessionCode);
        await channel.send({ type: 'broadcast', event, payload: data });
        console.log(`Event ${event} sent to ${sessionCode}`);
        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        return false;
    }
};

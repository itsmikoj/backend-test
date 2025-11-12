import { Request, Response } from "express";
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
);

export async function getTokenStream(req: Request, res: Response) {
    try {
        const user = req.user!
        const userId = user.id;
        const { userName, photoUrl } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        await serverClient.upsertUser({
            id: userId,
            name: userName || 'User',
            image: photoUrl || undefined,
        });

        const token = serverClient.createToken(userId);

        return res.status(200).json({ token, userId });
    } catch (error) {
        console.error('Error generating Stream token:', error);
        return res.status(500).json({ error: 'Failed to generate token' });
    }
}

export async function CreateController(req: Request, res: Response) {
    try {
        const user = req.user!
        const userId = user.id;
        const { friendId } = req.body;

        if (!userId || !friendId) {
            return res.status(400).json({ error: 'userId and friendId are required' });
        }

        const channel = serverClient.channel('messaging', {
            members: [userId, friendId],
            created_by_id: userId,
        });

        await channel.create();

        return res.status(200).json({
            channelId: channel.id,
            channelType: channel.type
        });
    } catch (error) {
        console.error('Error creating DM channel:', error);
        return res.status(500).json({ error: 'Failed to create channel' });
    }
}

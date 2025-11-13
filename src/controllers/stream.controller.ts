import { Request, Response } from "express";
import { StreamChat } from 'stream-chat';
import { getProfileService } from "../services/profileService";

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

        // Crear/actualizar usuario en Stream
        await serverClient.upsertUser({
            id: userId,
            name: userName || 'User',
            image: photoUrl || undefined,
        });

        // Generar token
        const token = serverClient.createToken(userId);

        console.log('✅ Token generado para usuario:', userId);

        return res.status(200).json({ token, userId });
    } catch (error) {
        console.error('❌ Error generating Stream token:', error);
        return res.status(500).json({ error: 'Failed to generate token' });
    }
}

export async function CreateController(req: Request, res: Response) {
    try {
        const user = req.user!
        const userId = user.id;
        const { friendId } = req.body;

        console.log('🔄 Creando canal DM entre:', userId, 'y', friendId);

        if (!userId || !friendId) {
            return res.status(400).json({ error: 'userId and friendId are required' });
        }

        // 1. Obtener datos del amigo desde Supabase
        const friendProfile = await getProfileService(friendId)
        const userProfile = await getProfileService(userId)

        if (!friendProfile) {
            console.error('❌ Error obteniendo perfil del amigo:');
            return res.status(404).json({ error: 'Friend profile not found' });
        }

        console.log('👤 Perfil del amigo obtenido:', friendProfile);

        // 2. Crear/actualizar ambos usuarios en Stream
        console.log('📝 Creando usuarios en Stream...');
        
        // Usuario actual
        await serverClient.upsertUser({
            id: userId,
            name: userProfile.full_name || userProfile.username || 'User',
            image: userProfile.photo_url || undefined,
        });

        // Amigo
        await serverClient.upsertUser({
            id: friendId,
            name: friendProfile.full_name || friendProfile.username || 'User',
            image: friendProfile.photo_url || undefined,
        });

        console.log('✅ Usuarios creados en Stream');

        // 3. Crear ID del canal consistente (ordenado alfabéticamente)
        const channelId = [userId, friendId].sort().join('-');
        console.log('📝 Channel ID generado:', channelId);

        // 4. Crear o obtener el canal
        const channel = serverClient.channel('messaging', channelId, {
            members: [userId, friendId],
            created_by_id: userId,
        });

        // Crear el canal (si ya existe, esto solo lo recupera)
        await channel.create();
        console.log('✅ Canal creado/obtenido exitosamente');

        return res.status(200).json({
            channelId: channel.id,
            channelType: channel.type
        });
    } catch (error: any) {
        console.error('❌ Error creating DM channel:', error);
        
        // Manejo de errores específicos de Stream
        if (error.code === 4) {
            // El canal ya existe
            const channelId = [req.user!.id, req.body.friendId].sort().join('-');
            console.log('ℹ️ Canal ya existe, retornando ID:', channelId);
            return res.status(200).json({
                channelId: channelId,
                channelType: 'messaging'
            });
        }
        
        return res.status(500).json({ 
            error: 'Failed to create channel',
            details: error.message 
        });
    }
}
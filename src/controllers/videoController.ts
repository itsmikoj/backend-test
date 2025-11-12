import { Request, Response } from "express";
import * as videoService from "../services/videoService";

/*export async function uploadVideoController(req: Request, res: Response) {
  try {
    const folder = req.params.folder;
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ningún archivo" });
    }

    const result = await videoService.uploadVideo(req.file.path, folder);
    return res.json({ success: true, videoUrl: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Error uploading video" });
  }
}*/

export async function listVideosController(req: Request, res: Response) {
  try {
    const folder = req.params.folder;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const before = req.query.before as string | undefined;
    const after = req.query.after as string | undefined;

    const videos = await videoService.listVideos(folder, before, after, limit);
    return res.json({success: true, count: videos.length, videos});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Error listing videos" });
  }
}

export async function deleteVideoController(req: Request, res: Response) {
  try {
    const folder = req.params.folder;
    const result = await videoService.deleteVideo(folder, req.params.id);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Error deleting video" });
  }
  
}
export async function getVideoByIdController(req: Request, res: Response) {
  try {
    const folder = req.params.folder
    const publicId = req.params.id;

    if (!publicId) {
      return res.status(400).json({ error: "Debes enviar un id" });
    }

    const result = await videoService.getVideoById(publicId,folder);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error obteniendo el video" });
  }
}
import cloudinary from "../config/cloudinaryConfig";
import { supabase } from "../utils/supabaseClient";

export type CloudinaryVideo = {
  asset_id: string;
  public_id: string;
  format: string;
  created_at: string;
  resource_type: string;
  type: string;
  asset_folder?: string;
  [key: string]: any;
};

/*export async function uploadVideo(filePath: string, folder: string) {
  return cloudinary.uploader.upload(filePath, {
    resource_type: "video",
    //folder,
  });
}*/

export async function deleteVideo(publicId: string, folder: string) {
  return cloudinary.uploader.destroy(`${folder}/${publicId}`, {
    resource_type: "video",
  });
}

export async function listVideos(folder: string, before?: string, after?: string, limit: number = 5) {
  const result = await cloudinary.api.resources({
    resource_type: "video",
    type: "upload",
    max_results: 20,
  });

  let videos: CloudinaryVideo[] = result.resources.filter(
    (v: any) => v.asset_folder === folder
  );

  const publicIds = videos.map((v) => v.public_id);
  const { data: phrases, error } = await supabase
    .from("phrase_history_en_cloudinary")
    .select("videoId, phrase, createdAt, phrase_es")
    .in("videoId", publicIds);

  if (error) {
    console.error("Error consultando Supabase:", error);
  }
  const combined = videos.map((v) => {
    //const cleanId = v.public_id.replace(`${folder}/`, "");
    const phraseData = phrases?.find((p) => p.videoId === v.public_id);
    return {
      ...v,
      phrase: phraseData?.phrase || null,
      createdAt: phraseData?.createdAt || null,
      phrase_es: phraseData?.phrase_es || null,
    };
  });

  let filtered = combined;
  if (before) {
    const beforeDate = new Date(before);
    filtered = filtered.filter(v => v.createdAt && new Date(v.createdAt) <= beforeDate);
  }
  if (after) {
    const afterDate = new Date(after);
    filtered = filtered.filter(v => v.createdAt && new Date(v.createdAt) >= afterDate);
  }
  filtered.sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());
  return filtered.slice(0, limit);
}

export async function getVideoById(publicId: string, folder:string) {
  return cloudinary.api.resource(publicId, {
    resource_type: "video",
  });
}

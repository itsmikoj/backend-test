import {
  PostProfileInput,
  PutProfileInput,
} from "../validators/profile/profileValidator";

export function mapToPostProfileEntity(id: string, body: PostProfileInput) {
  return {
    id: id,
    full_name: body.full_name,
    username: body.username,
    is_premium: true,
  };
}

export function mapToPutProfileEntity(id: string, body: PutProfileInput) {
  let data: Partial<PutProfileInput> = {};

  if (body.full_name !== undefined) {
    data.full_name = body.full_name;
  }
  if (body.username !== undefined) {
    data.username = body.username;
  }

  return data;
}

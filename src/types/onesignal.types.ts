export interface OneSignalPayload {
  app_id: string;
  include_aliases: {
    external_id: string[];
  };
  target_channel: string;
  contents: Record<string, string>;
  headings: Record<string, string>;
  data: Record<string, any>;
  ios_sound?: string;
  priority?: number;
  ttl?: number;
}

export interface OneSignalConfig {
  appId: string;
  apiKey: string;
  apiUrl: string;
}

export interface OneSignalErrorResponse {
  errors: string[];
  id?: string;
}

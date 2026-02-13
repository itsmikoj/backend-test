export interface InstallInterface {
  id: string;
  app_tracker_id: string;
  created_at: string;
  event_id: string;
  event_name: string;
  timestamp: number;
  platform: string;
  app_bundle_id: string;
  app_version: string;
  app_build: string;
  device_idfv: string;
  device_os_version: string;
  device_locale: string;
  device_model: string;
  device_timezone: string;
  device_idfa: string;
  privacy_att_status: boolean;
}

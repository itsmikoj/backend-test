export interface AppTrackerInterface {
  id: string;
  user_id: string;
  app_name: string;
  bundle_id: string;
  app_store_url: string;
  play_store_url: string;
  deep_link_scheme: string;
  fallback_url: string; 
  created_at: string;
  updated_at: string;
}
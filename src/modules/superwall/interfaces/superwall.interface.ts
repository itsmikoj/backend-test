export interface SuperwallEventInterface {
  id: string;
  app_tracker_id: string;

  event_type: string;
  event_name: string;
  superwall_event_id: string;
  application_id: number;
  application_name: string;
  project_id: number;
  bundle_id: string;
  environment: string;
  store: string;
  original_app_user_id: string;
  product_id: string;
  period_type: string;
  currency_code: string;
  price: number;
  proceeds: number;
  purchased_at: string;
  expiration_at: string;
  created_at: string;
}

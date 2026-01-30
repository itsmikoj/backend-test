export interface TrackingEvent {
  id?: string;
  app_id: string;
  user_id?: string;
  session_id: string;
  event_name: string;
  event_data?: Record<string, any>;
  revenue?: number;
  currency?: string;
  timestamp: string;
  device_info?: DeviceInfo;
}

export interface DeviceInfo {
  platform: string;
  os_version: string;
  app_version: string;
  device_model: string;
  device_id: string;
  locale?: string;
}

export interface Metrics {
  period: {
    start_date: string;
    end_date: string;
  };
  installs: {
    total: number;
    new_installs: number;
    reinstalls: number;
  };
  uninstalls: {
    total: number;
  };
  subscriptions: {
    active: number;
    new: number;
    cancelled: number;
    trial: number;
  };
  revenue: {
    total: number;
    by_currency: Record<string, number>;
    average_per_user: number;
  };
  events: {
    total: number;
    unique_users: number;
    top_events: Array<{ event_name: string; count: number }>;
  };
  retention: {
    rate: number;
    churn_rate: number;
  };
  daily_trends?: Array<{
    date: string;
    installs: number;
    revenue: number;
    active_users: number;
  }>;
}

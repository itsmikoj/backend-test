// modules/superwall/superwall.interface.ts

export interface SuperwallWebhookPayload {
  object: string;
  type: string;
  projectId: number;
  applicationId: number;
  applicationName?: string;
  timestamp: number;
  data: SuperwallEventData;
}

export interface SuperwallEventData {
  id: string;
  name: string;
  cancelReason: string | null;
  exchangeRate: number;
  isSmallBusiness: boolean;
  periodType: 'TRIAL' | 'INTRO' | 'NORMAL';
  countryCode: string;
  price: number;  
  proceeds: number;
  priceInPurchasedCurrency: number;
  taxPercentage: number | null;
  commissionPercentage: number;
  takehomePercentage: number;
  offerCode: string | null;
  isFamilyShare: boolean;
  expirationAt: number | null;
  transactionId: string;
  originalTransactionId: string;
  originalAppUserId: string | null;
  store: 'APP_STORE' | 'PLAY_STORE' | 'STRIPE' | 'PADDLE';
  purchasedAt: number;
  currencyCode: string;
  productId: string;
  environment: 'PRODUCTION' | 'SANDBOX';
  isTrialConversion: boolean;
  newProductId: string | null;
  bundleId: string;
  ts: number;
  expirationReason?: string;
  userAttributes?: Record<string, any>;
}

export interface SuperwallEventRecord {
  event_type: string;
  event_name: string;
  superwall_event_id: string;
  application_id: number;
  application_name: string | null;
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
  purchased_at: string | null;
  expiration_at: string | null;
  app_tracker_id?: string | null;
}
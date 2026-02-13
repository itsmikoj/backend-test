import { Status } from "./status.enum";

export interface UserStreak {
  id: string;
  user_id: string;
  created_at?: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string;
  updated_at: string;
  remaining_lives: number;
  last_lives_reset: string;
  timezone: string | null;
}

export interface StreakActivity {
  id: string;
  created_at: string;
  user_id: string;
  completed_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  is_premium: boolean;
  created_at?: string;
}

export interface Feedback {
  message: string;
  created_at: string;
}

// DTOs

export interface Login {
  email: string;
  full_name: string;
  access_token: string;
  refresh_token: string;
}

export interface Register {
  email: string;
  full_name: string;
  access_token: string;
  refresh_token: string;
}

export interface Update {
  email: string;
  full_name: string;
  is_premium: boolean;
  created_at?: string;
}

export interface AiRequestErrors {
  id: number;
  created_at: string;
  request_payload: string;
  status_code: string;
  endpoint: string;
}

export interface AppLogStarts {
  app_version: string;
  user: string;
  device: string;
  superwall: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: Status;
  created_at: string;
  rejected_at: string | null;
  accepted_at: string | null;
}

export interface Friend {
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface FriendWithStreak {
  user_id: string;
  friend_id: string;
  username: string;
  full_name: string;
  current_streak: number;
  longest_streak: number;
  remaining_lives: number;
  updated_at: Date | null;
}

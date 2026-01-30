CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255),
  session_id VARCHAR(255) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  event_data JSONB,
  revenue DECIMAL(10, 2),
  currency VARCHAR(10),
  timestamp TIMESTAMPTZ NOT NULL,
  device_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_app_id ON events(app_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_event_name ON events(event_name);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_revenue ON events(revenue) WHERE revenue IS NOT NULL;

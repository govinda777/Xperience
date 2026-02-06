-- Migration: Create tables for Agent Tools and Webhooks

CREATE TABLE IF NOT EXISTS agent_tool_audit (
  id SERIAL PRIMARY KEY,
  tool_name VARCHAR(255) NOT NULL,
  input JSONB NOT NULL,
  output JSONB,
  error TEXT,
  duration_ms INTEGER,
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inbound_messages (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(50) NOT NULL, -- 'whatsapp', 'telegram', 'x', 'email', 'calendar'
  external_id VARCHAR(255) NOT NULL,
  from_id VARCHAR(255) NOT NULL,
  to_id VARCHAR(255),
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_tool_audit_session ON agent_tool_audit(session_id);
CREATE INDEX IF NOT EXISTS idx_inbound_messages_provider_external ON inbound_messages(provider, external_id);

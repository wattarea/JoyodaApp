CREATE TABLE IF NOT EXISTS workflow_pricing_rules (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER REFERENCES n8n_workflows(id) ON DELETE CASCADE,
  parameter_name VARCHAR(100) NOT NULL,
  parameter_value VARCHAR(100),
  credit_multiplier DECIMAL(10,2) DEFAULT 1.0,
  base_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example pricing rules for the Movie Teaser workflow
-- Base cost: 13 credits for scene
-- Resolution multipliers: 480p=1x, 720p=1.8x, 1080p=3x, 4K=6x
-- Duration multipliers: 5s=1x, 10s=2x, 15s=3x, 30s=6x
-- Scene count: +13 credits per scene above 1

CREATE INDEX idx_workflow_pricing_rules_workflow_id ON workflow_pricing_rules(workflow_id);
CREATE INDEX idx_workflow_pricing_rules_parameter ON workflow_pricing_rules(parameter_name, parameter_value);

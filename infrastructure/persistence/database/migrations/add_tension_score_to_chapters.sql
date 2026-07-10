-- Migration: Add tension_score to chapters table
-- Date: 2024-01-XX
-- Description: Add tension_score column to track chapter tension values (0-100)

-- Add tension_score column with default value 50.0
ALTER TABLE chapters ADD COLUMN tension_score REAL DEFAULT 50.0;

-- Update existing chapters to have default tension score
UPDATE chapters SET tension_score = 50.0 WHERE tension_score IS NULL;

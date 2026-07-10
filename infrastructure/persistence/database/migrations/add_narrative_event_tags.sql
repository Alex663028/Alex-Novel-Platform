-- Add tags column to narrative_events table
-- Migration: add_narrative_event_tags
-- Date: 2026-04-05

-- Add tags column if it doesn't exist
ALTER TABLE narrative_events ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';

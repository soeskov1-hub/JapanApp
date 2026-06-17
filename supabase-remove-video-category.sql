-- Migration: Fjern 'video'-kategori, tilføj 'andet'
-- Kør denne i Supabase SQL Editor

-- 1. Migrer eksisterende video-entries til 'andet'
UPDATE entries SET type = 'andet' WHERE type = 'video';

-- 2. Opdater CHECK-constraint
ALTER TABLE entries DROP CONSTRAINT IF EXISTS entries_type_check;
ALTER TABLE entries ADD CONSTRAINT entries_type_check
  CHECK (type IN ('destination', 'restaurant', 'bar', 'shopping', 'hotel', 'andet'));

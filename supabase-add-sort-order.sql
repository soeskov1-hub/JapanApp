-- Run this in the Supabase SQL Editor to add drag-and-drop ordering for cities

ALTER TABLE cities ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- Set existing cities to sequential order (alphabetical as starting point)
UPDATE cities
SET sort_order = sub.rn
FROM (
  SELECT id, (ROW_NUMBER() OVER (ORDER BY name) - 1) AS rn
  FROM cities
) sub
WHERE cities.id = sub.id;

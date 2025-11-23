-- Fix numeric field overflow in daily_briefs table
-- Change numeric fields to support larger values (up to 9,999,999,999,999.99)

ALTER TABLE daily_briefs 
  ALTER COLUMN cash_amount TYPE NUMERIC(15,2),
  ALTER COLUMN cash_change TYPE NUMERIC(15,2),
  ALTER COLUMN revenue TYPE NUMERIC(15,2),
  ALTER COLUMN revenue_change TYPE NUMERIC(15,2),
  ALTER COLUMN expenses TYPE NUMERIC(15,2),
  ALTER COLUMN burn_rate TYPE NUMERIC(15,2),
  ALTER COLUMN runway_months TYPE NUMERIC(10,2);

ALTER TABLE action_items
  ALTER COLUMN amount TYPE NUMERIC(15,2);
-- Fix search_path for update function with CASCADE
DROP FUNCTION IF EXISTS public.update_financial_documents_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_financial_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Recreate trigger
CREATE TRIGGER update_financial_documents_updated_at
BEFORE UPDATE ON public.financial_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_financial_documents_updated_at();
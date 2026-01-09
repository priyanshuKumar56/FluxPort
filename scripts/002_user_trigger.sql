-- Trigger to auto-create a profile and a default organization on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Create a default organization for the new user
  INSERT INTO public.organizations (name, slug)
  VALUES (COALESCE(new.raw_user_meta_data ->> 'organization_name', 'My First Org'), 
          'org-' || lower(hex(random_bytes(4))))
  RETURNING id INTO new_org_id;

  INSERT INTO public.profiles (id, email, full_name, organization_id)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new_org_id
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

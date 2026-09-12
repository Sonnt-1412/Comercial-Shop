insert into public.profiles (user_id, full_name)
select
  id,
  nullif(trim(coalesce(raw_user_meta_data ->> 'full_name', '')), '')
from auth.users
on conflict (user_id) do nothing;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  title text not null,
  description text,
  date_posted date not null,
  tags text[] not null default '{}',
  copyright_notice text not null,
  visibility text not null default 'PUBLIC' check (visibility in ('PUBLIC', 'PRIVATE')),
  exif jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_photo_id uuid references public.photos(id) on delete set null,
  visibility text not null default 'PUBLIC' check (visibility in ('PUBLIC', 'PRIVATE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.album_photos (
  album_id uuid not null references public.albums(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  sort_order int not null default 0,
  primary key (album_id, photo_id)
);

create index if not exists photos_user_id_idx on public.photos(user_id);
create index if not exists photos_visibility_idx on public.photos(visibility);
create index if not exists albums_user_id_idx on public.albums(user_id);
create index if not exists albums_visibility_idx on public.albums(visibility);
create index if not exists album_photos_album_id_idx on public.album_photos(album_id);
create index if not exists album_photos_photo_id_idx on public.album_photos(photo_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_photos_updated_at on public.photos;
create trigger set_photos_updated_at
before update on public.photos
for each row execute function public.set_updated_at();

drop trigger if exists set_albums_updated_at on public.albums;
create trigger set_albums_updated_at
before update on public.albums
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.photos enable row level security;
alter table public.albums enable row level security;
alter table public.album_photos enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "photos_public_select" on public.photos;
create policy "photos_public_select"
on public.photos for select
to anon, authenticated
using (visibility = 'PUBLIC');

drop policy if exists "photos_owner_all" on public.photos;
create policy "photos_owner_all"
on public.photos for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "albums_public_select" on public.albums;
create policy "albums_public_select"
on public.albums for select
to anon, authenticated
using (visibility = 'PUBLIC');

drop policy if exists "albums_owner_all" on public.albums;
create policy "albums_owner_all"
on public.albums for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "album_photos_public_select" on public.album_photos;
create policy "album_photos_public_select"
on public.album_photos for select
to anon, authenticated
using (
  exists (
    select 1
    from public.albums a
    join public.photos p on p.id = album_photos.photo_id
    where a.id = album_photos.album_id
      and a.visibility = 'PUBLIC'
      and p.visibility = 'PUBLIC'
  )
);

drop policy if exists "album_photos_owner_manage" on public.album_photos;
create policy "album_photos_owner_manage"
on public.album_photos for all
to authenticated
using (
  exists (
    select 1
    from public.albums a
    where a.id = album_photos.album_id
      and a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.albums a
    join public.photos p on p.id = album_photos.photo_id
    where a.id = album_photos.album_id
      and a.user_id = auth.uid()
      and p.user_id = auth.uid()
  )
);

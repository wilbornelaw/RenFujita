# Ren Fujita

Flickr-inspired personal photo sharing site built with:
- Next.js App Router + TypeScript
- TailwindCSS
- Supabase Auth/Postgres/RLS
- URL-only photo uploads (no file upload)

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database Setup (Supabase)

Run the migration in Supabase SQL editor:

`supabase/migrations/202602080001_init.sql`

This migration creates:
- `profiles`
- `photos`
- `albums`
- `album_photos`
- `updated_at` triggers
- RLS policies for public/private visibility and owner-only admin writes

## Auth Model

- No public sign-up UI.
- Login page is `/login` (email/password only).
- `/admin/*` routes are protected by middleware and redirect to `/login` if unauthenticated.

## Routes

Public:
- `/`
- `/photo/[id]`
- `/albums`
- `/album/[id]`
- `/features`
- `/groups`
- `/events`
- `/blog`
- `/about`

Admin:
- `/admin`
- `/admin/upload`
- `/admin/photos`
- `/admin/albums`
- `/admin/albums/[id]`
- `/admin/photo/[id]`
- `/admin/settings`

## Notes

- All image rendering uses `object-contain` (no cropping/distortion).
- Public users can only see `PUBLIC` photos/albums.
- Owner can manage `PUBLIC`/`PRIVATE` visibility for photos and albums.

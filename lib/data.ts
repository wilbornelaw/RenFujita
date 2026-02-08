import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Album, Photo } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getPublicPhotos() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("photos")
    .select("*")
    .eq("visibility", "PUBLIC")
    .order("date_posted", { ascending: false });
  return (data ?? []) as Photo[];
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("photos").select("*").eq("id", id).maybeSingle();
  return (data as Photo | null) ?? null;
}

export async function getPublicAlbums() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("albums")
    .select("*")
    .eq("visibility", "PUBLIC")
    .order("created_at", { ascending: false });
  return (data ?? []) as Album[];
}

export async function getAlbumById(id: string): Promise<Album | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("albums").select("*").eq("id", id).maybeSingle();
  return (data as Album | null) ?? null;
}

export async function getAlbumPhotos(id: string, adminView: boolean) {
  const supabase = await createServerSupabaseClient();
  const query = supabase
    .from("album_photos")
    .select("sort_order, photo:photos(*)")
    .eq("album_id", id)
    .order("sort_order", { ascending: true });

  const { data } = await query;
  const rows = (data ?? []) as { sort_order: number; photo: Photo | Photo[] | null }[];
  return rows
    .map((row) => (Array.isArray(row.photo) ? (row.photo[0] ?? null) : row.photo))
    .filter((photo): photo is Photo => {
      if (!photo) {
        return false;
      }
      return adminView || photo.visibility === "PUBLIC";
    });
}

export function assertVisibleOrThrow(photo: Photo | null, isAdmin: boolean) {
  if (!photo) {
    notFound();
  }
  if (!isAdmin && photo.visibility !== "PUBLIC") {
    notFound();
  }
}

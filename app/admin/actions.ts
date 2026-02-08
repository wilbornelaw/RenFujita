"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin";
import { isHttpUrl, toTags } from "@/lib/utils";

function parseExif(formData: FormData) {
  return {
    camera: String(formData.get("camera") ?? "").trim(),
    lens: String(formData.get("lens") ?? "").trim(),
    focalLength: String(formData.get("focalLength") ?? "").trim(),
    aperture: String(formData.get("aperture") ?? "").trim(),
    shutter: String(formData.get("shutter") ?? "").trim(),
    iso: String(formData.get("iso") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
  };
}

export async function createPhotoAction(formData: FormData) {
  const { user, supabase } = await requireAdminUser();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const date_posted = String(formData.get("date_posted") ?? "").trim();
  const tags = toTags(String(formData.get("tags") ?? ""));
  const copyright_notice = String(formData.get("copyright_notice") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "PUBLIC");

  if (!isHttpUrl(image_url)) {
    redirect("/admin/upload?error=invalid_url");
  }

  const { error } = await supabase.from("photos").insert({
    user_id: user.id,
    image_url,
    title,
    description: description || null,
    date_posted,
    tags,
    copyright_notice,
    visibility: visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC",
    exif: parseExif(formData),
  });

  if (error) {
    redirect("/admin/upload?error=insert_failed");
  }

  revalidatePath("/");
  revalidatePath("/albums");
  redirect("/admin/photos?success=photo_created");
}

export async function updatePhotoAction(formData: FormData) {
  const { user, supabase } = await requireAdminUser();
  const id = String(formData.get("id"));
  const image_url = String(formData.get("image_url") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const date_posted = String(formData.get("date_posted") ?? "").trim();
  const tags = toTags(String(formData.get("tags") ?? ""));
  const copyright_notice = String(formData.get("copyright_notice") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "PUBLIC");

  if (!isHttpUrl(image_url)) {
    redirect("/admin/photos?error=invalid_url");
  }

  await supabase
    .from("photos")
    .update({
      image_url,
      title,
      description: description || null,
      date_posted,
      tags,
      copyright_notice,
      visibility: visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC",
      exif: parseExif(formData),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/");
  revalidatePath("/albums");
  revalidatePath("/admin/photos");
  redirect("/admin/photos?success=photo_updated");
}

export async function deletePhotoAction(formData: FormData) {
  const { user, supabase } = await requireAdminUser();
  const id = String(formData.get("id"));
  await supabase.from("photos").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/");
  revalidatePath("/albums");
  revalidatePath("/admin/photos");
  redirect("/admin/photos?success=photo_deleted");
}

export async function createAlbumAction(formData: FormData) {
  const { user, supabase } = await requireAdminUser();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "PUBLIC");

  const { data } = await supabase
    .from("albums")
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      visibility: visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC",
    })
    .select("id")
    .single();

  revalidatePath("/albums");
  if (data?.id) {
    redirect(`/admin/albums/${data.id}?success=album_created`);
  }
  redirect("/admin/albums?success=album_created");
}

export async function updateAlbumAction(formData: FormData) {
  const { user, supabase } = await requireAdminUser();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "PUBLIC");
  const cover_photo_id = String(formData.get("cover_photo_id") ?? "").trim();

  await supabase
    .from("albums")
    .update({
      title,
      description: description || null,
      visibility: visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC",
      cover_photo_id: cover_photo_id || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/albums");
  revalidatePath(`/album/${id}`);
  revalidatePath(`/admin/albums/${id}`);
  redirect(`/admin/albums/${id}?success=album_updated`);
}

export async function deleteAlbumAction(formData: FormData) {
  const { user, supabase } = await requireAdminUser();
  const id = String(formData.get("id"));
  await supabase.from("albums").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/albums");
  revalidatePath("/admin/albums");
  redirect("/admin/albums?success=album_deleted");
}

export async function setAlbumPhotosAction(formData: FormData) {
  const { user, supabase } = await requireAdminUser();
  const albumId = String(formData.get("album_id"));
  const selected = formData.getAll("photo_ids").map((v) => String(v));

  const { data: album } = await supabase
    .from("albums")
    .select("id")
    .eq("id", albumId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!album) {
    redirect("/admin/albums");
  }

  await supabase.from("album_photos").delete().eq("album_id", albumId);
  if (selected.length > 0) {
    await supabase.from("album_photos").insert(
      selected.map((photoId, index) => ({
        album_id: albumId,
        photo_id: photoId,
        sort_order: index,
      })),
    );
  }

  revalidatePath("/albums");
  revalidatePath(`/album/${albumId}`);
  revalidatePath(`/admin/albums/${albumId}`);
  redirect(`/admin/albums/${albumId}?success=photos_assigned`);
}

export async function moveAlbumPhotoAction(formData: FormData) {
  const { user, supabase } = await requireAdminUser();
  const albumId = String(formData.get("album_id"));
  const photoId = String(formData.get("photo_id"));
  const direction = String(formData.get("direction"));

  const { data: album } = await supabase
    .from("albums")
    .select("id")
    .eq("id", albumId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!album) {
    return;
  }

  const { data } = await supabase
    .from("album_photos")
    .select("photo_id, sort_order")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true });

  const rows = data ?? [];
  const currentIndex = rows.findIndex((row) => row.photo_id === photoId);
  if (currentIndex < 0) {
    return;
  }
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= rows.length) {
    return;
  }

  const current = rows[currentIndex];
  const target = rows[targetIndex];

  await supabase
    .from("album_photos")
    .update({ sort_order: target.sort_order })
    .eq("album_id", albumId)
    .eq("photo_id", current.photo_id);

  await supabase
    .from("album_photos")
    .update({ sort_order: current.sort_order })
    .eq("album_id", albumId)
    .eq("photo_id", target.photo_id);

  revalidatePath(`/admin/albums/${albumId}`);
  revalidatePath(`/album/${albumId}`);
}

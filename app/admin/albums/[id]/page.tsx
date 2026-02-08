import Image from "next/image";
import { ArrowDown, ArrowUp } from "lucide-react";
import { notFound } from "next/navigation";
import { moveAlbumPhotoAction, setAlbumPhotosAction, updateAlbumAction } from "@/app/admin/actions";
import { FormSubmitButton } from "@/components/form-submit-button";
import { SectionHeader } from "@/components/section-header";
import { SegmentedToggle } from "@/components/segmented-toggle";
import { Snackbar } from "@/components/snackbar";
import { requireAdminUser } from "@/lib/admin";
import type { Album, Photo } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
};

type AlbumPhotoJoin = {
  sort_order: number;
  photo: Photo | Photo[] | null;
};

const successMap: Record<string, string> = {
  album_created: "Album created.",
  album_updated: "Album updated.",
  photos_assigned: "Album photos updated.",
};

export default async function AdminAlbumDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { success } = await searchParams;
  const { user, supabase } = await requireAdminUser();

  const [{ data: albumData }, { data: photoData }, { data: albumPhotoData }] = await Promise.all([
    supabase.from("albums").select("*").eq("id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("photos").select("*").eq("user_id", user.id).order("date_posted", { ascending: false }),
    supabase.from("album_photos").select("sort_order, photo:photos(*)").eq("album_id", id).order("sort_order", { ascending: true }),
  ]);

  const album = albumData as Album | null;
  if (!album) {
    notFound();
  }
  const allPhotos = (photoData ?? []) as Photo[];
  const albumPhotosRaw = (albumPhotoData ?? []) as AlbumPhotoJoin[];
  const albumPhotos = albumPhotosRaw
    .map((row) => ({
      sort_order: row.sort_order,
      photo: Array.isArray(row.photo) ? (row.photo[0] ?? null) : row.photo,
    }))
    .filter((row): row is { sort_order: number; photo: Photo } => Boolean(row.photo));
  const selectedIds = new Set(albumPhotos.map((row) => row.photo.id));

  return (
    <section className="space-y-4">
      <Snackbar message={success ? successMap[success] : undefined} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SectionHeader title="Edit Album" description="Set visibility, cover image, and photo order." eyebrow="Admin" />
      </div>
      <form action={updateAlbumAction} className="grid gap-3 rounded-2xl border border-white/10 bg-[#171b24] p-4 lg:grid-cols-2">
        <input type="hidden" name="id" value={album.id} />
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input name="title" defaultValue={album.title} className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Visibility</label>
          <SegmentedToggle name="visibility" defaultValue={album.visibility} />
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea name="description" defaultValue={album.description ?? ""} className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2" rows={3} />
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Cover Photo</label>
          <select name="cover_photo_id" defaultValue={album.cover_photo_id ?? ""} className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <option value="">None</option>
            {allPhotos.map((photo) => (
              <option key={photo.id} value={photo.id}>
                {photo.title}
              </option>
            ))}
          </select>
        </div>
        <FormSubmitButton
          label="Save Album"
          pendingLabel="Saving..."
          className="rounded-xl bg-gradient-to-r from-[#ff0084] to-[#ff4fa8] px-4 py-2 font-semibold text-white lg:col-span-2"
        />
      </form>

      <form action={setAlbumPhotosAction} className="space-y-4 rounded-2xl border border-white/10 bg-[#171b24] p-4">
        <input type="hidden" name="album_id" value={album.id} />
        <h2 className="text-xl font-semibold">Assign Photos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allPhotos.map((photo) => (
            <label key={photo.id} className="rounded-xl border border-white/10 bg-black/20 p-2">
              <div className="relative h-40 w-full rounded-lg bg-black/35">
                <Image src={photo.image_url} alt={photo.title} fill className="object-contain p-2" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" name="photo_ids" value={photo.id} defaultChecked={selectedIds.has(photo.id)} />
                <span className="text-sm">{photo.title}</span>
              </div>
            </label>
          ))}
        </div>
        <FormSubmitButton
          label="Save Photo Assignment"
          pendingLabel="Saving..."
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-semibold hover:bg-white/15"
        />
      </form>

      <div className="space-y-2 rounded-2xl border border-white/10 bg-[#171b24] p-4">
        <h2 className="text-xl font-semibold">Reorder Photos</h2>
        {albumPhotos.map((row) => (
          <div key={row.photo.id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2">
            <span className="w-8 text-xs text-muted">{row.sort_order}</span>
            <span className="flex-1 text-sm">{row.photo.title}</span>
            <form action={moveAlbumPhotoAction}>
              <input type="hidden" name="album_id" value={album.id} />
              <input type="hidden" name="photo_id" value={row.photo.id} />
              <input type="hidden" name="direction" value="up" />
              <button className="rounded-lg border border-white/15 bg-white/5 p-2 hover:bg-white/10" type="submit">
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
            <form action={moveAlbumPhotoAction}>
              <input type="hidden" name="album_id" value={album.id} />
              <input type="hidden" name="photo_id" value={row.photo.id} />
              <input type="hidden" name="direction" value="down" />
              <button className="rounded-lg border border-white/15 bg-white/5 p-2 hover:bg-white/10" type="submit">
                <ArrowDown className="h-4 w-4" />
              </button>
            </form>
          </div>
        ))}
        {albumPhotos.length === 0 && <p className="text-sm text-muted">No assigned photos yet.</p>}
      </div>
    </section>
  );
}

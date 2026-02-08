import Image from "next/image";
import Link from "next/link";
import { Eye, Save } from "lucide-react";
import { deletePhotoAction, updatePhotoAction } from "@/app/admin/actions";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { SectionHeader } from "@/components/section-header";
import { Snackbar } from "@/components/snackbar";
import { VisibilityBadge } from "@/components/visibility-badge";
import { requireAdminUser } from "@/lib/admin";
import type { Photo } from "@/lib/types";

type Props = {
  searchParams: Promise<{ visibility?: string; tag?: string; sort?: string; error?: string; success?: string }>;
};

const successMessage: Record<string, string> = {
  photo_created: "Photo created.",
  photo_updated: "Photo updated.",
  photo_deleted: "Photo deleted.",
};

export default async function AdminPhotosPage({ searchParams }: Props) {
  const params = await searchParams;
  const { user, supabase } = await requireAdminUser();

  let query = supabase.from("photos").select("*").eq("user_id", user.id);
  if (params.visibility === "PUBLIC" || params.visibility === "PRIVATE") {
    query = query.eq("visibility", params.visibility);
  }
  if (params.tag) {
    query = query.contains("tags", [params.tag]);
  }
  query = query.order("date_posted", { ascending: params.sort === "asc" });
  const { data } = await query;

  const photos = (data ?? []) as Photo[];

  return (
    <section className="space-y-4">
      <Snackbar message={params.success ? successMessage[params.success] : undefined} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SectionHeader title="Manage Photos" description="Edit metadata, visibility, and EXIF." eyebrow="Admin" />
      </div>
      {params.error === "invalid_url" && (
        <p className="rounded-xl border border-red-300/20 bg-red-500/10 p-2 text-sm text-red-300">Image URL must start with http:// or https://</p>
      )}
      <form className="grid gap-3 rounded-2xl border border-white/10 bg-[#171b24] p-4 sm:grid-cols-4">
        <select name="visibility" defaultValue={params.visibility ?? ""} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
          <option value="">All visibility</option>
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>
        <input name="tag" defaultValue={params.tag ?? ""} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" placeholder="Filter by tag" />
        <select name="sort" defaultValue={params.sort ?? "desc"} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
        <button className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-semibold hover:bg-white/15" type="submit">
          Apply
        </button>
      </form>
      <div className="space-y-4">
        {photos.map((photo) => (
          <article key={photo.id} className="grid gap-4 rounded-2xl border border-white/10 bg-[#171b24] p-4 transition hover:bg-[#1b2030] lg:grid-cols-[300px_1fr]">
            <div className="relative h-64 w-full rounded-xl border border-white/10 bg-black/35">
              <Image src={photo.image_url} alt={photo.title} fill className="object-contain p-2" sizes="300px" />
            </div>
            <form action={updatePhotoAction} className="space-y-3">
              <input type="hidden" name="id" value={photo.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="image_url" defaultValue={photo.image_url} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" required />
                <input name="title" defaultValue={photo.title} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" required />
                <input name="date_posted" type="date" defaultValue={photo.date_posted} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" required />
                <input name="tags" defaultValue={photo.tags.join(", ")} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
                <input
                  name="copyright_notice"
                  defaultValue={photo.copyright_notice}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 sm:col-span-2"
                  required
                />
                <textarea
                  name="description"
                  defaultValue={photo.description ?? ""}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 sm:col-span-2"
                  rows={2}
                />
                <select name="visibility" defaultValue={photo.visibility} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="PRIVATE">PRIVATE</option>
                </select>
                <div className="flex items-center">
                  <VisibilityBadge visibility={photo.visibility} />
                </div>
              </div>
              <details className="rounded-xl border border-white/10 bg-black/20 p-3">
                <summary className="cursor-pointer text-sm font-medium">EXIF</summary>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <input name="camera" defaultValue={photo.exif?.camera ?? ""} placeholder="camera" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
                  <input name="lens" defaultValue={photo.exif?.lens ?? ""} placeholder="lens" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
                  <input
                    name="focalLength"
                    defaultValue={photo.exif?.focalLength ?? ""}
                    placeholder="focalLength"
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2"
                  />
                  <input name="aperture" defaultValue={photo.exif?.aperture ?? ""} placeholder="aperture" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
                  <input name="shutter" defaultValue={photo.exif?.shutter ?? ""} placeholder="shutter" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
                  <input name="iso" defaultValue={photo.exif?.iso ?? ""} placeholder="iso" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
                  <input
                    name="location"
                    defaultValue={photo.exif?.location ?? ""}
                    placeholder="location"
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 sm:col-span-2"
                  />
                </div>
              </details>
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15" type="submit">
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <DeleteConfirmButton formAction={deletePhotoAction} />
                {photo.visibility === "PUBLIC" ? (
                  <Link href={`/photo/${photo.id}`} className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                    <Eye className="h-4 w-4" />
                    Public page
                  </Link>
                ) : (
                  <Link href={`/admin/photo/${photo.id}`} className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                    <Eye className="h-4 w-4" />
                    Admin preview
                  </Link>
                )}
              </div>
            </form>
          </article>
        ))}
        {photos.length === 0 && <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-muted">No photos found.</p>}
      </div>
    </section>
  );
}

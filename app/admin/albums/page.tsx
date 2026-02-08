import Link from "next/link";
import { Pencil } from "lucide-react";
import { createAlbumAction, deleteAlbumAction } from "@/app/admin/actions";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { SectionHeader } from "@/components/section-header";
import { SegmentedToggle } from "@/components/segmented-toggle";
import { Snackbar } from "@/components/snackbar";
import { VisibilityBadge } from "@/components/visibility-badge";
import { requireAdminUser } from "@/lib/admin";
import type { Album } from "@/lib/types";

type Props = {
  searchParams: Promise<{ success?: string }>;
};

const successMap: Record<string, string> = {
  album_created: "Album created.",
  album_deleted: "Album deleted.",
};

export default async function AdminAlbumsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { user, supabase } = await requireAdminUser();
  const { data } = await supabase
    .from("albums")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const albums = (data ?? []) as Album[];

  return (
    <section className="space-y-4">
      <Snackbar message={params.success ? successMap[params.success] : undefined} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SectionHeader title="Manage Albums" description="Create, edit, and control visibility." eyebrow="Admin" />
      </div>
      <form action={createAlbumAction} className="grid gap-3 rounded-2xl border border-white/10 bg-[#171b24] p-4 lg:grid-cols-4">
        <input name="title" placeholder="Album title" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" required />
        <input name="description" placeholder="Description" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
        <SegmentedToggle name="visibility" />
        <button className="rounded-xl bg-gradient-to-r from-[#ff0084] to-[#ff4fa8] px-4 py-2 font-semibold text-white" type="submit">
          Create Album
        </button>
      </form>
      <div className="space-y-2">
        {albums.map((album) => (
          <form key={album.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#171b24] p-3 transition hover:bg-[#1b2030]">
            <p className="font-semibold">{album.title}</p>
            <VisibilityBadge visibility={album.visibility} />
            <Link
              className="ml-auto inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
              href={`/admin/albums/${album.id}`}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
            <input type="hidden" name="id" value={album.id} />
            <DeleteConfirmButton label="Delete" formAction={deleteAlbumAction} />
          </form>
        ))}
        {albums.length === 0 && <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-muted">No albums yet.</p>}
      </div>
    </section>
  );
}

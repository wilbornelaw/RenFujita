import Image from "next/image";
import Link from "next/link";
import { PageEnter } from "@/components/page-enter";
import { SectionHeader } from "@/components/section-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Album, Photo } from "@/lib/types";

type AlbumWithCover = Album & { cover: Photo | null };

export default async function AlbumsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("albums")
    .select("*, cover:photos(*)")
    .eq("visibility", "PUBLIC")
    .order("created_at", { ascending: false });

  const albums = (data ?? []) as AlbumWithCover[];

  return (
    <PageEnter className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SectionHeader eyebrow="Collections" title="Public Albums" />
      </section>
      {albums.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-muted">No public albums yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/album/${album.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#171b24] shadow-[0_12px_28px_rgba(0,0,0,0.34)] transition hover:-translate-y-0.5"
            >
              <div className="relative h-52 w-full bg-black/35">
                {album.cover ? (
                  <Image
                    src={album.cover.image_url}
                    alt={album.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">No cover</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{album.title}</h2>
                {album.description && <p className="line-clamp-2 text-sm text-muted">{album.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageEnter>
  );
}

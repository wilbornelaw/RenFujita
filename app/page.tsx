import { PhotoCard } from "@/components/photo-card";
import Link from "next/link";
import Image from "next/image";
import { MasonryGrid } from "@/components/masonry-grid";
import { PageEnter } from "@/components/page-enter";
import { SectionHeader } from "@/components/section-header";
import { getPublicPhotos } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Album, Photo } from "@/lib/types";

type FeaturedAlbum = Album & { cover: Photo | null };

export default async function Home() {
  const [photos, albumRes] = await Promise.all([
    getPublicPhotos(),
    (async () => {
      const supabase = await createServerSupabaseClient();
      return supabase
        .from("albums")
        .select("*, cover:photos(*)")
        .eq("visibility", "PUBLIC")
        .order("created_at", { ascending: false })
        .limit(10);
    })(),
  ]);
  const featuredAlbums = (albumRes.data ?? []) as FeaturedAlbum[];

  return (
    <PageEnter className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
        <SectionHeader
          eyebrow="Photo Stream"
          title="Public Feed"
          description="A Flickr-inspired stream of public photographs. Private items never appear here."
        />
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Featured Albums"
          description="Curated album highlights"
          action={
            <Link className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-muted hover:text-white" href="/albums">
              View all albums
            </Link>
          }
        />
        <div className="flex snap-x gap-4 overflow-x-auto pb-2">
          {featuredAlbums.map((album) => (
            <Link
              key={album.id}
              href={`/album/${album.id}`}
              className="min-w-[280px] snap-start rounded-2xl border border-white/10 bg-[#171b24] p-3 shadow-[0_10px_25px_rgba(0,0,0,0.28)]"
            >
              <div className="relative aspect-[16/10] w-full rounded-xl bg-black/40">
                {album.cover ? (
                  <Image src={album.cover.image_url} alt={album.title} fill className="object-contain p-2" sizes="280px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">No cover</div>
                )}
              </div>
              <p className="mt-3 font-semibold">{album.title}</p>
            </Link>
          ))}
          {featuredAlbums.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-muted">No featured albums yet.</div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Latest Photos" />
        {photos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-sm text-muted">
            No public photos yet. Add a public photo from admin upload.
          </div>
        ) : (
          <MasonryGrid>
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </MasonryGrid>
        )}
      </section>
    </PageEnter>
  );
}

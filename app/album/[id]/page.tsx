import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MasonryGrid } from "@/components/masonry-grid";
import { PageEnter } from "@/components/page-enter";
import { SectionHeader } from "@/components/section-header";
import { VisibilityBadge } from "@/components/visibility-badge";
import { getAlbumById, getAlbumPhotos, getCurrentUser } from "@/lib/data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AlbumDetailPage({ params }: Props) {
  const { id } = await params;
  const [album, user] = await Promise.all([getAlbumById(id), getCurrentUser()]);

  if (!album) {
    notFound();
  }
  const isAdmin = Boolean(user);
  if (!isAdmin && album.visibility !== "PUBLIC") {
    notFound();
  }

  const photos = await getAlbumPhotos(id, isAdmin);

  return (
    <PageEnter className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SectionHeader title={album.title} description={album.description ?? ""} eyebrow="Album" />
        {isAdmin && (
          <div className="mt-3">
            <VisibilityBadge visibility={album.visibility} />
          </div>
        )}
      </section>
      {photos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-muted">No photos available for this viewer.</p>
      ) : (
        <MasonryGrid>
          {photos.map((photo) => (
            <Link
              key={photo.id}
              href={`/photo/${photo.id}?albumId=${id}`}
              className="block rounded-2xl border border-white/10 bg-[#171b24] p-2 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl bg-black/35">
                <Image src={photo.image_url} alt={photo.title} fill className="object-contain p-2" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <p className="mt-2 text-sm font-semibold">{photo.title}</p>
            </Link>
          ))}
        </MasonryGrid>
      )}
    </PageEnter>
  );
}

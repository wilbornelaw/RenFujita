import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExifAccordion } from "@/components/exif-accordion";
import { PageEnter } from "@/components/page-enter";
import { VisibilityBadge } from "@/components/visibility-badge";
import { assertVisibleOrThrow, getCurrentUser, getPhotoById } from "@/lib/data";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ albumId?: string }>;
};

export default async function PhotoDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { albumId } = await searchParams;
  const [photo, user] = await Promise.all([getPhotoById(id), getCurrentUser()]);
  assertVisibleOrThrow(photo, Boolean(user));
  if (!photo) {
    notFound();
  }

  return (
    <PageEnter className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-muted">
        <Link href="/" className="hover:text-white">
          Feed
        </Link>
        <span>/</span>
        {albumId ? (
          <Link href={`/album/${albumId}`} className="hover:text-white">
            Album
          </Link>
        ) : (
          <span>Photo</span>
        )}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-white/10 bg-black/70 p-2 sm:p-4">
          <div className="relative min-h-[58vh] w-full rounded-xl bg-black/60">
            <Image src={photo.image_url} alt={photo.title} fill className="object-contain p-2" sizes="100vw" priority />
          </div>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-white/10 bg-[#171b24] p-4">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-semibold">{photo.title}</h1>
              {user && <VisibilityBadge visibility={photo.visibility} />}
            </div>
            <p className="mt-1 text-sm text-muted">{photo.date_posted}</p>
            {photo.description && <p className="mt-4 whitespace-pre-line text-sm text-slate-200">{photo.description}</p>}
            <p className="mt-4 text-xs text-muted">Copyright: {photo.copyright_notice}</p>
            {photo.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {photo.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ExifAccordion exif={photo.exif ?? {}} />
        </aside>
      </section>
    </PageEnter>
  );
}

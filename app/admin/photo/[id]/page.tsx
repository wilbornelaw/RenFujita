import Image from "next/image";
import { notFound } from "next/navigation";
import { ExifAccordion } from "@/components/exif-accordion";
import { VisibilityBadge } from "@/components/visibility-badge";
import { requireAdminUser } from "@/lib/admin";
import type { Photo } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminPhotoPreviewPage({ params }: Props) {
  const { id } = await params;
  const { user, supabase } = await requireAdminUser();
  const { data } = await supabase.from("photos").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();
  const photo = data as Photo | null;

  if (!photo) {
    notFound();
  }

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-[#171b24] p-5">
      <h1 className="text-2xl font-semibold">Admin Preview: {photo.title}</h1>
      <VisibilityBadge visibility={photo.visibility} />
      <div className="relative h-[65vh] w-full rounded-xl bg-black/35">
        <Image src={photo.image_url} alt={photo.title} fill className="object-contain p-2" sizes="100vw" />
      </div>
      <ExifAccordion exif={photo.exif ?? {}} />
    </section>
  );
}

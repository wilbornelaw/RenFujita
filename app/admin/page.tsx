import Link from "next/link";
import { requireAdminUser } from "@/lib/admin";
import { SectionHeader } from "@/components/section-header";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdminUser();

  const [{ count: photoCount }, { count: albumCount }] = await Promise.all([
    supabase.from("photos").select("*", { count: "exact", head: true }),
    supabase.from("albums").select("*", { count: "exact", head: true }),
  ]);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SectionHeader title="Admin Dashboard" description="Manage photos, albums, and visibility." eyebrow="Control Panel" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#171b24] p-5">
          <p className="text-sm text-muted">Photos</p>
          <p className="text-3xl font-semibold">{photoCount ?? 0}</p>
          <Link href="/admin/photos" className="mt-2 inline-block text-sm text-accent hover:underline">
            Manage photos
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#171b24] p-5">
          <p className="text-sm text-muted">Albums</p>
          <p className="text-3xl font-semibold">{albumCount ?? 0}</p>
          <Link href="/admin/albums" className="mt-2 inline-block text-sm text-accent hover:underline">
            Manage albums
          </Link>
        </div>
      </div>
    </section>
  );
}

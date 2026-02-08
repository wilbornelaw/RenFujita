import { PageEnter } from "@/components/page-enter";
import { SectionHeader } from "@/components/section-header";

export default function AboutPage() {
  return (
    <PageEnter className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
        <SectionHeader
          eyebrow="About Ren Fujita"
          title="A Personal Photography Archive"
          description="This site is a Flickr-inspired home for visual storytelling. It brings together public highlights and private studies in one carefully curated archive."
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-[#171b24] p-5">
          <h2 className="text-lg font-semibold">What This Site Is</h2>
          <p className="mt-2 text-sm text-muted">
            Ren Fujita is a personal photo platform focused on craft, mood, and continuity. Images are posted by URL with metadata, tags, and EXIF context.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#171b24] p-5">
          <h2 className="text-lg font-semibold">How Curation Works</h2>
          <p className="mt-2 text-sm text-muted">
            Public work appears in the main feed and albums. Private work remains visible only to the owner, making this both a portfolio and a working archive.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#171b24] p-5">
          <h2 className="text-lg font-semibold">Design Principle</h2>
          <p className="mt-2 text-sm text-muted">
            Photos are always shown with object-contain, never cropped or distorted. Composition is preserved exactly as captured.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
        <h2 className="text-2xl font-semibold">Behind The Work</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
          This archive is built around consistency: steady posting, clear metadata, and albums that group images by place, light, season, or intent.
          The goal is simple: present photographs with clarity and let the images carry the narrative.
        </p>
      </section>
    </PageEnter>
  );
}

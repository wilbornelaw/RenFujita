import { PageEnter } from "@/components/page-enter";
import { SectionHeader } from "@/components/section-header";

type Props = {
  title: string;
  body: string;
};

export function MarketingPage({ title, body }: Props) {
  return (
    <PageEnter className="rounded-2xl border border-white/10 bg-white/5 p-7">
      <SectionHeader eyebrow="Ren Fujita" title={title} description={body} />
    </PageEnter>
  );
}

import { UploadForm } from "@/components/upload-form";
import { SectionHeader } from "@/components/section-header";

type Props = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

const errorMap: Record<string, string> = {
  invalid_url: "Image URL must start with http:// or https://",
  insert_failed: "Failed to create photo. Check values and try again.",
};

export default async function AdminUploadPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SectionHeader title="Upload by URL" description="Add new photos without file uploads." eyebrow="Admin" />
      </div>
      <UploadForm error={error ? errorMap[error] ?? "Upload failed." : undefined} />
    </section>
  );
}

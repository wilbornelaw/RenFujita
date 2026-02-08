"use client";

import { useState } from "react";
import Image from "next/image";
import { createPhotoAction } from "@/app/admin/actions";
import { SegmentedToggle } from "@/components/segmented-toggle";
import { FormSubmitButton } from "@/components/form-submit-button";
import { isHttpUrl } from "@/lib/utils";

type Props = {
  error: string | undefined;
};

export function UploadForm({ error }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const urlInvalid = imageUrl.length > 0 && !isHttpUrl(imageUrl);

  return (
    <form action={createPhotoAction} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-white/10 bg-[#171b24] p-5">
        <h2 className="text-xl font-semibold">Photo Metadata</h2>
        {error && <p className="rounded-xl border border-red-300/20 bg-red-500/10 p-2 text-sm text-red-300">{error}</p>}
        <div>
          <label className="mb-1 block text-sm font-medium">Image URL *</label>
          <input
            className={`w-full rounded-xl border bg-white/5 px-3 py-2.5 ${urlInvalid ? "border-red-400/50" : "border-white/15"}`}
            name="image_url"
            type="url"
            required
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://..."
          />
          {urlInvalid && <p className="mt-1 text-xs text-red-300">Must start with http:// or https://</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Title *</label>
          <input className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" name="title" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" name="description" rows={4} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Date Posted *</label>
          <input className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" name="date_posted" type="date" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tags (comma-separated)</label>
          <input className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" name="tags" placeholder="street, tokyo, night" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Copyright Notice *</label>
          <input className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" name="copyright_notice" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Visibility *</label>
          <SegmentedToggle name="visibility" />
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-white/10 bg-[#171b24] p-5">
        <h2 className="text-xl font-semibold">EXIF (Optional)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {["camera", "lens", "focalLength", "aperture", "shutter", "iso", "location"].map((name) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-medium">{name}</label>
              <input className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" name={name} />
            </div>
          ))}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted">Live Preview (No Crop)</h3>
          <div className="relative h-80 w-full rounded-xl border border-white/10 bg-black/45">
            {imageUrl ? (
              <Image src={imageUrl} alt="Preview" fill className="object-contain p-2" sizes="100vw" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">Enter an image URL to preview</div>
            )}
          </div>
        </div>
        <FormSubmitButton
          label="Create Photo"
          pendingLabel="Creating..."
          className="w-full rounded-xl bg-gradient-to-r from-[#ff0084] to-[#ff4fa8] px-4 py-2.5 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
        />
      </div>
    </form>
  );
}

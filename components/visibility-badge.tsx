import type { Visibility } from "@/lib/types";

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  const isPublic = visibility === "PUBLIC";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
        isPublic
          ? "border-emerald-400/35 bg-emerald-400/15 text-emerald-300"
          : "border-pink-400/35 bg-pink-400/15 text-pink-300"
      }`}
    >
      {visibility}
    </span>
  );
}

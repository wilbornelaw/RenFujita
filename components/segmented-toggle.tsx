"use client";

import { useState } from "react";
import type { Visibility } from "@/lib/types";

type Props = {
  name: string;
  defaultValue?: Visibility;
};

export function SegmentedToggle({ name, defaultValue = "PUBLIC" }: Props) {
  const [value, setValue] = useState<Visibility>(defaultValue);

  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
      <input type="hidden" name={name} value={value} />
      {(["PUBLIC", "PRIVATE"] as const).map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setValue(option)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition ${
              active ? "bg-gradient-to-r from-[#ff0084] to-[#ff4fa8] text-white shadow-lg shadow-pink-500/20" : "text-muted hover:text-white"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

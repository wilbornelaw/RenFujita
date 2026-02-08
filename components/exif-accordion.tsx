"use client";

import { Camera, Aperture, Timer, MapPin } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ExifPayload } from "@/lib/types";

export function ExifAccordion({ exif }: { exif: ExifPayload }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rows = [
    { key: "camera", label: "Camera", value: exif.camera, icon: Camera },
    { key: "lens", label: "Lens", value: exif.lens, icon: Camera },
    { key: "focalLength", label: "Focal Length", value: exif.focalLength, icon: Camera },
    { key: "aperture", label: "Aperture", value: exif.aperture, icon: Aperture },
    { key: "shutter", label: "Shutter", value: exif.shutter, icon: Timer },
    { key: "iso", label: "ISO", value: exif.iso, icon: Timer },
    { key: "location", label: "Location", value: exif.location, icon: MapPin },
  ].filter((row) => row.value);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
      >
        EXIF Details
        <span className="text-xs text-muted">{open ? "Hide" : "Show"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? {} : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? {} : { height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="grid gap-2 p-4 sm:grid-cols-2">
              {rows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.key} className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2 text-sm">
                    <Icon className="h-4 w-4 text-muted" />
                    <span className="text-muted">{row.label}:</span>
                    <span>{row.value}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

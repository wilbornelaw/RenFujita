"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { Photo } from "@/lib/types";
import { VisibilityBadge } from "@/components/visibility-badge";

type Props = {
  photo: Pick<Photo, "id" | "image_url" | "title" | "date_posted" | "visibility" | "tags">;
  showVisibility?: boolean;
  href?: string;
};

export function PhotoCard({ photo, showVisibility = false, href }: Props) {
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();
  const target = href ?? `/photo/${photo.id}`;
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rx = useSpring(rotateX, { stiffness: 220, damping: 20, mass: 0.4 });
  const ry = useSpring(rotateY, { stiffness: 220, damping: 20, mass: 0.4 });

  function onMove(event: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 6);
    rotateX.set((0.5 - py) * 6);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      whileHover={reduceMotion ? {} : { y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#171b24] shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
      style={reduceMotion ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
    >
      <Link href={target} className="block">
        <div className="relative aspect-[4/3] w-full bg-black/35">
          {!loaded && <div className="absolute inset-0 animate-pulse bg-white/10" aria-hidden />}
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            onLoad={() => setLoaded(true)}
            className={`object-contain p-2 transition duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-60 transition group-hover:opacity-85" />
        </div>
        <div className="space-y-2 p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold text-white">{photo.title}</h3>
            {showVisibility && <VisibilityBadge visibility={photo.visibility} />}
          </div>
          <p className="text-xs text-muted">{photo.date_posted}</p>
          {photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {photo.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

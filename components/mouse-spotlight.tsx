"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export function MouseSpotlight() {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    function onMove(event: MouseEvent) {
      x.set(event.clientX - 110);
      y.set(event.clientY - 110);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion, x, y]);

  if (reduceMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[220px] w-[220px] rounded-full"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, rgba(255,0,132,0.16) 0%, rgba(255,0,132,0.07) 34%, rgba(255,0,132,0) 70%)",
      }}
    />
  );
}

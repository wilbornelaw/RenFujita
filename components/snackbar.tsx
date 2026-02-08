"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  message?: string;
  type?: "success" | "error";
};

export function Snackbar({ message, type = "success" }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? {} : { opacity: 0, y: 8, scale: 0.98 }}
          className={`fixed bottom-5 right-5 z-[70] rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl ${
            type === "success" ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200" : "border-red-300/30 bg-red-400/15 text-red-100"
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  label?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
};

export function DeleteConfirmButton({ label = "Delete", formAction }: Props) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-red-300/30 bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/25"
      >
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? {} : { opacity: 1 }}
            exit={reduceMotion ? {} : { opacity: 0 }}
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 10 }}
              animate={reduceMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, scale: 0.98, y: 6 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#171b24] p-4"
            >
              <h3 className="text-lg font-semibold">Delete item?</h3>
              <p className="mt-1 text-sm text-muted">This action cannot be undone.</p>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  formAction={formAction}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

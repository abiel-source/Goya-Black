"use client";

import { useEffect } from "react";
import AddToCrystalPanel from "@/components/view/AddToCrystalPanel";

export default function AddToCrystalModal({ open, onClose, fragmentId }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-1000">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close comments"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* Modal shell */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-lg h-[65vh] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
            <div className="text-[#111111] font-semibold">Add to Crystal</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-[#111111] hover:bg-zinc-100 transition"
            >
              Close
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0">
            <AddToCrystalPanel fragmentId={fragmentId} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

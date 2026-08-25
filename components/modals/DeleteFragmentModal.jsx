"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import DeleteFragmentPanel from "@/components/view/DeleteFragmentPanel";

export default function DeleteFragmentModal({
  open,
  onClose,
  fragmentId,
  onDelete,
}) {
  const params = useParams();
  const crystalId = params?.crystalId; /////////////////////

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
        aria-label="Close Modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* Modal shell */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-sm h-[20vh] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
            <div className="text-[#111111] font-semibold">
              Confirm Fragment Deletion
            </div>
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
            <div className="text-center">This deletion is permanent!</div>
            <DeleteFragmentPanel
              fragmentId={fragmentId}
              crystalId={crystalId}
              onClose={onClose}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

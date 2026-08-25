"use client";

import { useEffect } from "react";
import SearchPanel from "@/components/view/SearchPanel";

export default function SearchModal({ open, onClose, query, setQuery }) {
  // validate open state + add ESC event listener
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
        aria-label="Close messages"
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
      />

      {/* Modal shell */}
      <div className="absolute top-16 left-0 md:left-16 right-0 bottom-0 flex items-start justify-start p-0 m-0">
        {/* sm:w-[calc(24rem+4rem)] == sm:w-md */}
        {/* sm breakpoint gets extra 4rem to account for removal of side navigation bar */}
        <div className="relative w-[calc(20rem)] sm:w-md md:w-lg lg:w-2xl h-[85vh] rounded-b-2xl bg-white border border-[#E5E7EB] shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
            <div className="text-[#111111] font-semibold">Search Results</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-[#111111] hover:bg-zinc-100 transition"
            >
              Close
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 px-4">
            <SearchPanel query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>
    </div>
  );
}

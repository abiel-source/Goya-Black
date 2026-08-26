"use client";

// PROBLEM
// current issue - 2 local states are desychronized
// LibraryCrystalMasonryGallery fragment state
// SeedCrystalModal selected state

// EXAMPLE ISSUES
// fragment in crystal can be selected again- selected state does not account for ones already added - BAD
// add fragment, close modal, reopen modal then it shows selected and in crystal - GOOD
// however, remove fragment, close/reopen modal, then it shows selected but removed from crystal BAD
//
// anyway, the point is that the 2 states are not synched.

// SOLUTION:
// 1) selected state must DEPEND on fragment state (ground truth)
// 2) seed modal should only be used for ADDING fragments (should not need to account for deletion)
//
// a) pass fragment state to seed modal
// b) loadFragments() only fetches the COMPLEMENTARY set of the fragment state
// --> avoids (de)selecting fragments that are already members of the crystal
// c) clear state upon successful add
// --> opening modal now refetches updated complementary set of fragment state
// --> as in, modal always sees "fresh" fragments
// --> then selected fragments are expected- actually- we expect NO fragments to be preselected
//     when opening the modal since all loaded fragments are NOT members
//     (nothing will be selected which aligns with fragments that aren't members by definition)

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Masonry } from "masonic";

import getNextFragmentsPage from "@/app/actions/query/getNextPaintingsPage";
import addFragmentsToCrystal from "@/app/actions/create/addPaintingsToGallery";

import SelectableFragmentCard from "@/components/view/SelectableFragmentCard";

const PAGE_SIZE = 20;

export default function SeedCrystalModal({
  crystalId,
  openOnLoad,
  onFragmentsAdded,
  crystalFragmentIds,
  fragmentsUpdateLoading,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [loadingGrid, setLoadingGrid] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);

  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // selected state is completely local - there is no server-side maintenance of this state
  const [selected, setSelected] = useState(() => new Set());
  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  useEffect(() => {
    if (openOnLoad) setOpen(true);
  }, [openOnLoad]);

  const loadFragments = useCallback(
    async ({
      initial = false,
      cursorCreatedAt = null,
      cursorId = null,
    } = {}) => {
      if (fragmentsUpdateLoading) return;

      if (initial) {
        setLoadingGrid(true);
      } else {
        if (loadingMore || loadingGrid || !hasMore) return;
        setLoadingMore(true);
      }

      try {
        const res = await getNextFragmentsPage({
          cursorCreatedAt,
          cursorId,
          limit: PAGE_SIZE,
          exclude: crystalFragmentIds,
        });

        if (initial) {
          setItems(res.items || []);
        } else {
          setItems((prev) => [...prev, ...(res.items || [])]);
        }

        setCursor(res.nextCursor);
        setHasMore(res.hasMore);
      } catch (e) {
        toast.error(e?.message || "Failed to load fragments");
      } finally {
        if (initial) {
          setLoadingGrid(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [
      hasMore,
      loadingGrid,
      loadingMore,
      fragmentsUpdateLoading,
      crystalFragmentIds,
    ]
  );

  useEffect(() => {
    if (!open) return;

    setItems([]);
    setCursor(null);
    setHasMore(true);

    loadFragments({
      initial: true,
      cursorCreatedAt: null,
      cursorId: null,
    });
  }, [open]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loadingMore || loadingGrid || !hasMore) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceFromBottom < 300) {
      loadFragments({
        initial: false,
        cursorCreatedAt: cursor?.createdAt ?? null,
        cursorId: cursor?.id ?? null,
      });
    }
  };

  const closeAndRemoveSeedParam = () => {
    setSelected(new Set());
    setOpen(false);

    const sp = new URLSearchParams(searchParams.toString());
    if (sp.has("seed")) {
      sp.delete("seed");
      router.replace(`/library/${crystalId}${sp.toString() ? `?${sp}` : ""}`);
    }
  };

  const handleDone = async () => {
    if (selectedIds.length === 0) return closeAndRemoveSeedParam();

    setSaving(true);
    try {
      await addFragmentsToCrystal({
        crystalId,
        fragmentIds: selectedIds,
      });

      // mutate the local state
      await onFragmentsAdded?.();

      toast.success("Added to crystal");
      closeAndRemoveSeedParam();
      router.refresh(); // LIKELY UNNECESSARY
    } catch (e) {
      toast.error(e?.message || "Failed to add fragments");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl px-4 py-2 text-sm font-medium text-white"
        style={{ backgroundColor: "#722F37" }}
      >
        Add images
      </button>

      {open && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={closeAndRemoveSeedParam}
          />

          <div className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-black shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="font-semibold text-white">Add fragments</div>
                <div className="text-xs text-white/60">
                  Selected: {selectedIds.length}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:text-white"
                  onClick={closeAndRemoveSeedParam}
                  type="button"
                >
                  Skip
                </button>
                <button
                  className="rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: "#722F37" }}
                  onClick={handleDone}
                  disabled={saving}
                  type="button"
                >
                  {saving ? "Saving..." : "Done"}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-[65vh] overflow-auto rounded-xl border border-white/10 bg-white/5 p-2"
              >
                {loadingGrid ? (
                  <div className="p-6 text-white/70">Loading fragments...</div>
                ) : items.length === 0 ? (
                  <div className="p-6 text-white/70">No fragments found.</div>
                ) : (
                  <>
                    <Masonry
                      items={items}
                      columnWidth={180}
                      columnGutter={10}
                      overscanBy={6}
                      render={(props) => (
                        <SelectableFragmentCard
                          {...props}
                          selected={selected}
                          setSelected={setSelected}
                        />
                      )}
                    />

                    {loadingMore && (
                      <div className="py-4 text-center text-sm text-white/60">
                        Loading more...
                      </div>
                    )}

                    {!hasMore && (
                      <div className="py-4 text-center text-sm text-white/40">
                        No more fragments.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

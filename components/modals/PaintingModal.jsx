"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { X, Heart, Eye, GemIcon, Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import viewPainting from "@/app/actions/viewPainting";
import savePainting from "@/app/actions/savePainting";
import checkSaveStatus from "@/app/actions/checkSaveStatus";
import toggleLikePainting from "@/app/actions/toggleLikePainting";
import checkLikeStatus from "@/app/actions/checkLikeStatus";
import getNextRelatedPaintingsPage from "@/app/actions/query/getNextRelatedPaintingsPage";

import PaintingCard from "@/components/view/PaintingCard";

const PAGE_SIZE = 12;

const PaintingModal = ({ open, onClose, painting }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const paintingId = painting?._id;
  const src = painting?.image?.url || "";
  const title = painting?.title || "Untitled";
  const artistName = painting?.artistId?.name || null;
  const year = painting?.year || null;
  const medium = painting?.medium || null;
  const movement = painting?.movementId?.name || null;
  const dimensions = painting?.dimensions || null;
  const museum = painting?.museum || null;

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(painting?.likes ?? 0);
  const [viewCount, setViewCount] = useState(painting?.views ?? 0);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const [relatedItems, setRelatedItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const backdropRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!open || !paintingId) return;

    setRelatedItems([]);
    setCursor(null);
    setHasMore(true);
    setIsLiked(false);
    setIsSaved(false);
    setLoadingSaved(true);

    (async () => {
      try {
        if (userId) {
          await viewPainting(paintingId);
          const [likeRes, saveRes] = await Promise.all([
            checkLikeStatus(paintingId),
            checkSaveStatus(paintingId),
          ]);
          setIsLiked(!!likeRes.isLiked);
          setLikeCount(likeRes.likeCount ?? painting?.likes ?? 0);
          setViewCount(likeRes.viewCount ?? painting?.views ?? 0);
          setIsSaved(!!saveRes.isSaved);
        }
      } catch (e) {
        // fail
      } finally {
        setLoadingSaved(false);
      }
    })();
  }, [open, paintingId, userId]);

  const loadRelated = useCallback(async () => {
    if (loadingRelated || !hasMore || !paintingId) return;
    setLoadingRelated(true);
    try {
      const result = await getNextRelatedPaintingsPage({
        paintingId,
        cursorCreatedAt: cursor?.createdAt ?? null,
        cursorId: cursor?.id ?? null,
        limit: PAGE_SIZE,
      });
      const paintings = result.items.map((item) => item.painting);
      setRelatedItems((prev) => [...prev, ...paintings]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (e) {
      console.error("Failed to load related paintings", e);
    } finally {
      setLoadingRelated(false);
    }
  }, [paintingId, cursor, hasMore, loadingRelated]);

  useEffect(() => {
    if (open && paintingId) loadRelated();
  }, [open, paintingId]);

  const handleToggleSave = async () => {
    if (!userId) return toast.error("Sign in to save paintings");
    try {
      const res = await savePainting(paintingId);
      setIsSaved(res.isSaved);
      toast.success(res.message);
    } catch (e) {
      toast.error(e?.message || "Failed to update save status");
    }
  };

  const handleToggleLike = async () => {
    if (!userId) return toast.error("Sign in to like paintings");
    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!prevLiked);
    setLikeCount((c) => c + (prevLiked ? -1 : 1));
    try {
      const res = await toggleLikePainting(paintingId);
      setIsLiked(!!res.isLiked);
      setLikeCount(res.likeCount ?? prevCount);
    } catch (e) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error(e?.message || "Failed to toggle like");
    }
  };

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-500 hover:text-[#111111] shadow transition-colors"
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-3/5 bg-zinc-100 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none flex items-center justify-center min-h-64">
            {src && (
              <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: "80vh" }}>
                <Image
                  src={src}
                  alt={title}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority
                  className="rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-2/5 flex flex-col p-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#111111] leading-snug">{title}</h2>
              {artistName && (
                <p className="text-sm text-zinc-500 mt-1">{artistName}</p>
              )}
            </div>

            <div className="flex flex-col gap-1 text-sm text-zinc-600">
              {year && <span><span className="font-medium text-zinc-800">Year</span> · {year}</span>}
              {movement && <span><span className="font-medium text-zinc-800">Movement</span> · {movement}</span>}
              {medium && <span><span className="font-medium text-zinc-800">Medium</span> · {medium}</span>}
              {dimensions && <span><span className="font-medium text-zinc-800">Dimensions</span> · {dimensions}</span>}
              {museum && <span><span className="font-medium text-zinc-800">Museum</span> · {museum}</span>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleToggleLike}
                className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-[#722F37] transition-colors"
              >
                <Heart
                  size={18}
                  strokeWidth={1.75}
                  className={isLiked ? "fill-[#722F37] stroke-[#722F37]" : ""}
                />
                <span>{likeCount}</span>
              </button>

              <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                <Eye size={18} strokeWidth={1.75} />
                <span>{viewCount}</span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleToggleSave}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#722F37] hover:text-[#722F37] transition-colors"
                >
                  <Bookmark size={15} strokeWidth={1.75} className={isSaved ? "fill-[#722F37] stroke-[#722F37]" : ""} />
                  {loadingSaved ? "..." : isSaved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related paintings */}
        <div className="p-6 border-t border-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-zinc-600 mb-4">More Paintings</h3>

          {relatedItems.length === 0 && !loadingRelated && (
            <p className="text-sm text-zinc-400">No related paintings found.</p>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {relatedItems.map((p) => (
              <div
                key={p._id}
                className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100 cursor-pointer group"
                onClick={() => {
                  onClose();
                }}
              >
                {p.image?.url && (
                  <Image
                    src={p.image.url}
                    alt={p.title || ""}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="20vw"
                    className="transition-opacity duration-200 group-hover:opacity-80"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-xs text-white font-medium line-clamp-2">{p.title}</span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={loadRelated}
              disabled={loadingRelated}
              className="mt-4 w-full py-2 text-sm text-zinc-500 hover:text-[#722F37] transition-colors"
            >
              {loadingRelated ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaintingModal;

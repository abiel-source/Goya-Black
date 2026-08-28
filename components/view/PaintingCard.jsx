"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import savePainting from "@/app/actions/savePainting";
import checkSaveStatus from "@/app/actions/checkSaveStatus";
import toggleLikePainting from "@/app/actions/toggleLikePainting";
import checkLikeStatus from "@/app/actions/checkLikeStatus";
import getPaintingMetrics from "@/app/actions/getPaintingMetrics";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import AddToCrystalModal from "@/components/modals/AddToCrystalModal";
import PaintingModal from "@/components/modals/PaintingModal";

import { Heart, Eye, GemIcon } from "lucide-react";

const PaintingCard = ({ data, style, width }) => {
  const title = data?.title || "";
  const artistName = data?.artistId?.name || "";
  const src = data?.image?.url || "";
  const ratio = data?.ratio;
  const paintingId = data?._id;

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [likeCount, setLikeCount] = useState(data?.likes ?? 0);
  const [viewCount, setViewCount] = useState(data?.views ?? 0);

  const [addToGalleryOpen, setAddToGalleryOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!paintingId) return;
    setLoadingMetrics(true);
    (async () => {
      try {
        const metrics = await getPaintingMetrics(paintingId);
        setLikeCount(metrics.likeCount);
        setViewCount(metrics.viewCount);
        if (userId) {
          const likeRes = await checkLikeStatus(paintingId);
          setIsLiked(!!likeRes.isLiked);
          setLikeCount(likeRes.likeCount);
          setViewCount(likeRes.viewCount);
        }
      } catch (e) {
        toast.error(e?.message || "Failed to load metrics");
      } finally {
        setLoadingMetrics(false);
      }
    })();
  }, [paintingId, userId]);

  useEffect(() => {
    if (!paintingId) return;
    if (!userId) {
      setLoadingSaved(false);
      setIsSaved(false);
      return;
    }
    setLoadingSaved(true);
    (async () => {
      try {
        const res = await checkSaveStatus(paintingId);
        setIsSaved(!!res.isSaved);
      } catch (e) {
        toast.error(e?.message || "Failed to load save status");
      } finally {
        setLoadingSaved(false);
      }
    })();
  }, [paintingId, userId]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return toast.error("You must be signed in to save a painting");
    try {
      const res = await savePainting(paintingId);
      setIsSaved(res.isSaved);
      toast.success(res.message);
    } catch (e) {
      toast.error(e?.message || "Failed to update save status");
    }
  };

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return toast.error("You must be signed in to like a painting");
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

  return (
    <div style={style}>
      <div className="flex flex-col overflow-hidden w-full">
        <div
          className="relative w-full group cursor-pointer"
          style={{ aspectRatio: `${ratio}`, minHeight: 140 }}
          onClick={() => setModalOpen(true)}
        >
          {src && paintingId && (
            <Image
              src={src}
              alt={title}
              fill
              sizes={`${Math.ceil(width)}px`}
              style={{ objectFit: "cover" }}
              priority={false}
              className="rounded-lg transition-opacity duration-200 group-hover:opacity-80"
            />
          )}

          {/* top bar */}
          <div className="absolute top-0 left-0 right-0 px-1 py-1 flex justify-between opacity-0 -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
            <button
              onClick={(e) => { e.stopPropagation(); setAddToGalleryOpen(true); }}
              className="px-2 py-2 text-xs font-medium text-white rounded-md bg-[#722F37] hover:bg-[#5E2530] transition-colors duration-150"
              aria-label="Add To Gallery"
              title="Add To Gallery"
            >
              <GemIcon size={18} strokeWidth={1.75} />
            </button>

            {userId && loadingSaved && (
              <p className="px-3 py-2 text-xs font-medium text-white rounded-md bg-[#722F37]">...</p>
            )}

            {!loadingSaved && (
              <button
                className="px-3 py-2 text-xs font-medium text-white rounded-md bg-[#722F37] hover:bg-[#5E2530] transition-colors duration-150"
                onClick={handleToggleSave}
              >
                {isSaved ? "Unsave" : "Save"}
              </button>
            )}
          </div>

          {/* title + artist overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-8 pt-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none rounded-b-lg">
            <span className="text-sm font-medium text-white drop-shadow block">{title}</span>
            {artistName && (
              <span className="text-xs text-white/70 drop-shadow block">{artistName}</span>
            )}
          </div>

          {/* bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 px-1 py-1 flex items-center justify-between opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="flex flex-row items-center gap-1">
              <button onClick={handleToggleLike} className="cursor-pointer">
                <Heart
                  size={20}
                  strokeWidth={1.75}
                  className={isLiked ? "fill-[#722F37] stroke-[#722F37]" : "stroke-white"}
                />
              </button>
              <span className="text-xs text-white">
                {!loadingMetrics ? likeCount : "..."}
              </span>
              <Eye size={22} strokeWidth={1.75} className="stroke-white" />
              <span className="text-xs text-white">
                {!loadingMetrics ? viewCount : "..."}
              </span>
            </div>
          </div>
        </div>

        <AddToCrystalModal
          open={addToGalleryOpen}
          onClose={() => setAddToGalleryOpen(false)}
          fragmentId={paintingId}
        />

        <PaintingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          painting={data}
        />
      </div>
    </div>
  );
};

export default PaintingCard;

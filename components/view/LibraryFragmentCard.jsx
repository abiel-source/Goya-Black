"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import saveFragment from "@/app/actions/saveFragment";
import checkSaveStatus from "@/app/actions/checkSaveStatus";
import toggleLikeFragment from "@/app/actions/toggleLikeFragment";
import checkLikeStatus from "@/app/actions/checkLikeStatus";
import getFragmentMetrics from "@/app/actions/getFragmentMetrics";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import { Heart, Eye, GemIcon } from "lucide-react";

import RemoveFromCrystalModal from "@/components/modals/RemoveFromCrystalModal";

const LibraryFragmentCard = ({ data, style, width, handleFragmentRemoved }) => {
  const name = data?.name || "";
  const src = data?.image?.url || "";
  const ratio = data?.ratio;
  const fragmentId = data?._id;

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const [likeCount, setLikeCount] = useState(data?.likes ?? 0);
  const [viewCount, setViewCount] = useState(data?.views ?? 0);

  const [removeFromCrystalOpen, setRemoveFromCrystalOpen] = useState(false);

  // EFFECT 1: load viewer metrics
  // available for both signed in and out
  useEffect(() => {
    if (!fragmentId) return;

    setLoadingMetrics(true);

    (async () => {
      try {
        // Always fetch base counts (works for logged-out too)
        const metrics = await getFragmentMetrics(fragmentId);
        setLikeCount(metrics.likeCount);
        setViewCount(metrics.viewCount);

        // If logged in, also fetch isLiked + authoritative counts
        if (userId) {
          const likeRes = await checkLikeStatus(fragmentId);
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
  }, [fragmentId, userId]);

  // EFFECT 2: load saved status
  // available only for signed in
  useEffect(() => {
    if (!fragmentId) return;

    // Save status is only relevant when logged in
    if (!userId) {
      setLoadingSaved(false);
      setIsSaved(false);
      return;
    }

    setLoadingSaved(true);

    (async () => {
      try {
        const res = await checkSaveStatus(fragmentId);
        setIsSaved(!!res.isSaved);
      } catch (e) {
        toast.error(e?.message || "Failed to load save status");
      } finally {
        setLoadingSaved(false);
      }
    })();
  }, [fragmentId, userId]);

  // straightforward handle save button click
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) return toast.error("You must be signed in to save a fragment");

    try {
      const res = await saveFragment(fragmentId);
      setIsSaved(res.isSaved);
      toast.success(res.message);
    } catch (e) {
      toast.error(e?.message || "Failed to update save status");
    }
  };

  // straightforward handle like button click
  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) return toast.error("You must be signed in to like a fragment");

    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!prevLiked);
    setLikeCount((c) => c + (prevLiked ? -1 : 1));

    try {
      const res = await toggleLikeFragment(fragmentId);
      setIsLiked(!!res.isLiked);
      setLikeCount(res.likeCount ?? prevCount);
    } catch (e) {
      // revert
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error(e?.message || "Failed to toggle like");
    }
  };

  return (
    // IMPORTANT: apply masonic's positioning style
    <div style={style}>
      <div className="flex flex-col overflow-hidden w-full">
        {/* Hover group wrapper */}
        <div
          className="relative w-full group"
          style={{
            aspectRatio: `${ratio}`,
            minHeight: 140,
          }}
        >
          {src && fragmentId && (
            <Link
              href={`/fragment/${fragmentId}`}
              className="block h-full w-full"
            >
              <Image
                src={src}
                alt={name}
                fill
                sizes={`${Math.ceil(width)}px`}
                style={{ objectFit: "cover" }}
                priority={false}
                className="
                  rounded-lg
                  transition-opacity
                  duration-200
                  group-hover:opacity-80
                "
              />
            </Link>
          )}

          {/* top bar */}
          <div
            className="
              absolute top-0 left-0 right-0 px-1 py-1
              flex justify-between
              opacity-0 -translate-y-1 transition-all duration-200
              group-hover:opacity-100 group-hover:translate-y-0"
          >
            <button
              onClick={() => setRemoveFromCrystalOpen(true)}
              className="
                flex
                gap-1.5
                px-2
                py-2
                text-xs
                font-medium
                text-white
                rounded-md
              "
              style={{ backgroundColor: "#B30000" }}
              aria-label="Remove from Crystal"
              title="Remove from Crystal"
            >
              <span>Remove</span>
              <GemIcon size={18} strokeWidth={1.75} className="" />
            </button>

            {userId && loadingSaved && (
              <p className="px-3 py-2 text-xs font-medium text-white rounded-md bg-[#722F37]">
                ...
              </p>
            )}

            {userId && !loadingSaved && (
              <button
                className="
                px-3
                py-2
                text-xs
                font-medium
                text-white
                rounded-md
              "
                className="px-3 py-2 text-xs font-medium text-white rounded-md bg-[#722F37] hover:bg-[#5E2530] transition-colors duration-150"
                onClick={handleToggleSave}
              >
                {isSaved ? "Unsave" : "Save"}
              </button>
            )}
          </div>

          {/* bottom bar */}
          <div
            className="
              absolute bottom-0 left-0 right-0 px-1 py-1
              flex items-center justify-between
              opacity-0 -translate-y-1 transition-all duration-200
              group-hover:opacity-100 group-hover:translate-y-0"
          >
            {/* viewer metrics */}
            <div className="flex flex-row items-center gap-1">
              <button onClick={handleToggleLike} className="cursor-pointer">
                <Heart
                  size={20}
                  strokeWidth={1.75}
                  className={isLiked ? "fill-[#722F37] stroke-[#722F37]" : "stroke-white"}
                />
              </button>

              {!loadingMetrics ? (
                <span className="text-xs text-white">{likeCount}</span>
              ) : (
                <span className="text-xs text-white">...</span>
              )}

              <Eye size={22} strokeWidth={1.75} />
              {!loadingMetrics ? (
                <span className="text-xs text-white">{viewCount}</span>
              ) : (
                <span className="text-xs text-white">...</span>
              )}
            </div>

            {/* share button */}
            {/* <Share size={20} strokeWidth={1.75} /> */}
          </div>
        </div>

        <RemoveFromCrystalModal
          open={removeFromCrystalOpen}
          onClose={() => setRemoveFromCrystalOpen(false)}
          fragmentId={fragmentId}
          onRemove={handleFragmentRemoved}
        />

        <span className="p-2 text-sm text-[#111111]">{name}</span>
      </div>
    </div>
  );
};

export default LibraryFragmentCard;

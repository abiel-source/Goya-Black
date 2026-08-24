////////////////////////////////////////////////////////////////////////////
/////////////////////////////// AUTHOR NOTES ///////////////////////////////
////////////////////////////////////////////////////////////////////////////
// revise `checkLikeStatus.js` action to reduce redundant api calls
// introduce comment section
// introduce sharing features for instagram, twitter/x, facebook, ...
// introduce (optional) location/map feature
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import viewFragment from "@/app/actions/viewFragment";
import saveFragment from "@/app/actions/saveFragment";
import checkSaveStatus from "@/app/actions/checkSaveStatus";
import toggleLikeFragment from "@/app/actions/toggleLikeFragment";
import checkLikeStatus from "@/app/actions/checkLikeStatus";
import getFragmentMetrics from "@/app/actions/getFragmentMetrics";
import getUserDetails from "@/app/actions/getUserDetails";
import getThreadCount from "@/app/actions/comment/getThreadCount";

import CommentsModal from "@/components/modals/CommentsModal";
import AddToCrystalModal from "@/components/modals/AddToCrystalModal";

import { Heart, Eye, Share, MessageCircle, GemIcon } from "lucide-react";

const ACCENT = "#2D6A4F";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  // e.g., "Feb 4, 2026"
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const FragmentCardDetails = ({
  data,
  style,
  width,
  fixedMediaHeight = 600,
}) => {
  const name = data?.name || "";
  const description = data?.description || "";
  const src = data?.image?.url || "";
  const ratio = data?.ratio;
  const fragmentId = data?._id;
  const creatorId = data?.ownerId;

  const createdAt = data?.createdAt;

  // WHICH SHOULD POPULATE THE CREATOR NAME & AVATAR ******************************************
  // const owner =
  //   data?.ownerId && typeof data.ownerId === "object" ? data.ownerId : null;
  // const creatorName = owner?.name || "Unknown creator";
  // const creatorAvatar = owner?.image || "";

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // check if self == creator
  const amICreator = userId == creatorId;

  // Prevent double-call in dev / strict mode rerenders
  const didRecordView = useRef(false);

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingCreator, setLoadingCreator] = useState(true);

  const [likeCount, setLikeCount] = useState(data?.likes ?? 0);
  const [viewCount, setViewCount] = useState(data?.views ?? 0);
  const [commentCount, setCommentCount] = useState(0);

  const [creatorName, setCreatorName] = useState("Unknown creator");
  const [creatorAvatar, setCreatorAvatar] = useState("");

  const [descExpanded, setDescExpanded] = useState(false);

  // modal states
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [addToCrystalOpen, setAddToCrystalOpen] = useState(false);

  //////////////////////////////////////////////////////////////////////
  // Record a view (for authenticated users only)
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!fragmentId) return;
    if (status !== "authenticated") return;
    if (didRecordView.current) return;

    didRecordView.current = true;

    (async () => {
      try {
        await viewFragment(fragmentId);
      } catch (e) {
        // (optional) comment toast out if it gets annoying
        toast.error(e?.message || "Failed to record view");
        console.log(e?.message);
      }
    })();
  }, [fragmentId, status]);

  //////////////////////////////////////////////////////////////////////
  // Load viewer metrics for both authenticated & unauthenticated users
  // if logged-in then further get: isLiked status + authoritative counts
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!fragmentId) return;

    setLoadingMetrics(true);

    (async () => {
      try {
        const metrics = await getFragmentMetrics(fragmentId);
        setLikeCount(metrics.likeCount);
        setViewCount(metrics.viewCount);

        // count comments
        const threadCountRes = await getThreadCount(fragmentId);
        setCommentCount(threadCountRes);

        if (userId) {
          const likeRes = await checkLikeStatus(fragmentId); // redundant server calls
          setIsLiked(!!likeRes.isLiked);
          setLikeCount(likeRes.likeCount); // redundant?
          setViewCount(likeRes.viewCount); // redundant?
        }
      } catch (e) {
        toast.error(e?.message || "Failed to load metrics");
      } finally {
        setLoadingMetrics(false);
      }
    })();
  }, [fragmentId, userId]);

  //////////////////////////////////////////////////////////////////////
  // Load saved status (for authenticated users only)
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!fragmentId) return;

    if (!userId) {
      setLoadingSaved(false);
      setIsSaved(false);
      return;
    }

    setLoadingSaved(true);

    (async () => {
      try {
        const res = await checkSaveStatus(fragmentId);
        setIsSaved(!!res.isSaved); // must type cast to bool
      } catch (e) {
        toast.error(e?.message || "Failed to load save status");
      } finally {
        setLoadingSaved(false);
      }
    })();
  }, [fragmentId, userId]);

  //////////////////////////////////////////////////////////////////////
  // Load (owner) user details
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!data?.ownerId) return;

    setLoadingCreator(true);

    (async () => {
      try {
        const { username, image } = await getUserDetails(data?.ownerId);
        setCreatorName(username ?? "Unknown creator");
        setCreatorAvatar(image ?? "");
      } catch (e) {
        toast.error(e?.message || "Failed to load creator details");
      } finally {
        setLoadingCreator(false);
      }
    })();
  }, [data?.ownerId]);

  // handle save button press - relevant for authenticated users only
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) return toast.error("You must be signed in to save a fragment");

    try {
      const res = await saveFragment(fragmentId);
      setIsSaved(res.isSaved);
      toast.success(res.message);
    } catch (e2) {
      toast.error(e2?.message || "Failed to update save status");
    }
  };

  // handle like button press - relevant for authenticated users only
  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) return toast.error("You must be signed in to like a fragment");

    const prevLiked = isLiked;
    const prevCount = likeCount;

    // update the local state/UI first
    setIsLiked(!prevLiked);
    setLikeCount((c) => c + (prevLiked ? -1 : 1));

    try {
      const res = await toggleLikeFragment(fragmentId);
      setIsLiked(!!res.isLiked);
      setLikeCount(res.likeCount ?? prevCount);
    } catch (e2) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error(e2?.message || "Failed to toggle like");
    }
  };

  // rewrite eventually to support instagram, X/twitter, facebook, ...
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const url =
        typeof window !== "undefined"
          ? window.location.href
          : `/fragment/${fragmentId}`;

      if (navigator?.share) {
        await navigator.share({
          title: name || "Fragment",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      }
    } catch (e2) {
      toast.error("Could not share");
    }
  };

  return (
    <div style={style} className="w-full">
      {/* FIXED HEIGHT TOP CARD */}
      <div
        className="flex w-full flex-col rounded-t-lg bg-white border border-[#E5E7EB] overflow-hidden"
        style={{ height: fixedMediaHeight }}
      >
        {/* Creator header */}
        <div className="flex items-center gap-3 px-3 py-3 border-b border-[#E5E7EB] shrink-0">
          {/* creator avatar picture */}
          <div className="relative h-9 w-9 rounded-full overflow-hidden bg-zinc-100">
            {creatorAvatar ? (
              <Link
                href={
                  amICreator
                    ? `/library?tab=created`
                    : `/profile/${creatorId}?tab=created`
                }
              >
                <Image
                  src={creatorAvatar}
                  alt={creatorName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </Link>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400">
                {creatorName
                  .split(" ")
                  .slice(0, 2)
                  .map((s) => (s?.[0] || "").toUpperCase())
                  .join("") || "?"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <Link
              href={
                amICreator
                  ? `/library?tab=created`
                  : `/profile/${creatorId}?tab=created`
              }
            >
              <div className="text-sm text-[#111111] font-medium truncate">
                {creatorName}
              </div>
            </Link>

            <div className="text-xs text-zinc-400 truncate">
              {name || "Untitled fragment"}
            </div>
          </div>
        </div>

        {/* Image stays fixed within the top shell */}
        <div className="relative w-full flex-1 min-h-0">
          {src ? (
            <Image
              src={src}
              alt={name}
              fill
              sizes={`${Math.ceil(width)}px`}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              No image
            </div>
          )}
        </div>

        {/* Icon bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#E5E7EB] shrink-0">
          {/* left cluster */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleLike}
              className="flex items-center gap-1 text-zinc-500 hover:text-[#2D6A4F] transition-colors duration-150"
            >
              <Heart
                size={20}
                strokeWidth={1.75}
                className={isLiked ? "fill-[#2D6A4F] stroke-[#2D6A4F]" : ""}
              />
              {!loadingMetrics ? (
                <span className="text-xs">{likeCount}</span>
              ) : (
                <span className="text-xs">...</span>
              )}
            </button>

            <div className="flex items-center gap-1 text-zinc-500">
              <Eye size={20} strokeWidth={1.75} />
              {!loadingMetrics ? (
                <span className="text-xs">{viewCount}</span>
              ) : (
                <span className="text-xs">...</span>
              )}
            </div>

            <button
              onClick={() => setMessagesOpen(true)}
              className="flex items-center gap-1 text-zinc-500 hover:text-[#2D6A4F] transition-colors duration-150"
            >
              <MessageCircle size={20} strokeWidth={1.75} />
              {!loadingMetrics ? (
                <span className="text-xs">{commentCount}</span>
              ) : (
                <span className="text-xs">...</span>
              )}
            </button>

            <CommentsModal
              open={messagesOpen}
              onClose={() => setMessagesOpen(false)}
              imgSrc={src}
              fragmentId={fragmentId}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddToCrystalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-2 text-xs font-medium text-white rounded-md"
              style={{ backgroundColor: "#5D3FD3" }}
            >
              <span className="text-xs text-white">Add</span>
              <GemIcon size={16} strokeWidth={1.75} />
            </button>

            <AddToCrystalModal
              open={addToCrystalOpen}
              onClose={() => setAddToCrystalOpen(false)}
              fragmentId={fragmentId}
            />

            <div>
              {userId && loadingSaved && (
                <div
                  className="px-3 py-2 text-xs font-medium text-white rounded-md"
                  style={{ backgroundColor: ACCENT }}
                >
                  ...
                </div>
              )}

              {(!userId || !loadingSaved) && (
                <button
                  onClick={handleToggleSave}
                  className="px-3 py-2 text-xs font-medium text-white rounded-md hover:opacity-95 transition"
                  style={{ backgroundColor: ACCENT }}
                >
                  {userId ? (isSaved ? "Unsave" : "Save") : "Sign in to save"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VARIABLE HEIGHT BOTTOM SECTION */}
      <div className="rounded-b-lg border-x border-b border-[#E5E7EB] bg-white px-3 pt-2 pb-3">
        {createdAt && (
          <div className="text-xs text-zinc-400 mb-2">
            {formatDate(createdAt)}
          </div>
        )}

        {description ? (
          <button
            type="button"
            onClick={() => setDescExpanded((v) => !v)}
            className="text-left w-full"
          >
            <p
              className={[
                "text-sm text-zinc-700 leading-relaxed",
                descExpanded ? "" : "line-clamp-1",
              ].join(" ")}
            >
              {description}
            </p>
            <div className="mt-1 text-xs" style={{ color: ACCENT }}>
              {descExpanded ? "Collapse" : "Read more"}
            </div>
          </button>
        ) : (
          <div className="text-sm text-zinc-400">No description.</div>
        )}
      </div>
    </div>
  );
};

export default FragmentCardDetails;

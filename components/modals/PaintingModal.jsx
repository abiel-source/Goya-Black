"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { X, Heart, Eye, Bookmark, MessageCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import viewPainting from "@/app/actions/viewPainting";
import savePainting from "@/app/actions/savePainting";
import checkSaveStatus from "@/app/actions/checkSaveStatus";
import toggleLikePainting from "@/app/actions/toggleLikePainting";
import checkLikeStatus from "@/app/actions/checkLikeStatus";
import getNextRelatedPaintingsPage from "@/app/actions/query/getNextRelatedPaintingsPage";
import loadThreads from "@/app/actions/comment/loadThreads";
import createThread from "@/app/actions/comment/createThread";
import replyToThread from "@/app/actions/comment/replyToThread";

const PAGE_SIZE = 8;
const SCROLL_THRESHOLD = 40;
const SCROLL_COOLDOWN_MS = 650;

const PaintingModal = ({ open, onClose, painting: initialPainting }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [paintings, setPaintings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [threads, setThreads] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const scrollLocked = useRef(false);
  const touchStartY = useRef(null);
  const basePaintingIdRef = useRef(null);
  const cursorRef = useRef(null);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);

  const painting = paintings[currentIndex] || null;
  const paintingId = painting?._id;

  // Keep refs in sync so advance() can read them without stale closures
  useEffect(() => { cursorRef.current = cursor; }, [cursor]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);

  // Init feed whenever the modal opens with a new painting
  useEffect(() => {
    if (!open || !initialPainting) return;

    basePaintingIdRef.current = initialPainting._id?.toString();
    setPaintings([initialPainting]);
    setCurrentIndex(0);
    setCursor(null);
    setHasMore(true);
    setCommentsOpen(false);
    setThreads([]);
    setNewComment("");
    setReplyingTo(null);

    (async () => {
      try {
        const result = await getNextRelatedPaintingsPage({
          paintingId: initialPainting._id,
          cursorCreatedAt: null,
          cursorId: null,
          limit: PAGE_SIZE,
        });
        const next = result.items.map((item) => item.painting);
        setPaintings((prev) => [...prev, ...next]);
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch (e) {
        console.error("Failed to seed feed", e);
      }
    })();
  }, [open, initialPainting?._id]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Load per-painting interactive state when painting changes
  useEffect(() => {
    if (!paintingId) return;
    setIsSaved(false);
    setIsLiked(false);
    setLikeCount(painting?.likes ?? 0);
    setViewCount(painting?.views ?? 0);

    if (!userId) return;
    (async () => {
      try {
        await viewPainting(paintingId);
        const [likeRes, saveRes] = await Promise.all([
          checkLikeStatus(paintingId),
          checkSaveStatus(paintingId),
        ]);
        setIsLiked(!!likeRes.isLiked);
        setLikeCount(likeRes.likeCount ?? painting?.likes ?? 0);
        setViewCount(likeRes.viewCount ?? painting?.views ?? 0);
        setIsSaved(!!saveRes.isSaved);
      } catch (e) {
        // non-critical
      }
    })();
  }, [paintingId, userId]);

  // Load threads when comments panel opens
  useEffect(() => {
    if (!commentsOpen || !paintingId) return;
    (async () => {
      try {
        const res = await loadThreads(paintingId);
        setThreads(res.rows || []);
      } catch (e) {
        console.error("Failed to load threads", e);
      }
    })();
  }, [commentsOpen, paintingId]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current || !basePaintingIdRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const result = await getNextRelatedPaintingsPage({
        paintingId: basePaintingIdRef.current,
        cursorCreatedAt: cursorRef.current?.createdAt ?? null,
        cursorId: cursorRef.current?.id ?? null,
        limit: PAGE_SIZE,
      });
      const next = result.items.map((item) => item.painting);
      setPaintings((prev) => [...prev, ...next]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (e) {
      console.error("Failed to load more paintings", e);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, []);

  const advance = useCallback((dir, total) => {
    if (scrollLocked.current) return;
    scrollLocked.current = true;
    setTimeout(() => { scrollLocked.current = false; }, SCROLL_COOLDOWN_MS);

    setCurrentIndex((prev) => {
      const next = prev + dir;
      if (next < 0 || next >= total) return prev;
      if (next >= total - 2) loadMore();
      return next;
    });

    setCommentsOpen(false);
    setThreads([]);
  }, [loadMore]);

  // Wheel snap — use a ref for total so advance closure stays stable
  const paintingsLenRef = useRef(0);
  useEffect(() => { paintingsLenRef.current = paintings.length; }, [paintings.length]);

  useEffect(() => {
    if (!open) return;
    const onWheel = (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;
      advance(e.deltaY > 0 ? 1 : -1, paintingsLenRef.current);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [open, advance]);

  // Touch snap
  useEffect(() => {
    if (!open) return;
    const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 60) advance(delta > 0 ? 1 : -1, paintingsLenRef.current);
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [open, advance]);

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

  const handleSubmitComment = async () => {
    if (!userId) return toast.error("Sign in to comment");
    const text = newComment.trim();
    if (!text) return;
    setSubmittingComment(true);
    try {
      await createThread(paintingId, text);
      setNewComment("");
      const res = await loadThreads(paintingId);
      setThreads(res.rows || []);
    } catch (e) {
      toast.error(e?.message || "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (threadId) => {
    if (!userId) return toast.error("Sign in to reply");
    const text = replyText.trim();
    if (!text) return;
    setSubmittingReply(true);
    try {
      await replyToThread(threadId, text);
      setReplyText("");
      setReplyingTo(null);
      const res = await loadThreads(paintingId);
      setThreads(res.rows || []);
    } catch (e) {
      toast.error(e?.message || "Failed to post reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  if (!open || !painting) return null;

  const src = painting.image?.url || "";
  const title = painting.title || "Untitled";
  const artistName = painting.artistId?.name || null;
  const year = painting.year || null;
  const medium = painting.medium || null;
  const movement = painting.movementId?.name || null;
  const dimensions = painting.dimensions || null;
  const museum = painting.museum || null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex overflow-hidden">

      {/* ── Left: Metadata (desktop only) ── */}
      <div className="hidden md:flex w-52 shrink-0 flex-col justify-center px-6 gap-2">
        <h2 className="text-white font-semibold text-base leading-snug">{title}</h2>
        {artistName && <p className="text-white/60 text-sm">{artistName}</p>}
        <div className="flex flex-col gap-1.5 mt-2 text-xs text-white/50">
          {year && <span><span className="text-white/80 font-medium">Year</span> · {year}</span>}
          {movement && <span><span className="text-white/80 font-medium">Movement</span> · {movement}</span>}
          {medium && <span><span className="text-white/80 font-medium">Medium</span> · {medium}</span>}
          {dimensions && <span><span className="text-white/80 font-medium">Dimensions</span> · {dimensions}</span>}
          {museum && <span><span className="text-white/80 font-medium">Museum</span> · {museum}</span>}
        </div>
      </div>

      {/* ── Center: Painting ── */}
      <div className="flex-1 relative flex items-center justify-center">
        {src && (
          <Image
            src={src}
            alt={title}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        )}

        {/* Mobile: metadata overlay at bottom-left */}
        <div className="absolute bottom-0 left-0 right-16 px-4 pb-6 pt-16 bg-gradient-to-t from-black/75 to-transparent md:hidden pointer-events-none">
          <p className="text-white font-semibold text-sm leading-snug drop-shadow">{title}</p>
          {artistName && <p className="text-white/70 text-xs mt-0.5 drop-shadow">{artistName}</p>}
          {year && <p className="text-white/50 text-xs mt-0.5 drop-shadow">{year}</p>}
        </div>
      </div>

      {/* ── Right: Close + Action icons ── */}
      <div className="w-16 shrink-0 flex flex-col items-center pt-5 pb-10 z-10">
        {/* Close */}
        <button
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X size={20} strokeWidth={1.75} className="stroke-white" />
        </button>

        {/* Icons centered in remaining space */}
        <div className="flex-1 flex flex-col items-center justify-center gap-7">
          <button onClick={handleToggleLike} className="flex flex-col items-center gap-1.5">
            <Heart
              size={28}
              strokeWidth={1.75}
              className={isLiked ? "fill-[#722F37] stroke-[#722F37]" : "stroke-white"}
            />
            <span className="text-white text-xs">{likeCount}</span>
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <Eye size={28} strokeWidth={1.75} className="stroke-white/60" />
            <span className="text-white/60 text-xs">{viewCount}</span>
          </div>

          <button onClick={handleToggleSave} className="flex flex-col items-center gap-1.5">
            <Bookmark
              size={28}
              strokeWidth={1.75}
              className={isSaved ? "fill-white stroke-white" : "stroke-white"}
            />
          </button>

          <button onClick={() => setCommentsOpen((v) => !v)} className="flex flex-col items-center gap-1.5">
            <MessageCircle
              size={28}
              strokeWidth={1.75}
              className={commentsOpen ? "stroke-[#722F37] fill-[#722F37]/20" : "stroke-white"}
            />
          </button>
        </div>
      </div>

      {/* ── Comments panel ── */}
      {commentsOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-30 md:hidden bg-black/30"
            onClick={() => setCommentsOpen(false)}
          />

          {/* Panel: slides in from right on desktop, up from bottom on mobile */}
          <div className="
            fixed z-40 bg-zinc-900 flex flex-col shadow-2xl
            bottom-0 left-0 right-0 h-[30vh] rounded-t-2xl
            md:left-auto md:right-16 md:top-[25%] md:bottom-[25%] md:h-auto md:w-80 md:rounded-l-2xl md:rounded-r-none
          ">
            <div className="relative flex items-center justify-center px-4 py-3 shrink-0">
              <button onClick={() => setCommentsOpen(false)} className="absolute left-4">
                <X size={16} strokeWidth={1.75} className="text-white/40 hover:text-white/70" />
              </button>
              <span className="text-sm font-semibold text-white/90">Comments</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
              {threads.length === 0 && (
                <p className="text-sm text-white/40">No comments yet. Be the first!</p>
              )}
              {threads.map(({ thread, topComment }) => {
                const userImg = topComment?.userId?.image;
                const username = topComment?.userId?.username || "User";
                const threadId = thread._id.toString();
                return (
                  <div key={threadId} className="space-y-2">
                    <div className="flex gap-3">
                      {userImg ? (
                        <Image
                          src={userImg}
                          alt=""
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-zinc-200 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-zinc-800 mr-2">{username}</span>
                        <span className="text-xs text-zinc-600 break-words">{topComment?.text}</span>
                        <div className="flex items-center gap-3 mt-1">
                          {thread.replyCount > 0 && (
                            <span className="text-xs text-zinc-400">
                              {thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}
                            </span>
                          )}
                          {userId && (
                            <button
                              onClick={() => setReplyingTo(replyingTo === threadId ? null : threadId)}
                              className="text-xs text-white/30 hover:text-white/60 transition-colors"
                            >
                              Reply
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {replyingTo === threadId && (
                      <div className="ml-10 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSubmitReply(threadId); }}
                          placeholder="Write a reply..."
                          className="flex-1 text-xs bg-zinc-800 border border-white/10 text-white placeholder-white/30 rounded-lg px-3 py-1.5 outline-none focus:border-white/30"
                        />
                        <button
                          onClick={() => handleSubmitReply(threadId)}
                          disabled={submittingReply}
                          className="text-[#722F37] disabled:opacity-50"
                        >
                          <Send size={14} strokeWidth={1.75} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t border-white/10 shrink-0">
              {userId ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmitComment(); }}
                    placeholder="Add a comment..."
                    className="flex-1 text-sm bg-zinc-800 border border-white/10 text-white placeholder-white/30 rounded-lg px-3 py-2 outline-none focus:border-white/30"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={submittingComment}
                    className="text-white/60 hover:text-white transition-colors disabled:opacity-30"
                  >
                    <Send size={18} strokeWidth={1.75} />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-white/30 text-center">Sign in to leave a comment.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaintingModal;

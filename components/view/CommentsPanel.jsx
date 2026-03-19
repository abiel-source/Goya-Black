"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import loadThreads from "@/app/actions/comment/loadThreads";
import getThreadComments from "@/app/actions/comment/getThreadComments";
import createThread from "@/app/actions/comment/createThread";
import replyToThread from "@/app/actions/comment/replyToThread";
import toggleLikeComment from "@/app/actions/comment/toggleLikeComment";

import Comment from "@/components/view/Comment";

const CommentsPanel = ({ fragmentId, imgSrc }) => {
  const { status } = useSession();
  const authed = status === "authenticated";

  // Updated threads cache rows = [ { thread, topComment } ]
  const [rows, setRows] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);

  // Expanded + cached thread comments
  const [expandedThreads, setExpandedThreads] = useState(() => new Set());
  const [threadCommentsCache, setThreadCommentsCache] = useState({}); // threadId -> comments[]
  const [loadingThreadIds, setLoadingThreadIds] = useState(() => new Set());

  // Composer
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [replyToThreadId, setReplyToThreadId] = useState(null);

  // Like-loading per comment
  const [likingCommentIds, setLikingCommentIds] = useState(() => new Set());

  const rowList = useMemo(() => rows || [], [rows]);

  //////////////////////////////////////////////////////////////////////
  // Load thread rows (thread + topComment)
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!fragmentId) return;

    setLoadingThreads(true);
    (async () => {
      try {
        const res = await loadThreads(fragmentId);
        setRows(res?.rows || []);
      } catch (e) {
        toast.error(e?.message || "Failed to load comments");
      } finally {
        setLoadingThreads(false);
      }
    })();
  }, [fragmentId]);

  //////////////////////////////////////////////////////////////////////
  // Expand/collapse replies (fetch once)
  //////////////////////////////////////////////////////////////////////
  const toggleReplies = async (threadId) => {
    if (!threadId) return;

    const isExpanded = expandedThreads.has(threadId);

    if (isExpanded) {
      setExpandedThreads((prev) => {
        const next = new Set(prev);
        next.delete(threadId);
        return next;
      });
      return;
    }

    setExpandedThreads((prev) => new Set(prev).add(threadId));

    if (!threadCommentsCache[threadId]) {
      setLoadingThreadIds((prev) => new Set(prev).add(threadId));
      try {
        const res = await getThreadComments(threadId); // { comments: augmented }
        setThreadCommentsCache((prev) => ({
          ...prev,
          [threadId]: res?.comments || [],
        }));
      } catch (e) {
        toast.error(e?.message || "Failed to load replies");
      } finally {
        setLoadingThreadIds((prev) => {
          const next = new Set(prev);
          next.delete(threadId);
          return next;
        });
      }
    }
  };

  //////////////////////////////////////////////////////////////////////
  // Like comment (update cache + also update topComment row if needed)
  //////////////////////////////////////////////////////////////////////
  const onToggleLike = async (comment) => {
    if (!authed) {
      toast.error("Sign in to like comments");
      return;
    }

    const commentId = comment?._id?.toString?.() ?? comment?._id;
    if (!commentId) return;

    setLikingCommentIds((prev) => new Set(prev).add(commentId));

    try {
      const res = await toggleLikeComment(commentId);
      const { isLiked, likeCount } = res || {};

      // Update cached replies (if present)
      setThreadCommentsCache((prev) => {
        const next = { ...prev };
        for (const tid of Object.keys(next)) {
          const arr = next[tid] || [];
          const idx = arr.findIndex(
            (c) => (c?._id?.toString?.() ?? c?._id) === commentId
          );
          if (idx !== -1) {
            const updated = { ...arr[idx] };
            updated.isLikedByMe = !!isLiked;
            updated.likes =
              typeof likeCount === "number" ? likeCount : updated.likes;
            next[tid] = [...arr.slice(0, idx), updated, ...arr.slice(idx + 1)];
          }
        }
        return next;
      });

      // Update topComment in rows (for non-expanded display)
      setRows((prev) =>
        prev.map((r) => {
          const topId = r?.topComment?._id?.toString?.() ?? r?.topComment?._id;
          if (topId !== commentId) return r;
          return {
            ...r,
            topComment: {
              ...r.topComment,
              isLikedByMe: !!isLiked,
              likes:
                typeof likeCount === "number" ? likeCount : r.topComment.likes,
            },
          };
        })
      );
    } catch (e) {
      toast.error(e?.message || "Failed to like comment");
    } finally {
      setLikingCommentIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  //////////////////////////////////////////////////////////////////////
  // Send comment (top-level or reply)
  //////////////////////////////////////////////////////////////////////
  const handleSend = async () => {
    if (!authed) {
      toast.error("Sign in to comment");
      return;
    }

    const text = draft.trim();
    if (!text) return;

    setSending(true);
    try {
      if (replyToThreadId) {
        const res = await replyToThread(replyToThreadId, text);

        // Update thread meta in rows
        setRows((prev) =>
          prev.map((r) => {
            const tid = r?.thread?._id?.toString?.() ?? r?.thread?._id;
            if (tid !== replyToThreadId) return r;
            return {
              ...r,
              thread: {
                ...r.thread,
                replyCount: (r.thread.replyCount ?? 0) + 1,
                lastCommentAt: new Date(),
                lastCommentPreview: text.slice(0, 140),
              },
            };
          })
        );

        // Only append if we already have the cache (thread is expanded/loaded)
        setThreadCommentsCache((prev) => {
          const existing = prev[replyToThreadId];
          if (!existing) return prev; // unexpanded: do nothing
          return {
            ...prev,
            [replyToThreadId]: [...existing, res?.reply].filter(Boolean),
          };
        });

        setDraft("");
        return;
      }

      // Create new thread (top-level)
      await createThread(fragmentId, text);

      // simplest correct refresh
      const refreshed = await loadThreads(fragmentId);
      setRows(refreshed?.rows || []);
      setDraft("");
    } catch (e) {
      toast.error(e?.message || "Failed to post comment");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full min-h-0 grid grid-cols-1 md:grid-cols-2">
      {/* LEFT */}
      <div className="relative w-full h-full bg-black">
        {imgSrc ? (
          <Image src={imgSrc} alt="Fragment" fill className="object-contain" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            No image
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col h-full min-h-0 border-l border-white/10 bg-black">
        <div className="px-4 py-3 border-b border-white/10 text-white font-semibold">
          Comments
        </div>

        <div className="flex-1 min-h-0 overflow-auto px-4 py-3 space-y-4">
          {loadingThreads ? (
            <div className="text-sm text-white/60">Loading...</div>
          ) : rowList.length === 0 ? (
            <div className="text-sm text-white/60">
              Be the first to comment.
            </div>
          ) : (
            rowList.map(({ thread, topComment }) => {
              const threadId = thread?._id?.toString?.() ?? thread?._id;
              const expanded = expandedThreads.has(threadId);
              const loadingReplies = loadingThreadIds.has(threadId);

              const cached = threadCommentsCache[threadId] || [];
              const replies = cached.filter((c) => c.kind === "reply");

              return (
                <div key={threadId} className="border-b border-white/10 pb-3">
                  <Comment
                    comment={topComment}
                    indent={0}
                    onToggleLike={onToggleLike}
                    liking={likingCommentIds.has(
                      topComment?._id?.toString?.() ?? topComment?._id
                    )}
                  />

                  <div className="mt-1 flex items-center gap-3 text-xs text-white/50">
                    {thread?.replyCount > 0 && (
                      <button
                        type="button"
                        className="hover:text-white transition"
                        onClick={() => toggleReplies(threadId)}
                      >
                        {expanded
                          ? "Hide replies"
                          : `View ${thread.replyCount} replies`}
                      </button>
                    )}

                    <button
                      type="button"
                      className="hover:text-white transition"
                      onClick={() => setReplyToThreadId(threadId)}
                    >
                      Reply
                    </button>
                  </div>

                  {expanded && (
                    <div className="mt-2">
                      {loadingReplies ? (
                        <div className="text-xs text-white/60 pl-4">
                          Loading replies...
                        </div>
                      ) : replies.length === 0 ? (
                        <div className="text-xs text-white/60 pl-4">
                          No replies yet.
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {replies.map((r) => {
                            const rid = r?._id?.toString?.() ?? r?._id;
                            return (
                              <Comment
                                key={rid}
                                comment={r}
                                indent={18}
                                onToggleLike={onToggleLike}
                                liking={likingCommentIds.has(rid)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-white/10 p-3">
          {replyToThreadId && (
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>Replying in thread</span>
              <button
                type="button"
                className="hover:text-white transition"
                onClick={() => setReplyToThreadId(null)}
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                replyToThreadId ? "Write a reply..." : "Add a comment..."
              }
              className="
                flex-1 rounded-xl bg-white/5 border border-white/10
                px-3 py-2 text-sm text-white placeholder:text-white/40
                outline-none focus:border-[#5D3FD3]
              "
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={sending || draft.trim().length === 0}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "#5D3FD3" }}
            >
              {sending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsPanel;

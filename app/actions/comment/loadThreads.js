"use server";

import connectDB from "@/config/database";
import Thread from "@/models/Thread";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function loadThreads(fragmentId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  const threads = await Thread.find({ fragmentId, isDeleted: false })
    .sort({ lastCommentAt: -1, createdAt: -1 })
    .lean();

  if (threads.length === 0) return { rows: [] };

  const threadIds = threads.map((t) => t._id);

  const topComments = await Comment.find({
    threadId: { $in: threadIds },
    fragmentId,
    kind: "top",
    isDeleted: false,
  })
    .populate("userId", "_id username image")
    .lean();

  const topByThread = new Map(
    topComments.map((c) => [c.threadId.toString(), c])
  );

  // liked-by-me for these top comments (batch)
  let likedSet = new Set();
  const sessionUser = await getSessionUser();
  if (sessionUser?.userId && topComments.length > 0) {
    const userId = sessionUser.userId;
    const topIds = topComments.map((c) => c._id);

    const likes = await CommentLike.find({
      userId,
      commentId: { $in: topIds },
    })
      .select("commentId")
      .lean();

    likedSet = new Set(likes.map((l) => l.commentId.toString()));
  }

  const rows = threads
    .map((thread) => {
      const top = topByThread.get(thread._id.toString());
      if (!top) return null;

      return {
        thread,
        topComment: {
          ...top,
          isLikedByMe: likedSet.has(top._id.toString()),
        },
      };
    })
    .filter(Boolean);

  return { rows };
}

"use server";

// fetch comments for a thread + flag which ones that user liked (2 birds in 1 stone)
// 1) works by fetching thread comments in chronological order
// 2) then augmenting comments with a manual field that indicates if user liked it

import connectDB from "@/config/database";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function getThreadComments(threadId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new Error("Invalid thread ID");
  }

  // Load comments first (chronological)
  const comments = await Comment.find({ threadId, isDeleted: false })
    .sort({ createdAt: 1 })
    .populate("userId", "_id username image")
    .lean();

  // Default: not liked
  let likedSet = new Set();

  // If authenticated, fetch likes for these comments in one query
  const sessionUser = await getSessionUser();
  if (sessionUser?.userId && comments.length > 0) {
    const userId = sessionUser.userId;
    const commentIds = comments.map((c) => c._id);

    const likes = await CommentLike.find({
      userId,
      commentId: { $in: commentIds },
    })
      .select("commentId")
      .lean();

    likedSet = new Set(likes.map((l) => l.commentId.toString()));
  }

  const augmented = comments.map((c) => ({
    ...c,
    isLikedByMe: likedSet.has(c._id.toString()),
  }));

  return { comments: augmented };
}

"use server";

import connectDB from "@/config/database";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function toggleLikeComment(commentId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error("Invalid comment ID");
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const userId = sessionUser.userId;

  // ensure comment exists (and get current likes if needed)
  const comment = await Comment.findById(commentId).select("_id likes");
  if (!comment) throw new Error("Comment not found");

  try {
    await CommentLike.create({ userId, commentId });

    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true, select: "likes" }
    );

    return { isLiked: true, likeCount: updated?.likes ?? 0 };
  } catch (e) {
    if (e?.code !== 11000) throw e;

    await CommentLike.deleteOne({ userId, commentId });

    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: -1 } },
      { new: true, select: "likes" }
    );

    return { isLiked: false, likeCount: updated?.likes ?? 0 };
  }
}

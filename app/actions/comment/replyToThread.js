"use server";

// equivalent to creating a lower-level comment

import connectDB from "@/config/database";
import Thread from "@/models/Thread";
import Comment from "@/models/Comment";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function replyToThread(threadId, text) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const userId = sessionUser.userId;

  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new Error("Invalid thread ID");
  }

  const clean = (text || "").toString().trim();
  if (!clean) throw new Error("Reply cannot be empty");

  const thread = await Thread.findById(threadId).select("fragmentId");
  if (!thread) throw new Error("Thread not found");

  const reply = await Comment.create({
    threadId,
    fragmentId: thread.fragmentId,
    userId,
    text: clean,
    kind: "reply",
  });

  await Thread.findByIdAndUpdate(threadId, {
    $inc: { replyCount: 1 },
    lastCommentAt: reply.createdAt,
    lastCommentPreview: clean.slice(0, 140),
  });

  // populate and augment new reply
  const replyComment = await Comment.findById(reply._id)
    .populate("userId", "_id username image")
    .lean();

  return {
    reply: { ...replyComment, isLikedByMe: false },
  };
}

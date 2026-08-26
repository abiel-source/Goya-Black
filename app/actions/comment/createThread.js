"use server";

// equivalent to creating a top level comment

import connectDB from "@/config/database";
import Thread from "@/models/Thread";
import Comment from "@/models/Comment";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function createThread(paintingId, text) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const userId = sessionUser.userId;

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  const clean = (text || "").toString().trim();
  if (!clean) throw new Error("Comment cannot be empty");

  const thread = await Thread.create({
    paintingId,
    ownerId: userId,
    preview: clean.slice(0, 140),
    replyCount: 0,
    lastCommentAt: new Date(),
    lastCommentPreview: clean.slice(0, 140),
  });

  const topComment = await Comment.create({
    threadId: thread._id,
    paintingId,
    userId,
    text: clean,
    kind: "top",
  });

  return {
    threadId: thread._id.toString(),
    topComment,
  };
}

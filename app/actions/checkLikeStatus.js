"use server";

import connectDB from "@/config/database";
import Like from "@/models/Like";
import Fragment from "@/models/Fragment";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function checkLikeStatus(fragmentId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  // retrieve session user
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User must be authenticated");
  }
  const { userId } = sessionUser;

  // check existence of pair (userId, fragmentId)
  const likeExists = await Like.exists({ userId, fragmentId });
  const isLiked = likeExists ? true : false;

  // get fragment counts
  const fragment = await Fragment.findById(fragmentId).select("likes views");
  if (!fragment) {
    throw new Error("Fragment not found");
  }

  return {
    isLiked,
    likeCount: fragment.likes ?? 0,
    viewCount: fragment.views ?? 0,
  };
}

export default checkLikeStatus;

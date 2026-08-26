"use server";

import connectDB from "@/config/database";
import Like from "@/models/Like";
import Painting from "@/models/Painting";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function checkLikeStatus(paintingId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  // retrieve session user
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User must be authenticated");
  }
  const { userId } = sessionUser;

  const likeExists = await Like.exists({ userId, paintingId });
  const isLiked = likeExists ? true : false;

  const painting = await Painting.findById(paintingId).select("likes views");
  if (!painting) {
    throw new Error("Painting not found");
  }

  return {
    isLiked,
    likeCount: painting.likes ?? 0,
    viewCount: painting.views ?? 0,
  };
}

export default checkLikeStatus;

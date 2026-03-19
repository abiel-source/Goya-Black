"use server";

import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";
import mongoose from "mongoose";

async function getFragmentMetrics(fragmentId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  // get fragment counts
  const fragment = await Fragment.findById(fragmentId).select("likes views");
  if (!fragment) {
    throw new Error("Fragment not found");
  }

  return {
    likeCount: fragment.likes ?? 0,
    viewCount: fragment.views ?? 0,
  };
}

export default getFragmentMetrics;

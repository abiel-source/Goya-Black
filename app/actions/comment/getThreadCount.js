"use server";

import connectDB from "@/config/database";
import Thread from "@/models/Thread";
import mongoose from "mongoose";

export default async function getThreadCount(fragmentId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  const count = await Thread.countDocuments({
    fragmentId,
    isDeleted: false,
  });

  return count;
}

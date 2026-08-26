"use server";

import connectDB from "@/config/database";
import Thread from "@/models/Thread";
import mongoose from "mongoose";

export default async function getThreadCount(paintingId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  const count = await Thread.countDocuments({
    paintingId,
    isDeleted: false,
  });

  return count;
}

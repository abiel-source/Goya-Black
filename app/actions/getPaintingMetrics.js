"use server";

import connectDB from "@/config/database";
import Painting from "@/models/Painting";
import mongoose from "mongoose";

async function getPaintingMetrics(paintingId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  const painting = await Painting.findById(paintingId).select("likes views");
  if (!painting) {
    throw new Error("Painting not found");
  }

  return {
    likeCount: painting.likes ?? 0,
    viewCount: painting.views ?? 0,
  };
}

export default getPaintingMetrics;

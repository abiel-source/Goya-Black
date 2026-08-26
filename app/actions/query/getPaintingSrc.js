"use server";

// get image meta data for a given fragment

import connectDB from "@/config/database";
import mongoose from "mongoose";
import Painting from "@/models/Painting";

export default async function getPaintingSrc(paintingId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("SERVER: Invalid painting ID");
  }

  const painting = await Painting.findById(paintingId).select("image");
  if (!painting) {
    throw new Error("Painting not found");
  }

  return {
    url: painting.image.url ?? "",
    height: painting.image.height,
    width: painting.image.width,
  };
}

"use server";

// get image meta data for a given fragment

import connectDB from "@/config/database";
import mongoose from "mongoose";
import Fragment from "@/models/Fragment";

export default async function getFragmentSrc(fragmentId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("SERVER: Invalid fragment ID");
  }

  // get fragment image metadata
  const fragment = await Fragment.findById(fragmentId).select("image");
  if (!fragment) {
    throw new Error("Fragment not found");
  }

  return {
    url: fragment.image.url ?? "",
    height: fragment.image.height,
    width: fragment.image.width,
  };
}

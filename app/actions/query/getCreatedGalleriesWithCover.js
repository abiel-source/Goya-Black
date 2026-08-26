"use server";

// augment cover image field

import connectDB from "@/config/database";
import Gallery from "@/models/Gallery";
import mongoose from "mongoose";

export default async function getCreatedGalleriesWithCover(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  await connectDB();

  const galleryDocs = await Gallery.find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .populate("coverPainting", "image.url")
    .lean();

  return JSON.parse(JSON.stringify(galleryDocs)).map((gallery) => ({
    _id: gallery._id,
    name: gallery.name,
    coverImage: gallery.coverPainting?.image?.url || "",
  }));
}

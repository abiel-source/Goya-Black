"use server";

import connectDB from "@/config/database";
import Like from "@/models/Like";
import View from "@/models/View";
import Gallery from "@/models/Gallery";
import mongoose from "mongoose";

export default async function getRecommendedGalleries(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  await connectDB();

  const viewedPaintingDocs = await View.find({ userId })
    .sort({ createdAt: -1 })
    .limit(25)
    .select("paintingId -_id")
    .lean();

  const viewedPaintingIDs = viewedPaintingDocs.map((doc) => doc.paintingId);

  const viewedGalleryDocs = await Gallery.find({
    paintings: { $in: viewedPaintingIDs },
    isPrivate: false,
  }).populate("coverPainting", "image.url").lean();

  const likedPaintingDocs = await Like.find({ userId })
    .sort({ createdAt: -1 })
    .limit(25)
    .select("paintingId -_id")
    .lean();

  const likedPaintingIDs = likedPaintingDocs.map((doc) => doc.paintingId);

  const likedGalleryDocs = await Gallery.find({
    paintings: { $in: likedPaintingIDs },
    isPrivate: false,
  }).populate("coverPainting", "image.url").lean();

  const combinedGalleries = [...viewedGalleryDocs, ...likedGalleryDocs];
  const galleryMap = new Map();
  for (const gallery of combinedGalleries) {
    const key = gallery._id.toString();
    if (!galleryMap.has(key)) galleryMap.set(key, gallery);
  }

  const recommendedGalleries = Array.from(galleryMap.values()).slice(0, 10);

  return JSON.parse(JSON.stringify(recommendedGalleries)).map((gallery) => ({
    _id: gallery._id,
    name: gallery.name,
    coverImage: gallery.coverPainting?.image?.url || "",
  }));
}

"use server";

import connectDB from "@/config/database";
import Painting from "@/models/Painting";
import Gallery from "@/models/Gallery";
import mongoose from "mongoose";

import { randomBetween } from "@/utils/restructureData";

export default async function getGalleryPaintings(galleryId) {
  if (!mongoose.Types.ObjectId.isValid(galleryId)) {
    throw new Error("Invalid Gallery ID");
  }

  await connectDB();

  const gallery = await Gallery.findById(galleryId).select("paintings").lean();
  if (!gallery) {
    throw new Error("Gallery not found");
  }

  const paintingIds = gallery.paintings || [];
  if (paintingIds.length === 0) {
    return [];
  }

  const paintingDocs = await Painting.find({
    _id: { $in: paintingIds },
  })
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  const paintings = JSON.parse(JSON.stringify(paintingDocs));

  const augmentedPaintings = paintings.map((p) => {
    const w = p?.image?.width;
    const h = p?.image?.height;

    return {
      ...p,
      ratio:
        typeof w === "number" && typeof h === "number" && h > 0
          ? w / h
          : randomBetween(0.75, 1.8),
    };
  });

  return augmentedPaintings;
}

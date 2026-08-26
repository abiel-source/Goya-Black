"use server";

import connectDB from "@/config/database";
import Gallery from "@/models/Gallery";
import mongoose from "mongoose";

export default async function processGalleryMembership(paintingId, galleryIds) {
  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  for (const galleryId of galleryIds) {
    if (!mongoose.Types.ObjectId.isValid(galleryId)) {
      throw new Error("Gallery ID array contains invalid entry");
    }
  }

  await connectDB();

  const galleries = await Gallery.find({
    _id: { $in: galleryIds },
  })
    .select("_id paintings")
    .lean();

  const membershipSet = {};

  for (const galleryId of galleryIds) {
    const gallery = galleries.find((g) => g._id.toString() === galleryId);

    membershipSet[galleryId] =
      gallery?.paintings?.some((id) => id.toString() === paintingId) ?? false;
  }

  return membershipSet;
}

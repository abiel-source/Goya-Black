"use server";

import connectDB from "@/config/database";
import Painting from "@/models/Painting";
import User from "@/models/User";

export default async function getUserSavedPaintings(userId) {
  await connectDB();

  const userDoc = await User.findById(userId).lean();

  if (!userDoc) {
    throw new Error("User not found");
  }

  const savedPaintingIds = userDoc?.saved?.paintings || [];

  if (!savedPaintingIds.length) {
    return [];
  }

  const paintingDocs = await Painting.find({
    _id: { $in: savedPaintingIds },
  })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  return JSON.parse(JSON.stringify(paintingDocs));
}

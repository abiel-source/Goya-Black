// get fragments that a user saved from another user (they saved but NOT created)

"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import Gallery from "@/models/Gallery";

export default async function getUserExclusiveSavedGalleries(userId) {
  await connectDB();

  const userDoc = await User.findById(userId).lean();

  if (!userDoc) {
    throw new Error("User not found");
  }

  const savedGalleryIds = userDoc?.saved?.galleries || [];

  if (!savedGalleryIds.length) {
    return [];
  }

  const recentGalleryDocs = await Gallery.find({
    _id: { $in: savedGalleryIds },
    ownerId: { $ne: userId },
  })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  return JSON.parse(JSON.stringify(recentGalleryDocs));
}

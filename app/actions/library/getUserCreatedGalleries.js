// get crystals that a user created - irrespective of the "saved" entry

"use server";

import connectDB from "@/config/database";
import Gallery from "@/models/Gallery";

export default async function getUserCreatedGalleries(userId) {
  await connectDB();

  const recentGalleryDocs = await Gallery.find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return JSON.parse(JSON.stringify(recentGalleryDocs));
}

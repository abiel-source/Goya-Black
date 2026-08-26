"use server";

import connectDB from "@/config/database";
import Gallery from "@/models/Gallery";

export default async function getGalleriesByDate() {
  await connectDB();

  const recentGalleryDocs = await Gallery.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return JSON.parse(JSON.stringify(recentGalleryDocs));
}

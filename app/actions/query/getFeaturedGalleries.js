"use server";

import connectDB from "@/config/database";
import Gallery from "@/models/Gallery";

export default async function getFeaturedGalleries() {
  await connectDB();

  const featuredGalleryDocs = await Gallery.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return JSON.parse(JSON.stringify(featuredGalleryDocs));
}

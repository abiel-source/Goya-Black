"use server";

import connectDB from "@/config/database";
import Crystal from "@/models/Crystal";

export default async function getFeaturedCrystals() {
  await connectDB();

  const featuredCrystalDocs = await Crystal.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const trendingCrystals = JSON.parse(JSON.stringify(featuredCrystalDocs));

  return trendingCrystals;
}

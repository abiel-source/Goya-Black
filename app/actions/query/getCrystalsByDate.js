"use server";

import connectDB from "@/config/database";
import Crystal from "@/models/Crystal";

export default async function getCrystalsByDate() {
  await connectDB();

  const recentCrystalDocs = await Crystal.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const recentCrystals = JSON.parse(JSON.stringify(recentCrystalDocs));

  return recentCrystals;
}

// get crystals that a user created - irrespective of the "saved" entry

"use server";

import connectDB from "@/config/database";
import Crystal from "@/models/Crystal";

export default async function getUserCreatedCrystals(userId) {
  await connectDB();

  const recentCrystalDocs = await Crystal.find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const recentCrystals = JSON.parse(JSON.stringify(recentCrystalDocs));

  return recentCrystals;
}

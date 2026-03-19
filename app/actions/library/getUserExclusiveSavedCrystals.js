// get fragments that a user saved from another user (they saved but NOT created)

"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import Crystal from "@/models/Crystal";

export default async function getUserExclusiveSavedCrystals(userId) {
  await connectDB();

  const userDoc = await User.findById(userId).lean();

  if (!userDoc) {
    throw new Error("User not found");
  }

  const savedCrystalIds = userDoc?.saved?.crystals || [];

  if (!savedCrystalIds.length) {
    return [];
  }

  const recentCrystalDocs = await Crystal.find({
    _id: { $in: savedCrystalIds },
    ownerId: { $ne: userId }, // only crystals created by someone else
  })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  const recentCrystals = JSON.parse(JSON.stringify(recentCrystalDocs));

  return recentCrystals;
}

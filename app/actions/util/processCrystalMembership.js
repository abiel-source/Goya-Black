"use server";

import connectDB from "@/config/database";
import Crystal from "@/models/Crystal";
import mongoose from "mongoose";

export default async function processCrystalMembership(fragmentId, crystalIds) {
  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  for (const crystalId of crystalIds) {
    if (!mongoose.Types.ObjectId.isValid(crystalId)) {
      throw new Error("Crystal ID array contains invalid entry");
    }
  }

  await connectDB();

  const crystals = await Crystal.find({
    _id: { $in: crystalIds },
  })
    .select("_id images")
    .lean();

  const membershipSet = {};

  for (const crystalId of crystalIds) {
    const crystal = crystals.find((c) => c._id.toString() === crystalId);

    membershipSet[crystalId] =
      crystal?.images?.some((id) => id.toString() === fragmentId) ?? false;
  }

  return membershipSet;
}

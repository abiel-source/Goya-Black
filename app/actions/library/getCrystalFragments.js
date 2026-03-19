"use server";

import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";
import Crystal from "@/models/Crystal";
import mongoose from "mongoose";

import { randomBetween } from "@/utils/restructureData";

export default async function getCrystalFragments(crystalId) {
  if (!mongoose.Types.ObjectId.isValid(crystalId)) {
    throw new Error("Invalid Crystal ID");
  }

  await connectDB();

  const crystal = await Crystal.findById(crystalId).select("images").lean();
  if (!crystal) {
    throw new Error("Crystal not found");
  }

  const fragmentIds = crystal.images || [];
  if (fragmentIds.length === 0) {
    return [];
  }

  const fragmentDocs = await Fragment.find({
    _id: { $in: fragmentIds },
  })
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  const fragments = JSON.parse(JSON.stringify(fragmentDocs));

  const augmentedFragments = fragments.map((f) => {
    const w = f?.image?.width;
    const h = f?.image?.height;

    return {
      ...f,
      ratio:
        typeof w === "number" && typeof h === "number" && h > 0
          ? w / h
          : randomBetween(0.75, 1.8),
    };
  });

  return augmentedFragments;
}

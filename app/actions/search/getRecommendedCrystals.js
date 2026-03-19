"use server";

import connectDB from "@/config/database";
import Like from "@/models/Like";
import View from "@/models/View";
import Crystal from "@/models/Crystal";
import Fragment from "@/models/Fragment";
import mongoose from "mongoose";

// SIMPLE TEMPORAL APPROACH
// discover user's most RECENT VIEWED & LIKED fragments
// discover which crystals, if any, they belong to
// return, at most, the 10 most RECENT associated crystals

export default async function getRecommendedCrystals(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  await connectDB();

  // RECENT VIEWED fragments
  const viewedFragmentDocs = await View.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(25)
    .select("fragmentId -_id")
    .lean();

  const viewedFragmentIDs = viewedFragmentDocs.map((doc) => doc.fragmentId);

  const viewedCrystalDocs = await Crystal.find({
    images: { $in: viewedFragmentIDs },
    isPrivate: false,
  }).lean();

  // RECENT LIKED fragments
  const likedFragmentDocs = await Like.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(25)
    .select("fragmentId -_id")
    .lean();

  const likedFragmentIDs = likedFragmentDocs.map((doc) => doc.fragmentId);

  const likedCrystalDocs = await Crystal.find({
    images: { $in: likedFragmentIDs },
    isPrivate: false,
  }).lean();

  // COMBINE crystals no duplicates
  const combinedCrystals = [...viewedCrystalDocs, ...likedCrystalDocs];

  const crystalMap = new Map();

  for (const crystal of combinedCrystals) {
    const key = crystal._id.toString();

    if (!crystalMap.has(key)) {
      crystalMap.set(key, crystal);
    }
  }

  const recommendedCrystals = Array.from(crystalMap.values()).slice(0, 10);

  const recommendedCrystalsJSON = JSON.parse(
    JSON.stringify(recommendedCrystals)
  );

  // manually augment cover image for each crystal metadata (url)
  const fragmentIds = recommendedCrystalsJSON
    .map((crystal) => crystal?.images?.[0])
    .filter(Boolean); // filter as truthy

  const fragmentDocs = await Fragment.find({
    _id: { $in: fragmentIds },
  })
    .select("_id image.url")
    .lean();

  const fragmentCoverMap = new Map(
    fragmentDocs.map((fragment) => [
      fragment._id.toString(),
      fragment?.image?.url || "",
    ])
  );

  const recommendedCrystalsAugmented = recommendedCrystalsJSON.map(
    (crystal) => {
      const firstFragmentId = crystal?.images?.[0];

      return {
        _id: crystal._id,
        name: crystal.name,

        coverImage: firstFragmentId
          ? fragmentCoverMap.get(firstFragmentId.toString()) || ""
          : "",
      };
    }
  );

  return recommendedCrystalsAugmented;
}

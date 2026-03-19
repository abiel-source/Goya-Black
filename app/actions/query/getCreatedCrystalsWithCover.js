"use server";

// augment cover image field

import connectDB from "@/config/database";
import Crystal from "@/models/Crystal";
import Fragment from "@/models/Fragment";
import mongoose from "mongoose";

export default async function getCreatedCrystalsWithCover(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  await connectDB();

  const createdCrystalDocs = await Crystal.find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .lean();

  const createdCrystalDocsJSON = JSON.parse(JSON.stringify(createdCrystalDocs));

  // manually augment cover image for each crystal metadata (url)
  const fragmentIds = createdCrystalDocsJSON
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

  const createdCrystalsAugmented = createdCrystalDocsJSON.map((crystal) => {
    const firstFragmentId = crystal?.images?.[0];

    return {
      _id: crystal._id,
      name: crystal.name,

      coverImage: firstFragmentId
        ? fragmentCoverMap.get(firstFragmentId.toString()) || ""
        : "",
    };
  });

  return createdCrystalsAugmented;
}

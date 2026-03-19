// get fragments that a user saved from another user (they saved but NOT created)

"use server";

import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";
import User from "@/models/User";

export default async function getUserExclusiveSavedFragments(userId) {
  await connectDB();

  const userDoc = await User.findById(userId).lean();

  if (!userDoc) {
    throw new Error("User not found");
  }

  const savedFragmentIds = userDoc?.saved?.fragments || [];

  if (!savedFragmentIds.length) {
    return [];
  }

  const recentFragmentDocs = await Fragment.find({
    _id: { $in: savedFragmentIds },
    ownerId: { $ne: userId }, // only fragments created by someone else
  })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  const recentFragments = JSON.parse(JSON.stringify(recentFragmentDocs));

  return recentFragments;
}

// get fragments that a user created - irrespective of the "saved" entry

"use server";

import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";

export default async function getUserCreatedFragments(userId) {
  await connectDB();

  const recentFragmentDocs = await Fragment.find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  const recentFragments = JSON.parse(JSON.stringify(recentFragmentDocs));

  return recentFragments;
}

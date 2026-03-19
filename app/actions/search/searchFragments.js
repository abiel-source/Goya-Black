"use server";

import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";

// SIMPLE REGEX APPROACH
// find all fragments that have a regex match with query in any of their:
//  -> fragment name
//  -> description
//  -> tags

export default async function searchFragments(query) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return [];
  }

  await connectDB();

  const fragmentDocs = await Fragment.find({
    $or: [
      { name: { $regex: trimmedQuery, $options: "i" } },
      { description: { $regex: trimmedQuery, $options: "i" } },
      { tags: { $regex: trimmedQuery, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  const fragmentDocsJSON = JSON.parse(JSON.stringify(fragmentDocs));

  return fragmentDocsJSON;
}

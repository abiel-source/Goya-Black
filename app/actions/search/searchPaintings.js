"use server";

import connectDB from "@/config/database";
import Painting from "@/models/Painting";

export default async function searchPaintings(query) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return [];
  }

  await connectDB();

  const paintingDocs = await Painting.find({
    $or: [
      { title: { $regex: trimmedQuery, $options: "i" } },
      { description: { $regex: trimmedQuery, $options: "i" } },
      { tags: { $regex: trimmedQuery, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(paintingDocs));
}

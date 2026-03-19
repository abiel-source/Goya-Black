"use server";

import connectDB from "@/config/database";
import Query from "@/models/Query";

// APPROACH
// simple regex scan over current historical queries database

export default async function getQueryPredictions(query) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return [];
  }

  await connectDB();

  const predictions = await Query.find({
    text: { $regex: trimmedQuery, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("text -_id")
    .lean();

  return predictions.map((doc) => doc.text);
  // return predictions;
}

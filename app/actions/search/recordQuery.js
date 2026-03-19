"use server";

import connectDB from "@/config/database";
import Query from "@/models/Query";
import mongoose from "mongoose";

export default async function recordQuery(userId, query) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  if (!query?.trim()) {
    return;
  }

  await connectDB();

  const text = query.trim().toLowerCase();

  await Query.findOneAndUpdate(
    { userId, text },
    {
      $inc: { count: 1 },
      $setOnInsert: { userId, text },
    },
    { upsert: true, new: true }
  );
}

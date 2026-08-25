"use server";

import connectDB from "@/config/database";
import Painting from "@/models/Painting";
import mongoose from "mongoose";

export default async function getPainting(paintingId) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(paintingId)) throw new Error("Invalid painting ID");

  const painting = await Painting.findById(paintingId)
    .populate("artistId", "name slug nationality birthYear deathYear portraitImage")
    .populate("movementId", "name slug period")
    .lean();

  if (!painting) throw new Error("Painting not found");

  return JSON.parse(JSON.stringify(painting));
}

"use server";

import connectDB from "@/config/database";
import Movement from "@/models/Movement";
import mongoose from "mongoose";

export default async function getMovement(movementId) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(movementId)) throw new Error("Invalid movement ID");

  const movement = await Movement.findById(movementId)
    .populate("keyArtists", "name slug nationality portraitImage")
    .populate("coverPainting", "title image year")
    .lean();

  if (!movement) throw new Error("Movement not found");

  return JSON.parse(JSON.stringify(movement));
}

"use server";

import connectDB from "@/config/database";
import Artist from "@/models/Artist";
import mongoose from "mongoose";

export default async function getArtist(artistId) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(artistId)) throw new Error("Invalid artist ID");

  const artist = await Artist.findById(artistId)
    .populate("movement", "name slug period")
    .populate("notableWorks", "title image year")
    .lean();

  if (!artist) throw new Error("Artist not found");

  return JSON.parse(JSON.stringify(artist));
}

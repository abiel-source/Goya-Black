"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import Artist from "@/models/Artist";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function toggleStarArtist(artistId) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(artistId)) throw new Error("Invalid artist ID");

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const { userId } = sessionUser;

  const artist = await Artist.findById(artistId).select("_id starCount");
  if (!artist) throw new Error("Artist not found");

  const user = await User.findById(userId).select("starredArtists");
  if (!user) throw new Error("User not found");

  const isStarred = user.starredArtists.some((id) => id.toString() === artistId.toString());

  if (isStarred) {
    user.starredArtists.pull(artistId);
    artist.starCount = Math.max(0, (artist.starCount ?? 0) - 1);
  } else {
    user.starredArtists.push(artistId);
    artist.starCount = (artist.starCount ?? 0) + 1;
  }

  await Promise.all([user.save(), artist.save()]);

  return { isStarred: !isStarred, starCount: artist.starCount };
}

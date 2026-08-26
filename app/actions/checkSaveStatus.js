"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function checkSaveStatus(paintingId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  // retrieve session user
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User must be authenticated");
  }
  const { userId } = sessionUser;

  const user = await User.findById(userId).select("saved.paintings");
  if (!user) {
    throw new Error("User not found");
  }

  const isSaved = user.saved.paintings.some((id) => id.toString() === paintingId.toString());
  return { isSaved };
}

export default checkSaveStatus;

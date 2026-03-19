"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function checkSaveStatus(fragmentId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  // retrieve session user
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User must be authenticated");
  }
  const { userId } = sessionUser;

  // retrieve user from db
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // initialize saved fragments if not defined
  if (!user.saved) user.saved = { crystals: [], fragments: [] };
  if (!user.saved.fragments) user.saved.fragments = [];

  const isSaved = user.saved.fragments.includes(fragmentId);
  return { isSaved };
}

export default checkSaveStatus;

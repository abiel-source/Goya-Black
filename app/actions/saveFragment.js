"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose, { connect } from "mongoose";
import { revalidatePath } from "next/cache";

// assume fragmentId is an object ID
async function saveFragment(fragmentId) {
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

  // initialize saved fragments if none
  if (!user.saved) user.saved = { crystals: [], fragments: [] };
  if (!user.saved.fragments) user.saved.fragments = [];

  // update db based on current saved state
  let isSaved = user.saved.fragments.includes(fragmentId);
  let message;
  if (isSaved) {
    user.saved.fragments.pull(fragmentId);
    message = "Fragment Unsaved";
    isSaved = false;
  } else {
    user.saved.fragments.push(fragmentId);
    message = "Fragment Saved";
    isSaved = true;
  }

  await user.save();
  revalidatePath("/", "page"); // might be layout??

  return {
    message,
    isSaved,
  };
}

export default saveFragment;

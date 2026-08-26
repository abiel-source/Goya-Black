"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

async function savePainting(paintingId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User must be authenticated");
  }
  const { userId } = sessionUser;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  let isSaved = user.saved.paintings.some((id) => id.toString() === paintingId.toString());
  let message;
  if (isSaved) {
    user.saved.paintings.pull(paintingId);
    message = "Painting Unsaved";
    isSaved = false;
  } else {
    user.saved.paintings.push(paintingId);
    message = "Painting Saved";
    isSaved = true;
  }

  await user.save();
  revalidatePath("/", "page");

  return { message, isSaved };
}

export default savePainting;

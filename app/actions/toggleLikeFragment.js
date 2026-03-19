"use server";

import connectDB from "@/config/database";
import Like from "@/models/Like";
import Fragment from "@/models/Fragment";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function toggleLikeFragment(fragmentId) {
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

  try {
    // create Like entry and update corresponding Fragmenent like field
    await Like.create({ userId, fragmentId });

    const updated = await Fragment.findByIdAndUpdate(
      fragmentId,
      { $inc: { likes: 1 } },
      { new: true, select: "likes" }
    );
    if (!updated) throw new Error("Fragment not found");

    return { isLiked: true, likeCount: updated.likes };
  } catch (e) {
    if (e?.code !== 11000) throw e;

    // Duplicate --> remove Like pair
    await Like.deleteOne({ userId, fragmentId });

    const updated = await Fragment.findByIdAndUpdate(
      fragmentId,
      { $inc: { likes: -1 } },
      { new: true, select: "likes" }
    );
    if (!updated) throw new Error("Fragment not found");

    return { isLiked: false, likeCount: updated.likes };
  }
}

export default toggleLikeFragment;

"use server";

import connectDB from "@/config/database";
import Like from "@/models/Like";
import Painting from "@/models/Painting";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function toggleLikePainting(paintingId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid Painting ID");
  }

  // retrieve session user
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User must be authenticated");
  }
  const { userId } = sessionUser;

  try {
    // create Like entry and update corresponding Fragmenent like field
    await Like.create({ userId, paintingId: paintingId });

    const updated = await Painting.findByIdAndUpdate(
      paintingId,
      { $inc: { likes: 1 } },
      { new: true, select: "likes" }
    );
    if (!updated) throw new Error("Painting not found");

    return { isLiked: true, likeCount: updated.likes };
  } catch (e) {
    if (e?.code !== 11000) throw e;

    // Duplicate --> remove Like pair
    await Like.deleteOne({ userId, paintingId });

    const updated = await Painting.findByIdAndUpdate(
      paintingId,
      { $inc: { likes: -1 } },
      { new: true, select: "likes" }
    );
    if (!updated) throw new Error("Painting not found");

    return { isLiked: false, likeCount: updated.likes };
  }
}

export default toggleLikePainting;

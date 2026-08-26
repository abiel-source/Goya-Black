"use server";

import connectDB from "@/config/database";
import View from "@/models/View";
import Painting from "@/models/Painting";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function viewPainting(paintingId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    throw new Error("User must be authenticated");
  }
  const userId = sessionUser.userId;

  try {
    await View.create({ userId, paintingId });

    const updated = await Painting.findByIdAndUpdate(
      paintingId,
      { $inc: { views: 1 } },
      { new: true, select: "views" }
    );

    if (!updated) throw new Error("Painting not found");

    return { isViewed: true, viewCount: updated.views ?? 0 };
  } catch (e) {
    if (e?.code !== 11000) throw e;

    await View.updateOne(
      { userId, paintingId },
      {
        $set: { lastViewedAt: new Date() },
        $inc: { viewCount: 1 },
      }
    );

    const painting = await Painting.findById(paintingId).select("views");
    if (!painting) throw new Error("Painting not found");

    return { isViewed: false, viewCount: painting.views ?? 0 };
  }
}

export default viewPainting;

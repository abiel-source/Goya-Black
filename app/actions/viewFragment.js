"use server";

import connectDB from "@/config/database";
import View from "@/models/View";
import Fragment from "@/models/Fragment";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function viewFragment(fragmentId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    throw new Error("User must be authenticated");
  }
  const userId = sessionUser.userId;

  try {
    await View.create({ userId, fragmentId });

    const updated = await Fragment.findByIdAndUpdate(
      fragmentId,
      { $inc: { views: 1 } },
      { new: true, select: "views" }
    );

    if (!updated) throw new Error("Fragment not found");

    return { isViewed: true, viewCount: updated.views ?? 0 };
  } catch (e) {
    if (e?.code !== 11000) throw e;

    await View.updateOne(
      { userId, fragmentId },
      {
        $set: { lastViewedAt: new Date() },
        $inc: { viewCount: 1 },
      }
    );

    const fragment = await Fragment.findById(fragmentId).select("views");
    if (!fragment) throw new Error("Fragment not found");

    return { isViewed: false, viewCount: fragment.views ?? 0 };
  }
}

export default viewFragment;

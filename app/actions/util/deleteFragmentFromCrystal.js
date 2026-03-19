"use server";

import connectDB from "@/config/database";
import Crystal from "@/models/Crystal";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export default async function deleteFragmentFromCrystal({
  fragmentId,
  crystalId,
}) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    throw new Error("User must be authenticated");
  }
  const userId = sessionUser.userId;

  if (!mongoose.Types.ObjectId.isValid(crystalId)) {
    throw new Error("Invalid crystal ID");
  }

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  const crystal = await Crystal.findOne(
    { _id: crystalId, ownerId: userId },
    { images: 1 }
  );

  if (!crystal) {
    throw new Error("Crystal not found or unauthorized");
  }

  const existedBefore = crystal.images.some(
    (id) => id.toString() === fragmentId.toString()
  );

  const updated = await Crystal.findByIdAndUpdate(
    crystalId,
    { $pull: { images: fragmentId } },
    { new: true, select: "images" }
  );

  revalidatePath(`/library/${crystalId}`, "page");

  return {
    ok: true,
    removed: existedBefore ? 1 : 0,
    imageCount: updated?.images?.length ?? 0,
  };
}

"use server";

import connectDB from "@/config/database";
import Crystal from "@/models/Crystal";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export default async function addFragmentsToCrystal({
  crystalId,
  fragmentIds,
}) {
  await connectDB();

  // auth
  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    throw new Error("User must be authenticated");
  }
  const userId = sessionUser.userId;

  // validate ids
  if (!mongoose.Types.ObjectId.isValid(crystalId)) {
    throw new Error("Invalid crystal ID");
  }
  if (!Array.isArray(fragmentIds) || fragmentIds.length === 0) {
    return { ok: true, added: 0 }; // nothing to do
  }

  const cleanIds = fragmentIds
    .map((id) => id?.toString?.() ?? id)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (cleanIds.length === 0) return { ok: true, added: 0 };

  // ensure crystal exists + belongs to current user
  const crystal = await Crystal.findOne({ _id: crystalId, ownerId: userId });
  if (!crystal) throw new Error("Crystal not found or unauthorized");

  // add fragments (no duplicates)
  const updated = await Crystal.findByIdAndUpdate(
    crystalId,
    { $addToSet: { images: { $each: cleanIds } } },
    { new: true, select: "images" }
  );

  // Optional: only needed if you rely on cached SSR for /library/[id]
  revalidatePath(`/library/${crystalId}`, "page");

  return {
    ok: true,
    added: cleanIds.length,
    imageCount: updated?.images?.length ?? 0,
  };
}

"use server";

import connectDB from "@/config/database";
import Gallery from "@/models/Gallery";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export default async function addPaintingsToGallery({
  galleryId,
  paintingIds,
}) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    throw new Error("User must be authenticated");
  }
  const userId = sessionUser.userId;

  if (!mongoose.Types.ObjectId.isValid(galleryId)) {
    throw new Error("Invalid gallery ID");
  }
  if (!Array.isArray(paintingIds) || paintingIds.length === 0) {
    return { ok: true, added: 0 };
  }

  const cleanIds = paintingIds
    .map((id) => id?.toString?.() ?? id)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (cleanIds.length === 0) return { ok: true, added: 0 };

  const gallery = await Gallery.findOne({ _id: galleryId, ownerId: userId });
  if (!gallery) throw new Error("Gallery not found or unauthorized");

  const updated = await Gallery.findByIdAndUpdate(
    galleryId,
    { $addToSet: { paintings: { $each: cleanIds } } },
    { new: true, select: "paintings" }
  );

  revalidatePath(`/library/${galleryId}`, "page");

  return {
    ok: true,
    added: cleanIds.length,
    paintingCount: updated?.paintings?.length ?? 0,
  };
}

"use server";

import connectDB from "@/config/database";
import Gallery from "@/models/Gallery";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export default async function removePaintingFromGallery({
  paintingId,
  galleryId,
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

  if (!mongoose.Types.ObjectId.isValid(paintingId)) {
    throw new Error("Invalid painting ID");
  }

  const gallery = await Gallery.findOne(
    { _id: galleryId, ownerId: userId },
    { paintings: 1 }
  );

  if (!gallery) {
    throw new Error("Gallery not found or unauthorized");
  }

  const existedBefore = gallery.paintings.some(
    (id) => id.toString() === paintingId.toString()
  );

  const updated = await Gallery.findByIdAndUpdate(
    galleryId,
    { $pull: { paintings: paintingId } },
    { new: true, select: "paintings" }
  );

  revalidatePath(`/library/${galleryId}`, "page");

  return {
    ok: true,
    removed: existedBefore ? 1 : 0,
    paintingCount: updated?.paintings?.length ?? 0,
  };
}

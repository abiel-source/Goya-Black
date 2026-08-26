"use server";

import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import Gallery from "@/models/Gallery";
import User from "@/models/User";

export default async function deleteGallery({ galleryId }) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  if (!mongoose.Types.ObjectId.isValid(galleryId)) throw new Error("Invalid gallery ID");

  const userId = sessionUser.userId;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const gallery = await Gallery.findById(galleryId).session(session);
    if (!gallery) throw new Error("Gallery not found");
    if (String(gallery.ownerId) !== String(userId)) throw new Error("Unauthorized to delete gallery");

    await User.updateMany(
      { "saved.galleries": galleryId },
      { $pull: { "saved.galleries": galleryId } }
    ).session(session);

    await Gallery.findByIdAndDelete(galleryId).session(session);

    await session.commitTransaction();

    revalidatePath("/library");
    revalidatePath("/");

    return { ok: true };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

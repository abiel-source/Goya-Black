"use server";

import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import cloudinary from "@/config/cloudinary";

// DELETE FRAGMENT CASCADING

// Comment Section:
// Thread --> Fragment
// Comment --> Fragment (and Thread, but Fragment reference is enough)
// CommentLike --> Comment

// Liking a Fragment Post
// Like --> Fragment

// Viewing a Fragment Post
// View --> Fragment

// User
// User.saved.fragments --> Fragment

// Crystal
// Crystal.images --> Fragment

// Fragment itself

import Thread from "@/models/Thread";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";

import Like from "@/models/Like";

import View from "@/models/View";

import User from "@/models/User";

import Crystal from "@/models/Crystal";

import Fragment from "@/models/Fragment";

// sketchy way to extract public ID
// directly store the public ID in the future...
function extractPublicId(url) {
  if (!url) return null;

  try {
    const parts = url.split("/upload/")[1];
    if (!parts) return null;

    const withoutVersion = parts.replace(/^v\d+\//, "");
    const withoutExtension = withoutVersion.replace(/\.[^/.]+$/, "");

    return withoutExtension;
  } catch {
    return null;
  }
}

export default async function deleteFragment({ fragmentId }) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    throw new Error("User must be authenticated");
  }

  if (!mongoose.Types.ObjectId.isValid(fragmentId)) {
    throw new Error("Invalid fragment ID");
  }

  const userId = sessionUser.userId;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const fragment = await Fragment.findById(fragmentId).session(session);

    if (!fragment) {
      throw new Error("Fragment not found");
    }

    if (String(fragment.ownerId) !== String(userId)) {
      throw new Error("Unauthorized to delete fragment");
    }

    // extract crystalclear/<public ID> for cloundinary destroy()
    const imagePublicId = extractPublicId(fragment?.image?.url);

    const comments = await Comment.find({ fragmentId })
      .select("_id")
      .session(session);

    const commentIds = comments.map((c) => c._id);

    await CommentLike.deleteMany({ commentId: { $in: commentIds } }).session(
      session
    );

    await Comment.deleteMany({ fragmentId }).session(session);
    await Thread.deleteMany({ fragmentId }).session(session);

    await Like.deleteMany({ fragmentId }).session(session);
    await View.deleteMany({ fragmentId }).session(session);

    await Crystal.updateMany(
      { images: fragmentId },
      { $pull: { images: fragmentId } }
    ).session(session);

    await User.updateMany(
      { "saved.fragments": fragmentId },
      { $pull: { "saved.fragments": fragmentId } }
    ).session(session);

    await Fragment.findByIdAndDelete(fragmentId).session(session);

    await session.commitTransaction();

    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }
    }

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

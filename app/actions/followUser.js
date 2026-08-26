"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function followUser(targetUserId) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) throw new Error("Invalid user ID");

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const { userId } = sessionUser;

  if (userId.toString() === targetUserId.toString()) throw new Error("Cannot follow yourself");

  const [me, target] = await Promise.all([
    User.findById(userId).select("following"),
    User.findById(targetUserId).select("followers"),
  ]);

  if (!me) throw new Error("User not found");
  if (!target) throw new Error("Target user not found");

  const isFollowing = me.following.some((id) => id.toString() === targetUserId.toString());

  if (isFollowing) {
    me.following.pull(targetUserId);
    target.followers.pull(userId);
  } else {
    me.following.push(targetUserId);
    target.followers.push(userId);
  }

  await Promise.all([me.save(), target.save()]);

  return { isFollowing: !isFollowing };
}

"use server";

import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

function makePairKey(a, b) {
  const [x, y] = [a.toString(), b.toString()].sort();
  return `${x}_${y}`;
}

export default async function getConversationWithUser(otherUserId) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const myId = sessionUser.userId;

  if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
    throw new Error("Invalid user ID");
  }
  if (myId.toString() === otherUserId.toString()) {
    throw new Error("Cannot message yourself");
  }

  const pairKey = makePairKey(myId, otherUserId);

  const convo = await Conversation.findOne({ pairKey }).select("_id").lean();

  return { conversationId: convo?._id?.toString() ?? null };
}

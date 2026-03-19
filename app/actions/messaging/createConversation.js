"use server";

import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

function makePairKey(a, b) {
  const [x, y] = [a.toString(), b.toString()].sort();
  return `${x}_${y}`;
}

export default async function createConversation(otherUserId) {
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

  // Prefer find first (avoid unnecessary create attempt)
  const existing = await Conversation.findOne({ pairKey }).select("_id").lean();
  if (existing) return { conversationId: existing._id.toString() };

  try {
    const created = await Conversation.create({
      participants: [myId, otherUserId],
      pairKey,
      lastMessageAt: null,
      lastMessagePreview: "",
      lastMessageSenderId: null,
      readState: [
        { userId: myId, lastReadAt: null },
        { userId: otherUserId, lastReadAt: null },
      ],
    });

    return { conversationId: created._id.toString() };
  } catch (e) {
    // Race-safe: if duplicate, fetch the existing convo
    if (e?.code === 11000) {
      const convo = await Conversation.findOne({ pairKey })
        .select("_id")
        .lean();
      if (!convo) throw e;
      return { conversationId: convo._id.toString() };
    }
    throw e;
  }
}

"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function getMessages(conversationId, limit = 50) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const myId = sessionUser.userId;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  // ensure user is a participant
  const convo = await Conversation.exists({
    _id: conversationId,
    participants: myId,
  });
  if (!convo) throw new Error("Conversation not found or unauthorized");

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(Number(limit))
    .lean();

  return { messages };
}

"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

export default async function sendMessage(conversationId, text) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const myId = sessionUser.userId;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  const clean = (text || "").toString().trim();
  if (!clean) throw new Error("Message cannot be empty");

  const ok = await Conversation.exists({
    _id: conversationId,
    participants: myId,
  });
  if (!ok) throw new Error("Conversation not found or unauthorized");

  const msg = await Message.create({
    conversationId,
    senderId: myId,
    text: clean,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessageAt: msg.createdAt,
    lastMessagePreview: clean.slice(0, 80),
    lastMessageSenderId: myId,
  });

  return { ok: true, message: msg };
}

"use server";

import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import { getSessionUser } from "@/utils/getSessionUser";

export default async function getConversations() {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const myId = sessionUser.userId;

  const convos = await Conversation.find({ participants: myId })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .populate("participants", "_id username image")
    .select("participants lastMessageAt lastMessagePreview lastMessageSenderId")
    .lean();

  return { conversations: convos };
}

"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export default async function searchUsers(q) {
  await connectDB();

  const query = (q || "").toString().trim();
  if (!query) return { users: [] };

  const sessionUser = await getSessionUser();

  // If unauthenticated, then search users with no restriction
  if (!sessionUser?.userId) {
    const userDocs = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("_id username image")
      .limit(10)
      .lean();

    const users = JSON.parse(JSON.stringify(userDocs));

    return { users };
  }

  // If authenticated, search users that aren't yourself
  const myId = sessionUser.userId;

  const userDocs = await User.find({
    _id: { $ne: myId },
    username: { $regex: query, $options: "i" },
  })
    .select("_id username image")
    .limit(15)
    .lean();

  const users = JSON.parse(JSON.stringify(userDocs));

  return { users };
}

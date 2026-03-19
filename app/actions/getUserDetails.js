"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import mongoose from "mongoose";

async function getUserDetails(userId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // get user name and image
  const user = await User.findById(userId).select("username image");
  if (!user) {
    throw new Error("User not found");
  }

  return {
    username: user.username ?? "Unknown creator",
    image: user.image ?? "",
  };
}

export default getUserDetails;

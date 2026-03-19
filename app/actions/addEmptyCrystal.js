"use server";

import connectDB from "@/config/database";
import Crystal from "@/models/Crystal";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function addEmptyCrystal(formData) {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }
  const { userId } = sessionUser;

  // Core fields
  const name = (formData.get("name") || "").toString().trim();
  if (!name) throw new Error("Crystal name is required");
  const description = (formData.get("description") || "").toString().trim();

  // Privacy Toggle
  const isPrivate = formData.get("isPrivate") === "true";

  // Build new fragment object (match the Mongoose schema)
  const crystalData = {
    name,
    description: description || "",
    ownerId: userId,
    isFeatured: false,
    isPrivate: isPrivate,
    images: [],
  };

  //////////////// Testing ////////////////
  console.log("===== RAW CRYSTAL FORM DATA =====");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  console.log("===== PARSED CRYSTAL =====");
  console.log(crystalData);
  //////////////// Testing ////////////////

  const newCrystal = new Crystal(crystalData);
  await newCrystal.save();

  revalidatePath("/", "page");
  redirect(`/library/${newCrystal._id}?seed=1`);
}

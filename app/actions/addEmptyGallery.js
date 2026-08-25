"use server";

import connectDB from "@/config/database";
import Gallery from "@/models/Gallery";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function addEmptyGallery(formData) {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) throw new Error("User ID is required");
  const { userId } = sessionUser;

  const name = (formData.get("name") || "").toString().trim();
  if (!name) throw new Error("Gallery name is required");
  const description = (formData.get("description") || "").toString().trim();
  const isPrivate = formData.get("isPrivate") === "true";

  const newGallery = new Gallery({
    name,
    description: description || "",
    ownerId: userId,
    isFeatured: false,
    isPrivate,
  });

  await newGallery.save();

  revalidatePath("/", "page");
  redirect(`/library/${newGallery._id}?seed=1`);
}

"use server";

import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

export default async function addFragment(formData) {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }
  const { userId } = sessionUser;

  // Build image data
  const imageFile = formData.get("imageFile");
  if (!imageFile || typeof imageFile.arrayBuffer !== "function") {
    throw new Error("Image file is required");
  }

  const imageBuffer = await imageFile.arrayBuffer();
  const imageArray = Array.from(new Uint8Array(imageBuffer));
  const imageData = Buffer.from(imageArray);
  //   convert to base 64
  const imageBase64 = imageData.toString("base64");
  //   make request to cloudinary
  const mimeType = imageFile.type || "image/png";
  const result = await cloudinary.uploader.upload(
    `data:${mimeType};base64,${imageBase64}`,
    {
      folder: "crystalclear",
    }
  );
  const imgUrl = result.secure_url;
  const imgWidth = result.width;
  const imgHeight = result.height;

  // Core fields
  const name = formData.get("name");
  const description = formData.get("description");

  // Tags (comma separated → array)
  const rawTags = formData.get("tags") || "";
  const tags = rawTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Optional crystal / album
  const crystalId = formData.get("crystalId") || null;

  // Location fields (all optional)
  const street = formData.get("location.street");
  const city = formData.get("location.city");
  const region = formData.get("location.region");
  const country = formData.get("location.country");
  const postalCode = formData.get("location.postalCode");

  // Build location ONLY if something exists
  const hasLocation = street || city || region || country || postalCode;

  const location = hasLocation
    ? {
        street,
        city,
        region,
        country,
        postalCode,
      }
    : undefined;

  // Build new fragment object (match the Mongoose schema)
  const fragmentData = {
    name,
    description: description || undefined,
    tags: tags.length ? tags : undefined,
    ownerId: userId,
    crystalId: crystalId || undefined,
    location,
    isFeatured: false,
    likes: 0,
    views: 0,
    image: {
      url: imgUrl,
      width: imgWidth,
      height: imgHeight,
    },
  };

  //////////////// Testing ////////////////
  console.log("===== RAW FORM DATA =====");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  console.log("===== PARSED FRAGMENT =====");
  console.log(fragmentData);
  //////////////// Testing ////////////////

  const newFragment = new Fragment(fragmentData);
  await newFragment.save();

  revalidatePath("/", "layout");
  redirect(`/fragment/${newFragment._id}`);
}

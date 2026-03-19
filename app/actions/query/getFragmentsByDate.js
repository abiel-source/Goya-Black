// get recent fragments
// restructured & ready to be fed into MasonryGallery.jsx

"use server";

import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";
import { randomBetween } from "@/utils/restructureData";

export default async function getFragmentsByDate() {
  await connectDB();

  const recentFragmentsDocs = await Fragment.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const recentFragments = JSON.parse(JSON.stringify(recentFragmentsDocs));

  const restructuredFragments = recentFragments.map((f) => {
    const w = f?.image?.width;
    const h = f?.image?.height;

    return {
      ...f,
      ratio:
        typeof w === "number" && typeof h === "number" && h > 0
          ? w / h
          : randomBetween(0.75, 1.8),
    };
  });

  console.log("**************************************************");
  console.log(restructuredFragments.length);
  console.log("**************************************************");

  return restructuredFragments;
}

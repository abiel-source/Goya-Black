// get recent fragments
// restructured & ready to be fed into MasonryGallery.jsx

"use server";

import connectDB from "@/config/database";
import Painting from "@/models/Painting";
import { randomBetween } from "@/utils/restructureData";

export default async function getPaintingsByDate() {
  await connectDB();

  const recentPaintingDocs = await Painting.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const recentPaintings = JSON.parse(JSON.stringify(recentPaintingDocs));

  return recentPaintings.map((p) => {
    const w = p?.image?.width;
    const h = p?.image?.height;

    return {
      ...p,
      ratio:
        typeof w === "number" && typeof h === "number" && h > 0
          ? w / h
          : randomBetween(0.75, 1.8),
    };
  });
}

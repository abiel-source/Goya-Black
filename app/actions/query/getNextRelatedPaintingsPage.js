"use server";

import connectDB from "@/config/database";
import Painting from "@/models/Painting";
import { randomBetween } from "@/utils/restructureData";

export default async function getNextRelatedPaintingsPage({
  paintingId,
  cursorCreatedAt = null,
  cursorId = null,
  limit = 20,
} = {}) {
  await connectDB();

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  let query = {
    _id: { $ne: paintingId },
  };

  if (cursorCreatedAt && cursorId) {
    query = {
      ...query,
      $or: [
        { createdAt: { $lt: new Date(cursorCreatedAt) } },
        {
          createdAt: new Date(cursorCreatedAt),
          _id: { $lt: cursorId },
        },
      ],
    };
  }

  const docs = await Painting.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(safeLimit + 1)
    .lean();

  const hasMore = docs.length > safeLimit;
  const pageItems = hasMore ? docs.slice(0, safeLimit) : docs;

  const items = pageItems.map((f) => {
    const w = f?.image?.width;
    const h = f?.image?.height;

    return {
      flag: false,
      painting: {
        ...JSON.parse(JSON.stringify(f)),
        ratio:
          typeof w === "number" && typeof h === "number" && h > 0
            ? w / h
            : randomBetween(0.75, 1.8),
      },
    };
  });

  const lastItem = pageItems[pageItems.length - 1];

  const nextCursor =
    hasMore && lastItem
      ? {
          createdAt: new Date(lastItem.createdAt).toISOString(),
          id: String(lastItem._id),
        }
      : null;

  return {
    items,
    nextCursor,
    hasMore,
  };
}

"use server";

import connectDB from "@/config/database";
import Submission from "@/models/Submission";
import { getSessionUser } from "@/utils/getSessionUser";

export default async function createSubmission(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) throw new Error("User must be authenticated");
  const { userId } = sessionUser;

  const type = formData.get("type");
  if (!["artist", "painting"].includes(type)) throw new Error("Invalid submission type");

  const referenceUrl = (formData.get("referenceUrl") || "").toString().trim();
  const artistName = (formData.get("artistName") || "").toString().trim();
  const paintingTitle = (formData.get("paintingTitle") || "").toString().trim();
  const note = (formData.get("note") || "").toString().trim();

  if (note.length > 1000) throw new Error("Note must be 1000 characters or fewer");

  const submission = new Submission({
    userId,
    type,
    referenceUrl: referenceUrl || undefined,
    artistName: artistName || undefined,
    paintingTitle: paintingTitle || undefined,
    note: note || undefined,
    status: "pending",
  });

  await submission.save();

  return { ok: true, submissionId: submission._id.toString() };
}

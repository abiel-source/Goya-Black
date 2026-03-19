"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import Like from "@/models/Like";
import mongoose from "mongoose";

// APPROACH 1) DEFINE SIMILARITY METRIC & LINEAR SCAN OVER USER DATABASE
// get at most k users "similar" to user associated with userId
// a similarity measure is computed as a weighted sum of intersected likes + views

// S = wL*nL + wV*nV
// where nL or nV = number of common liked or viewed fragments
// and wL or wV = scalar weights of each common like (weighted more) or view (weighted less)

//////////////////////////////////////////////////////////////////////////////////////////

// APPROACH 2) LINEAR SCAN OVER LIKES/VIEWS DATABASE & BUILD ROSTER
// more efficient than approach 1 as we avoid unnecessary metric computations over user db

// build roster of users who liked and/or viewed the same fragments
// for any given fragment:
// like intersection --> +1 score
// saved intersection --> +2 score
// view intersection --> +1/3 score ** NOT CONSIDERING VIEW SCORE FOR NOW **

// sort by score take top k

export default async function getSimilarUsers(userId, k = 5) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  await connectDB();

  const userScores = new Map();

  // LIKE SCORE
  // mutual user gets +1 for every mutually-liked fragment
  const likedFragmentDocs = await Like.find({ userId: userId })
    .select("fragmentId -_id")
    .lean();

  const likedFragmentIDs = likedFragmentDocs.map((doc) => doc.fragmentId);

  const mutualLikeUserDocs = await Like.find({
    fragmentId: { $in: likedFragmentIDs },
    userId: { $ne: userId },
  })
    .select("userId -_id")
    .lean();

  const mutualLikeUserIDs = mutualLikeUserDocs.map((doc) => doc.userId); // preserve duplicates

  for (const mutualUserID of mutualLikeUserIDs) {
    const key = mutualUserID.toString();
    if (userScores.has(key)) {
      userScores.set(key, userScores.get(key) + 1);
    } else {
      userScores.set(key, 1);
    }
  }

  // SAVE SCORE
  // mutual user gets +2 for every mutually-saved fragment
  const userDoc = await User.findById(userId).lean();
  if (!userDoc) {
    throw new Error("User not found");
  }

  const savedFragmentIDs = userDoc?.saved?.fragments || [];

  const mutualSaveUserDocs = await User.find({
    _id: { $ne: userId },
    "saved.fragments": { $in: savedFragmentIDs },
  })
    .select("_id saved.fragments")
    .lean();

  const savedFragmentIdSet = new Set(
    savedFragmentIDs.map((id) => id.toString())
  );

  for (const mutualUserDoc of mutualSaveUserDocs) {
    const mutualUserDocId = mutualUserDoc._id.toString();
    const otherSavedFragmentIDs = mutualUserDoc?.saved?.fragments || [];

    for (const fragmentId of otherSavedFragmentIDs) {
      if (savedFragmentIdSet.has(fragmentId.toString())) {
        userScores.set(
          mutualUserDocId,
          (userScores.get(mutualUserDocId) || 0) + 2
        );
      }
    }
  }

  // return top-k scoring users
  const topUserIds = Array.from(userScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([userId]) => userId);

  if (topUserIds.length === 0) {
    return [];
  }

  const topUserDocs = await User.find({
    _id: { $in: topUserIds },
  })
    .select("_id username image")
    .lean();

  const topUserDocsJSON = JSON.parse(JSON.stringify(topUserDocs));

  return topUserDocsJSON;
}

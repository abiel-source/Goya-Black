import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import { convertToSerializeableObject } from "@/utils/convertToObject";

import Crystal from "@/models/Crystal";
import Fragment from "@/models/Fragment";

import MasonryGallery from "@/components/view/MasonryGallery";
import { randomBetween } from "@/utils/restructureData";

import recordQuery from "@/app/actions/search/recordQuery";
import searchFragments from "@/app/actions/search/searchFragments";

export default async function SearchPage({ searchParams }) {
  await connectDB();

  const sessionUser = await getSessionUser();

  // if (!sessionUser || !sessionUser.userId) {
  //   throw new Error("User ID is required");
  // }
  // const { userId } = sessionUser;

  const params = await searchParams;

  const q = params.q?.trim();
  const crystalId = params.crystal?.trim();
  const crystalLabel = params.label?.trim();

  if (q) {
    if (q.length < 2)
      return <div>No Search Results - Try Something More Specific</div>;

    ////////////////////////////////////////////////////////////
    // Record query iff user is signed in
    ////////////////////////////////////////////////////////////
    if (sessionUser && sessionUser.userId) {
      const { userId } = sessionUser;
      await recordQuery(userId, q);
    }

    const fragments = await searchFragments(q);
    const restructuredFragments = fragments.map((f) => {
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
    return (
      <>
        {fragments.length === 0 ? (
          <h1 className="text-center text-2xl font-bold mt-10">
            No Search Results - Try Something Else!
          </h1>
        ) : (
          <>
            <p className="text-center mt-4">Search Results for "{q}"</p>
            <MasonryGallery key={`q-${q}`} data={restructuredFragments} />
          </>
        )}
      </>
    );
  } else if (crystalId) {
    const crystalDoc = await Crystal.findById(crystalId).lean();
    if (!crystalDoc) {
      return (
        <h1 className="text-center text-2xl font-bold mt-10">
          Crystal Not Found
        </h1>
      );
    }
    const crystal = convertToSerializeableObject(crystalDoc);
    const fragmentIDs = crystal?.images || [];
    if (!fragmentIDs.length) {
      return (
        <h1 className="text-center text-2xl font-bold mt-10">Empty Crystal</h1>
      );
    }
    const fragmentDocs = await Fragment.find({
      _id: { $in: fragmentIDs },
    }).lean();
    const fragments = JSON.parse(JSON.stringify(fragmentDocs));

    const restructuredFragments = fragments.map((f) => {
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
    return (
      <>
        <p className="text-center mt-4">Showing Results for "{crystalLabel}"</p>
        <MasonryGallery
          key={`crystal-${crystalId}`}
          data={restructuredFragments}
        />
      </>
    );
  } else {
    return <div>No Search Results - Try Again</div>;
  }
}

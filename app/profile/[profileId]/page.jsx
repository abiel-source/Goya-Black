import Link from "next/link";
import connectDB from "@/config/database";
import CrystalGrid from "@/components/view/CrystalGrid";
import MasonryGalleryNoHover from "@/components/view/MasonryGalleryNoHover";
import { randomBetween } from "@/utils/restructureData";

import User from "@/models/User";

import getUserCreatedCrystals from "@/app/actions/library/getUserCreatedCrystals";
import getUserCreatedFragments from "@/app/actions/library/getUserCreatedFragments";
import getUserExclusiveSavedCrystals from "@/app/actions/library/getUserExclusiveSavedCrystals";
import getUserExclusiveSavedFragments from "@/app/actions/library/getUserExclusiveSavedFragments";

const ProfilePage = async ({ params, searchParams }) => {
  const { profileId } = await params;
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab === "saved" ? "saved" : "created";

  await connectDB();

  // Load profile meta data
  const userDoc = await User.findById(profileId)
    .select("username image email")
    .lean();
  const user = JSON.parse(JSON.stringify(userDoc));

  // Load Content
  const createdCrystals = await getUserCreatedCrystals(profileId);
  const savedCrystals = await getUserExclusiveSavedCrystals(profileId);

  const createdFragments = await getUserCreatedFragments(profileId);
  const savedFragments = await getUserExclusiveSavedFragments(profileId);

  const restructuredCreatedFragments = createdFragments.map((f) => {
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

  const restructuredSavedFragments = savedFragments.map((f) => {
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
    <div className="px-4 py-8">
      <h1 className="text-center text-2xl font-bold mb-6">{user.username}</h1>

      <div className="mx-auto mb-8 flex w-fit rounded-xl border border-[#5D3FD3] bg-white/5">
        <Link
          href={`/profile/${profileId}?tab=created`}
          className={`rounded-lg px-4 py-2 text-sm transition ${
            tab === "created" ? "bg-[#5D3FD3] text-white" : "text-white"
          }`}
        >
          Created
        </Link>

        <Link
          href={`/profile/${profileId}?tab=saved`}
          className={`rounded-lg px-6 py-2 text-sm transition ${
            tab === "saved" ? "bg-[#5D3FD3] text-white" : "text-white"
          }`}
        >
          Saved
        </Link>
      </div>

      {tab === "created" ? (
        <>
          <h2 className="text-center font-bold mt-4">Created Crystals</h2>
          {createdCrystals.length === 0 ? (
            <p className="text-center mt-4">No created crystals to show</p>
          ) : (
            <CrystalGrid data={createdCrystals} />
          )}

          <h2 className="text-center font-bold mt-10">Created Fragments</h2>
          {restructuredCreatedFragments.length === 0 ? (
            <p className="text-center mt-4">No created fragments to show</p>
          ) : (
            <MasonryGalleryNoHover data={restructuredCreatedFragments} />
          )}
        </>
      ) : (
        <>
          {/* <h2 className="text-center font-bold mt-4">Saved Crystals</h2>
          {savedCrystals.length === 0 ? (
            <p className="text-center mt-4">No saved crystals to show</p>
          ) : (
            <CrystalGrid data={savedCrystals} />
          )} */}

          <h2 className="text-center font-bold mt-10">Saved Fragments</h2>
          {restructuredSavedFragments.length === 0 ? (
            <p className="text-center mt-4">No saved fragments to show</p>
          ) : (
            <MasonryGalleryNoHover data={restructuredSavedFragments} />
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;

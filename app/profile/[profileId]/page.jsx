import Link from "next/link";
import connectDB from "@/config/database";
import CrystalGrid from "@/components/view/CrystalGrid";
import MasonryGalleryNoHover from "@/components/view/MasonryGalleryNoHover";

import User from "@/models/User";

import getUserCreatedGalleries from "@/app/actions/library/getUserCreatedGalleries";
import getUserExclusiveSavedGalleries from "@/app/actions/library/getUserExclusiveSavedGalleries";
import getUserSavedPaintings from "@/app/actions/library/getUserSavedPaintings";

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
  const createdGalleries = await getUserCreatedGalleries(profileId);
  const savedGalleries = await getUserExclusiveSavedGalleries(profileId);
  const savedPaintings = await getUserSavedPaintings(profileId);

  return (
    <div className="px-4 py-8">
      <h1 className="text-center text-2xl font-bold mb-6">{user.username}</h1>

      <div className="mx-auto mb-8 flex w-fit rounded-xl border border-[#E5E7EB] bg-white">
        <Link
          href={`/profile/${profileId}?tab=created`}
          className={`rounded-lg px-4 py-2 text-sm transition ${
            tab === "created" ? "bg-[#722F37] text-white" : "text-zinc-500 hover:text-[#722F37]"
          }`}
        >
          Created
        </Link>

        <Link
          href={`/profile/${profileId}?tab=saved`}
          className={`rounded-lg px-6 py-2 text-sm transition ${
            tab === "saved" ? "bg-[#722F37] text-white" : "text-zinc-500 hover:text-[#722F37]"
          }`}
        >
          Saved
        </Link>
      </div>

      {tab === "created" ? (
        <>
          <h2 className="text-center font-bold mt-4">Galleries</h2>
          {createdGalleries.length === 0 ? (
            <p className="text-center mt-4">No galleries created yet</p>
          ) : (
            <CrystalGrid data={createdGalleries} />
          )}
        </>
      ) : (
        <>
          <h2 className="text-center font-bold mt-4">Saved Galleries</h2>
          {savedGalleries.length === 0 ? (
            <p className="text-center mt-4">No saved galleries to show</p>
          ) : (
            <CrystalGrid data={savedGalleries} />
          )}

          <h2 className="text-center font-bold mt-10">Saved Paintings</h2>
          {savedPaintings.length === 0 ? (
            <p className="text-center mt-4">No saved paintings to show</p>
          ) : (
            <MasonryGalleryNoHover data={savedPaintings} />
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;

import Link from "next/link";
import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";

import User from "@/models/User";

import CrystalGrid from "@/components/view/CrystalGrid";
import MasonryGalleryNoHover from "@/components/view/MasonryGalleryNoHover";

import getUserCreatedGalleries from "@/app/actions/library/getUserCreatedGalleries";
import getUserExclusiveSavedGalleries from "@/app/actions/library/getUserExclusiveSavedGalleries";
import getUserSavedPaintings from "@/app/actions/library/getUserSavedPaintings";

import CollapsibleSection from "@/components/view/CollapsibleSection";

const LibraryPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab === "saved" ? "saved" : "created";

  await connectDB();

  // load profile
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    // throw new Error("User ID is required");
    return (
      <div className="px-4 py-8">
        <h1 className="text-center text-2xl font-bold mt-10 mb-10">
          Sign In to Create & Manage your own Crystal Collection
        </h1>

        <CollapsibleSection
          isInitiallyOpen={true}
          headerText="Benefits of Having Your Own Account:"
        >
          <p className="mt-4 p-2 text-center">
            Create & Manage your own Fragments & Crystals Collection
          </p>
          <p className="mt-1 p-2 text-center">Unlock Full Search Features</p>
          <p className="mt-1 p-2 text-center">
            Participate in Any Comment Section
          </p>
          <p className="mt-1 p-2 text-center">Be Able to Message Other Users</p>
          <p className="mt-1 p-2 text-center">
            Gain Access to Personalized & Recommended Content Tailored to You!
          </p>
        </CollapsibleSection>

        <CollapsibleSection
          isInitiallyOpen={false}
          headerText="How to Create an Account?"
        >
          <p className="mt-4 p-2 text-center">
            Creating an account is made easy and secure via Google
            Authentication. Click the Sign In button at the top-right to connect
            your Google account to the application. Once authenticated, you gain
            full feature access in minutes.
          </p>
        </CollapsibleSection>

        <CollapsibleSection
          isInitiallyOpen={false}
          headerText="Why do we Require Registration for Full Feature Access?"
        >
          <p className="mt-4 p-2 text-center">
            We require account registration for full feature access in order to
            prevent server overload from illegitimate users. We reserve our most
            expensive (backend) operations for good-spirited users like
            yourself.
          </p>
        </CollapsibleSection>
      </div>
    );
  }
  const { userId } = sessionUser;

  const userDoc = await User.findById(userId)
    .select("username image email")
    .lean();
  const user = JSON.parse(JSON.stringify(userDoc));

  // load data
  const createdGalleries = await getUserCreatedGalleries(userId);
  const savedGalleries = await getUserExclusiveSavedGalleries(userId);
  const savedPaintings = await getUserSavedPaintings(userId);

  return (
    <div className="px-4 py-8">
      <h1 className="text-center text-3xl font-bold mt-10 mb-10">
        Your Library
      </h1>

      {/* Switch between Created & Saved */}
      <div className="mx-auto mb-8 flex w-fit rounded-xl border border-[#E5E7EB] bg-white">
        <Link
          href={`/library?tab=created`}
          className={`rounded-lg px-4 py-2 text-sm transition ${
            tab === "created" ? "bg-[#722F37] text-white" : "text-zinc-500 hover:text-[#722F37]"
          }`}
        >
          Created
        </Link>

        <Link
          href={`/library?tab=saved`}
          className={`rounded-lg px-6 py-2 text-sm transition ${
            tab === "saved" ? "bg-[#722F37] text-white" : "text-zinc-500 hover:text-[#722F37]"
          }`}
        >
          Saved
        </Link>
      </div>

      {tab === "created" ? (
        <>
          <h2 className="text-center font-bold mt-4">My Galleries</h2>
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

export default LibraryPage;

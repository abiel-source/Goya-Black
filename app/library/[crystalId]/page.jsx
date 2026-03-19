import connectDB from "@/config/database";

import Crystal from "@/models/Crystal";
import Fragment from "@/models/Fragment";

import LibraryCrystalMasonryGallery from "@/components/view/LibraryCrystalMasonryGallery";
import SeedCrystalModal from "@/app/library/[crystalId]/SeedCrystalModal";

export default async function CrystalLibraryPage({ params, searchParams }) {
  const { crystalId } = await params;
  const seed = searchParams?.seed === "1";

  await connectDB();

  const crystal = await Crystal.findById(crystalId)
    .populate("images", "image name likes views")
    .lean();
  if (!crystal) {
    return <div className="p-6 text-white">Crystal not found</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-6">
      {/* Header */}
      {/* <div className="rounded-2xl border border-white/10 bg-black p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold text-white">
              {crystal.name}
            </div>
            {crystal.description ? (
              <div className="mt-2 text-sm text-white/70">
                {crystal.description}
              </div>
            ) : (
              <div className="mt-2 text-sm text-white/50">No description.</div>
            )}
          </div>

          <SeedCrystalModal
            crystalId={crystalId}
            openOnLoad={seed || (crystal.images?.length ?? 0) === 0}
          />
        </div>
      </div> */}

      {/* Content */}
      <LibraryCrystalMasonryGallery
        crystalId={crystalId}
        seed={seed}
        crystal={crystal}
      />
    </div>
  );
}

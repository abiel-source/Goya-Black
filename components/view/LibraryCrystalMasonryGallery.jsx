"use client";

import { useEffect, useState } from "react";
import { Masonry } from "masonic";
import LibraryFragmentCard from "@/components/view/LibraryFragmentCard";

import getCrystalFragments from "@/app/actions/library/getGalleryPaintings";
import SeedCrystalModal from "@/app/library/[crystalId]/SeedCrystalModal";

import { Suspense } from "react"; // production build error

const LibraryCrystalMasonryGallery = ({ crystalId, seed, crystal }) => {
  const columnWidth = 197;
  const columnGutter = 16;

  const [fragments, setFragments] = useState([]);
  const [fragmentsLoading, setFragmentsLoading] = useState(false);
  const [fragmentsUpdateLoading, setFragmentsUpdateLoading] = useState(false);

  // initial fragments
  useEffect(() => {
    (async () => {
      try {
        setFragmentsLoading(true);
        const fragmentsRes = await getCrystalFragments(crystalId);
        setFragments(fragmentsRes);
      } catch (e) {
        console.error("Failed to load fragments", e);
        toast.error(e?.message || "Failed to load fragments");
        setFragments([]);
      } finally {
        setFragmentsLoading(false);
      }
    })();
  }, [crystalId]);

  // removed --> update local state only
  const handleFragmentRemoved = (fragmentId) => {
    setFragments((prev) => prev.filter((f) => f._id !== fragmentId));
  };

  // added --> refetch from server again
  const handleFragmentsAdded = async () => {
    try {
      setFragmentsUpdateLoading(true);
      const fragmentsRes = await getCrystalFragments(crystalId);
      setFragments(fragmentsRes);
    } catch (e) {
      console.error("Failed to refresh fragments after add", e);
      toast.error(e?.message || "Failed to refresh fragments");
    } finally {
      setFragmentsUpdateLoading(false);
    }
  };

  return (
    <>
      {/* header */}
      <div className="rounded-2xl border border-white/10 bg-black p-5">
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

          {/* should in principal check emptiness of local state not fetched server state */}
          {/* but some kind of cache update is occurring somehow when crystal becomes empty */}
          {/* OK works for now - but its worth connecting to local state */}
          {fragmentsLoading ? (
            <button
              type="button"
              disabled={true}
              onClick={() => {}}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "#722F37" }}
            >
              Add images
            </button>
          ) : (
            // production build error fix
            <Suspense fallback={null}>
              <SeedCrystalModal
                crystalId={crystalId}
                openOnLoad={seed || (crystal.images?.length ?? 0) === 0}
                onFragmentsAdded={handleFragmentsAdded}
                crystalFragmentIds={fragments.map((f) => f._id)}
                fragmentsUpdateLoading={fragmentsUpdateLoading}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* gallery */}
      <div className="p-2">
        {fragmentsLoading ? (
          <div className="mb-3 text-sm text-white/80">Loading fragments...</div>
        ) : (
          <>
            <div className="mb-3 text-sm text-white/80">
              Fragments ({fragments.length})
            </div>

            {/* Masonry cannot handle data mutation dynamically */}
            {/* deleting a fragment induces an index error since Masonry manages its own cache */}

            {/* workaround is to force Masonry to remount by giving it a key */}
            {/* which uniquely identifies the fragment set state... */}
            {/* i.e., when a fragment is removed from state, then the key changes */}
            {/* and then Masonry must remount by difference in key */}

            {/* this avoids a full router refresh */}
            {/* but our key is quite expensive - concatenation of all fragment ids */}

            {/* works for now, but find a shorter key later */}
            <Masonry
              key={fragments.map((f) => f._id).join(",")}
              items={fragments}
              columnGutter={columnGutter}
              columnWidth={columnWidth}
              overscanBy={6}
              render={(props) => (
                <LibraryFragmentCard
                  {...props}
                  handleFragmentRemoved={handleFragmentRemoved}
                />
              )}
            />
          </>
        )}
      </div>
    </>
  );
};

export default LibraryCrystalMasonryGallery;

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";

import getCreatedCrystalsWithCover from "@/app/actions/query/getCreatedCrystalsWithCover";
import processCrystalMembership from "@/app/actions/util/processCrystalMembership";

import addFragmentsToCrystal from "@/app/actions/create/addFragmentsToCrystal";
import deleteFragmentFromCrystal from "@/app/actions/util/deleteFragmentFromCrystal";

const AddToCrystalPanel = ({ fragmentId, onClose }) => {
  const { data: session, status } = useSession();
  const myId = session?.user?.id;

  const [createdCrystals, setCreatedCrystals] = useState([]);
  const [loadingCreatedCrystals, setLoadingCreatedCrystals] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [membership, setMembership] = useState({});
  const [membershipLoading, setMembershipLoading] = useState(false);

  // 1) load user created crystals with augmented coverImage field
  useEffect(() => {
    (async () => {
      if (!myId) return;

      try {
        setLoadingCreatedCrystals(true);
        const createdCrystals = await getCreatedCrystalsWithCover(myId);
        setCreatedCrystals(createdCrystals);
        setLoadingCreatedCrystals(false);
      } catch (e) {
        console.error("Failed to load user created crystals", e);
        toast.error(e?.message || "Failed to load user created crystals");
        setCreatedCrystals([]);
        setLoadingCreatedCrystals(false);
      } finally {
        setLoadingCreatedCrystals(false);
      }
    })();
  }, [myId]);

  // 2) decide given fragment membership of all loaded crystals
  useEffect(() => {
    if (!fragmentId || createdCrystals.length === 0) {
      setMembership({});
      return;
    }

    (async () => {
      try {
        setMembershipLoading(true);
        const createdCrystalIds = createdCrystals.map((crystal) => crystal._id);
        const res = await processCrystalMembership(
          fragmentId,
          createdCrystalIds
        );
        setMembership(res);
        setMembershipLoading(false);
      } catch (e) {
        console.error("Failed to process fragment-to-crystal membership", e);
        toast.error(
          e?.message || "Failed to process fragment-to-crystal membership"
        );
        setMembership({});
        setMembershipLoading(false);
      } finally {
        setMembershipLoading(false);
      }
    })();
  }, [fragmentId, createdCrystals]);

  const handleCrystalAdd = async (crystalId) => {
    setSaving(true);

    try {
      await addFragmentsToCrystal({ crystalId, fragmentIds: [fragmentId] });
      toast.success("Added to crystal");
      onClose();
    } catch (e) {
      console.error("Failed to add fragment to crystal", e);
      toast.error(e?.message || "Failed to add fragment to crystal");
    } finally {
      setSaving(false);
    }
  };

  const handleCrystalDelete = async (crystalId) => {
    setDeleting(true);

    try {
      await deleteFragmentFromCrystal({ fragmentId, crystalId });
      toast.success("Deleted from crystal");
      onClose();
    } catch (e) {
      console.error("Failed to delete fragment from crystal", e);
      toast.error(e?.message || "Failed to delete fragment from crystal");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="p-4 overflow-y-auto">
      {loadingCreatedCrystals || membershipLoading ? (
        <div className="text-zinc-400 text-sm">Loading Your Crystals...</div>
      ) : (
        <>
          {createdCrystals.length === 0 ? (
            <div className="flex flex-1 flex-col justify-center items-center">
              <div className="text-[#111111] text-center mt-4">
                No created crystals yet.
              </div>
              {myId ? (
                <div className="text-zinc-500 text-center mt-4">
                  Create your first crystal now!
                </div>
              ) : (
                <div className="text-zinc-500 text-center mt-4">
                  Sign in to create your first crystal now!
                </div>
              )}
              <div className="flex justify-center mt-8">
                <Image src="/Crystal.svg" alt="Crystal Image" width={128} height={128} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {createdCrystals.map((crystal) => (
                <button
                  type="button"
                  disabled={saving || deleting}
                  onClick={
                    membership[crystal._id]
                      ? () => handleCrystalDelete(crystal._id)
                      : () => handleCrystalAdd(crystal._id)
                  }
                  key={crystal._id}
                  className="flex flex-row items-center gap-2 w-full rounded-lg px-2 py-1.5 hover:bg-zinc-50 transition-colors duration-150 disabled:opacity-50"
                >
                  {crystal.coverImage ? (
                    <Image className="h-12 w-12 rounded-xl" src={crystal.coverImage} alt="" width={28} height={28} />
                  ) : (
                    <Image className="h-12 w-12 rounded-xl" src="/Crystal.svg" alt="Crystal Image" width={28} height={28} />
                  )}

                  <div className="flex-1 text-left text-sm text-[#111111]">
                    {crystal.name || "Untitled Crystal"}
                  </div>

                  {membership[crystal._id] ? (
                    <BookmarkIconSolid className="h-4 w-4 text-[#2D6A4F]" />
                  ) : (
                    <BookmarkIcon className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AddToCrystalPanel;

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import deleteFragmentFromCrystal from "@/app/actions/util/removePaintingFromGallery";

const RemoveFromCrystalPanel = ({
  fragmentId,
  crystalId,
  onClose,
  onRemove,
}) => {
  const { data: session, status } = useSession();
  const myId = session?.user?.id;

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteFragmentFromCrystal({ fragmentId, crystalId });
      toast.success("Deleted from crystal");
      onRemove?.(fragmentId);
      onClose();
    } catch (e) {
      console.error("Failed to delete fragment from crystal", e);
      toast.error(e?.message || "Failed to delete fragment from crystal");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="p-4 flex justify-between">
      <button
        onClick={() => handleDelete()}
        type="button"
        disabled={deleting}
        className="
            flex
            gap-1.5
            px-2
            py-2
            text-xs
            font-medium
            text-white
            rounded-md
            disabled:opacity-50"
        style={{ backgroundColor: "#B30000" }}
        aria-label="Confirm Removal from Crystal"
        title="Confirm Removal from Crystal"
      >
        <span>Remove</span>
      </button>

      <button
        onClick={() => onClose()}
        type="button"
        disabled={deleting}
        className="
            flex
            gap-1.5
            px-2
            py-2
            text-xs
            font-medium
            text-white
            rounded-md
            disabled:opacity-50"
        style={{ backgroundColor: "#6B7280" }}
        aria-label="Confirm Removal from Crystal"
        title="Confirm Removal from Crystal"
      >
        <span>Cancel</span>
      </button>
    </section>
  );
};

export default RemoveFromCrystalPanel;

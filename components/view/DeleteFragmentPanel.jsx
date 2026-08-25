"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import deleteFragmentFromCrystal from "@/app/actions/util/deleteFragmentFromCrystal";
import deleteFragment from "@/app/actions/util/deleteFragment";

const DeleteFragmentPanel = ({ fragmentId, crystalId, onClose, onDelete }) => {
  const { data: session, status } = useSession();
  const myId = session?.user?.id;

  const [deleting, setDeleting] = useState(false);

  // SERVER SIDE DELETION!!
  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteFragment({ fragmentId });
      toast.success("Fragment Deleted");
      onDelete?.(fragmentId);
      onClose();
    } catch (e) {
      console.error("Failed to delete fragment", e);
      toast.error(e?.message || "Failed to delete fragment");
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
        aria-label="Confirm Delete Fragment"
        title="Confirm Delete Fragment"
      >
        <span>Delete</span>
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
        aria-label="Cancel Delete Fragment"
        title="Cancel Delete Fragment"
      >
        <span>Cancel</span>
      </button>
    </section>
  );
};

export default DeleteFragmentPanel;

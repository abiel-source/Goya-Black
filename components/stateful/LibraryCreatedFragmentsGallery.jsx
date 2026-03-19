"use client";

// no server action required to fetch data...
// library page fetches data and passes it here - just manage handle deletion
// which only concerns itself with deleting from the local state

import { useState } from "react";
import { Masonry } from "masonic";

import { toast } from "react-toastify";

import LibraryCreatedFragmentCard from "@/components/stateful/LibraryCreatedFragmentCard";

const LibraryCreatedFragmentsGallery = ({
  initialRestructuredCreatedFragments = [],
}) => {
  const columnWidth = 197;
  const columnGutter = 16;

  // initialize state from prop immediately
  const [fragments, setFragments] = useState(
    initialRestructuredCreatedFragments
  );

  // update local state only
  const handleFragmentDeleted = (fragmentId) => {
    setFragments((prev) => prev.filter((f) => f._id !== fragmentId));
    toast.success("Created Fragments State Updated");
  };

  return (
    <div className="p-2">
      <Masonry
        key={fragments.map((f) => f._id).join(",")}
        items={fragments}
        columnGutter={columnGutter}
        columnWidth={columnWidth}
        overscanBy={6}
        render={(props) => (
          <LibraryCreatedFragmentCard
            {...props}
            handleFragmentDeleted={handleFragmentDeleted}
          />
        )}
      />
    </div>
  );
};

export default LibraryCreatedFragmentsGallery;

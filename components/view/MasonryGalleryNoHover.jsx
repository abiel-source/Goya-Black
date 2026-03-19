"use client";

// incoming data (fragments) may require special restructuring -
// see how action `getFragmentsByDate.js` handles the restructuring

import { Masonry } from "masonic";
import FragmentCardNoHover from "@/components/view/FragmentCardNoHover";

const MasonryGalleryNoHover = ({ data }) => {
  const columnWidth = 197;
  const columnGutter = 16;

  return (
    <div className="p-2">
      <Masonry
        items={data}
        columnGutter={columnGutter}
        columnWidth={columnWidth}
        overscanBy={6}
        render={FragmentCardNoHover}
      />
    </div>
  );
};

export default MasonryGalleryNoHover;

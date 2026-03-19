"use client";

// wrapper around masonic's Masonry;
// designed explicitly for /explore to browse routable crystals

import { Masonry } from "masonic";
import CrystalCardFeatured from "@/components/view/CrystalCardFeatured";

const GridGallery = ({ data }) => {
  const columnWidth = 260;
  const columnGutter = 32;

  return (
    <div className="p-2">
      <Masonry
        items={data}
        columnGutter={columnGutter}
        columnWidth={columnWidth}
        overscanBy={6}
        render={CrystalCardFeatured}
      />
    </div>
  );
};

export default GridGallery;

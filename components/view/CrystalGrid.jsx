"use client";

// wrapper around masonic's Masonry;
// designed explicitly for /library to browse routable crystals

import { Masonry } from "masonic";
import CrystalCard from "@/components/view/CrystalCard";

const CrystalGrid = ({ data }) => {
  const columnWidth = 197;
  const columnGutter = 16;

  return (
    <div className="p-2">
      <Masonry
        items={data}
        columnGutter={columnGutter}
        columnWidth={columnWidth}
        overscanBy={5}
        render={CrystalCard}
      />
    </div>
  );
};

export default CrystalGrid;

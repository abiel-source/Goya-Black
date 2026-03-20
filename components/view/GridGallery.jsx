// wrapper around masonic's Masonry;
// designed explicitly for /explore to browse routable crystals

"use client";

import CrystalCardFeatured from "@/components/view/CrystalCardFeatured";

const GridGallery = ({ data }) => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {data.map((crystal, index) => {
          const isOddLength = data.length % 2 === 1;
          const isLastItem = index === data.length - 1;
          const shouldCenterLastCard = isOddLength && isLastItem;

          return (
            <div
              key={crystal?._id || index}
              className={`flex justify-center ${
                shouldCenterLastCard ? "sm:col-span-2" : ""
              }`}
            >
              <div className="w-full max-w-[320px] sm:max-w-none">
                <CrystalCardFeatured data={crystal} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GridGallery;

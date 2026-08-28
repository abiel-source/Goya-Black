"use client";

import dynamic from "next/dynamic";
const Masonry = dynamic(() => import("masonic").then((m) => m.Masonry), { ssr: false });
import FragmentCard from "@/components/view/PaintingCard";
import FragmentCardDetails from "@/components/view/FragmentCardDetails";

const MasonryGallery = ({ data, isDetails = false }) => {
  const columnWidth = 197;
  const columnGutter = 16;

  if (!isDetails) {
    return (
      <div className="p-2">
        <Masonry
          items={data}
          columnGutter={columnGutter}
          columnWidth={columnWidth}
          overscanBy={5}
          render={FragmentCard}
        />
      </div>
    );
  }

  const detailedItem = (data || []).find((x) => x?.flag);
  const restItems = (data || []).filter((x) => !x?.flag);

  // detailed card spans ~2 columns
  const detailSpanCols = 2;
  const detailWidth =
    columnWidth * detailSpanCols + columnGutter * (detailSpanCols - 1);

  return (
    <div className="p-2">
      {/* Detailed card (wider) */}
      {detailedItem && (
        <div className="mb-4 flex justify-center">
          <div
            className="w-full"
            style={{
              maxWidth: detailWidth, // ~410px
            }}
          >
            <FragmentCardDetails
              data={detailedItem.fragment}
              width={detailWidth}
              fixedMediaHeight={600}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}

      {/* Rest of gallery */}
      <Masonry
        items={restItems}
        columnGutter={columnGutter}
        columnWidth={columnWidth}
        overscanBy={5}
        render={({ data, ...rest }) => (
          <FragmentCard data={data.fragment} {...rest} />
        )}
      />
    </div>
  );
};

export default MasonryGallery;

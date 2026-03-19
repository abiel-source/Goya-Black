import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";
import Crystal from "@/models/Crystal";
import { convertToSerializeableObject } from "@/utils/convertToObject";
import MasonryGallery from "@/components/view/MasonryGallery";
import { randomBetween } from "@/utils/restructureData";

const CrystalPage = async ({ params }) => {
  const { crystalId } = await params;
  await connectDB();

  // Get Crystal
  const crystalDoc = await Crystal.findById(crystalId).lean();
  if (!crystalDoc) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Crystal Not Found
      </h1>
    );
  }
  const crystal = convertToSerializeableObject(crystalDoc);

  // Get Fragments
  const fragmentIDs = crystal?.images || [];
  if (!fragmentIDs.length) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">Empty Crystal</h1>
    );
  }
  const fragmentDocs = await Fragment.find({
    _id: { $in: fragmentIDs },
  }).lean();
  const fragments = JSON.parse(JSON.stringify(fragmentDocs));

  // Restructure fragments (ratio)
  const restructuredFragments = fragments.map((f) => {
    const w = f?.image?.width;
    const h = f?.image?.height;

    return {
      ...f,
      ratio:
        typeof w === "number" && typeof h === "number" && h > 0
          ? w / h
          : randomBetween(0.75, 1.8),
    };
  });

  return (
    <>
      <MasonryGallery data={restructuredFragments} />
    </>
  );
};

export default CrystalPage;

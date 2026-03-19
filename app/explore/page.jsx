import connectDB from "@/config/database";
import GridGallery from "@/components/view/GridGallery";
import getFeaturedCrystals from "@/app/actions/query/getFeaturedCrystals";

const ExplorePage = async () => {
  await connectDB();

  const crystals = await getFeaturedCrystals();

  return (
    <>
      {crystals.length === 0 ? (
        <h1 className="text-center text-2xl font-bold mt-10 mb-10">
          No Featured Crystals Today :(
        </h1>
      ) : (
        <>
          <h1 className="text-center text-2xl font-bold mt-10 mb-10">
            Featured Crystals
          </h1>
          <GridGallery data={crystals} />
        </>
      )}
    </>
  );
};

export default ExplorePage;

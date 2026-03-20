import connectDB from "@/config/database";

import GridGallery from "@/components/view/GridGallery";

import getFeaturedCrystals from "@/app/actions/query/getFeaturedCrystals";

const ExplorePage = async () => {
  await connectDB();

  const crystals = await getFeaturedCrystals();

  const date = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {crystals.length === 0 ? (
        <h1 className="text-center text-2xl font-bold mt-10 mb-10">
          No Featured Crystals Today :(
        </h1>
      ) : (
        <>
          <h2 className="text-center text-xl font-bold mt-10 mb-2">{date}</h2>
          <h1 className="text-center text-3xl font-bold mb-10">
            Explore Featured Crystals
          </h1>
          <GridGallery data={crystals} />
        </>
      )}
    </>
  );
};

export default ExplorePage;

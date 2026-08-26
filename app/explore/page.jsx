import connectDB from "@/config/database";

import GridGallery from "@/components/view/GridGallery";

import getFeaturedGalleries from "@/app/actions/query/getFeaturedGalleries";

const ExplorePage = async () => {
  await connectDB();

  const galleries = await getFeaturedGalleries();

  const date = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {galleries.length === 0 ? (
        <h1 className="text-center text-2xl font-bold mt-10 mb-10">
          No Featured Galleries Today :(
        </h1>
      ) : (
        <>
          <h2 className="text-center text-xl font-bold mt-10 mb-2">{date}</h2>
          <h1 className="text-center text-3xl font-bold mb-10">
            Explore Featured Galleries
          </h1>
          <GridGallery data={galleries} />
        </>
      )}
    </>
  );
};

export default ExplorePage;

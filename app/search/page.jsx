import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import Gallery from "@/models/Gallery";
import Painting from "@/models/Painting";

import MasonryGallery from "@/components/view/MasonryGallery";
import { randomBetween } from "@/utils/restructureData";

import recordQuery from "@/app/actions/search/recordQuery";
import searchPaintings from "@/app/actions/search/searchPaintings";

export default async function SearchPage({ searchParams }) {
  await connectDB();

  const sessionUser = await getSessionUser();

  // if (!sessionUser || !sessionUser.userId) {
  //   throw new Error("User ID is required");
  // }
  // const { userId } = sessionUser;

  const params = await searchParams;

  const q = params.q?.trim();
  const galleryId = params.gallery?.trim();
  const galleryLabel = params.label?.trim();

  if (q) {
    if (q.length < 2)
      return <div>No Search Results - Try Something More Specific</div>;

    if (sessionUser && sessionUser.userId) {
      const { userId } = sessionUser;
      await recordQuery(userId, q);
    }

    const paintings = await searchPaintings(q);
    const restructuredPaintings = paintings.map((p) => {
      const w = p?.image?.width;
      const h = p?.image?.height;

      return {
        ...p,
        ratio:
          typeof w === "number" && typeof h === "number" && h > 0
            ? w / h
            : randomBetween(0.75, 1.8),
      };
    });
    return (
      <>
        {paintings.length === 0 ? (
          <h1 className="text-center text-2xl font-bold mt-10">
            No Search Results - Try Something Else!
          </h1>
        ) : (
          <>
            <p className="text-center mt-4">Search Results for "{q}"</p>
            <MasonryGallery key={`q-${q}`} data={restructuredPaintings} />
          </>
        )}
      </>
    );
  } else if (galleryId) {
    const galleryDoc = await Gallery.findById(galleryId).lean();
    if (!galleryDoc) {
      return (
        <h1 className="text-center text-2xl font-bold mt-10">
          Gallery Not Found
        </h1>
      );
    }
    const gallery = JSON.parse(JSON.stringify(galleryDoc));
    const paintingIDs = gallery?.paintings || [];
    if (!paintingIDs.length) {
      return (
        <h1 className="text-center text-2xl font-bold mt-10">Empty Gallery</h1>
      );
    }
    const paintingDocs = await Painting.find({
      _id: { $in: paintingIDs },
    }).lean();
    const paintings = JSON.parse(JSON.stringify(paintingDocs));

    const restructuredPaintings = paintings.map((p) => {
      const w = p?.image?.width;
      const h = p?.image?.height;

      return {
        ...p,
        ratio:
          typeof w === "number" && typeof h === "number" && h > 0
            ? w / h
            : randomBetween(0.75, 1.8),
      };
    });
    return (
      <>
        <p className="text-center mt-4">Showing Results for "{galleryLabel}"</p>
        <MasonryGallery
          key={`gallery-${galleryId}`}
          data={restructuredPaintings}
        />
      </>
    );
  } else {
    return <div>No Search Results - Try Again</div>;
  }
}

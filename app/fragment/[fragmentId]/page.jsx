import connectDB from "@/config/database";
import Fragment from "@/models/Fragment";
import { convertToSerializeableObject } from "@/utils/convertToObject";
import { randomBetween } from "@/utils/restructureData";
import FragmentDetailsFeed from "@/components/view/FragmentDetailsFeed";

const PAGE_SIZE = 20;

const FragmentPage = async ({ params }) => {
  const { fragmentId } = await params;

  await connectDB();

  const fragmentDoc = await Fragment.findById(fragmentId).lean();

  if (!fragmentDoc) {
    return (
      <h1 className="mt-10 text-center text-2xl font-bold">
        Fragment Not Found
      </h1>
    );
  }

  const fragment = convertToSerializeableObject(fragmentDoc);

  const relatedDocs = await Fragment.find({ _id: { $ne: fragmentId } })
    .sort({ createdAt: -1, _id: -1 })
    .limit(PAGE_SIZE + 1)
    .lean();

  const hasMore = relatedDocs.length > PAGE_SIZE;
  const pageItems = hasMore ? relatedDocs.slice(0, PAGE_SIZE) : relatedDocs;

  const relatedFragments = JSON.parse(JSON.stringify(pageItems));

  const mainFragment = {
    flag: true,
    fragment: {
      ...fragment,
      ratio:
        typeof fragment?.image?.width === "number" &&
        typeof fragment?.image?.height === "number" &&
        fragment?.image?.height > 0
          ? fragment.image.width / fragment.image.height
          : randomBetween(0.75, 1.8),
    },
  };

  const initialRelatedItems = relatedFragments.map((f) => {
    const w = f?.image?.width;
    const h = f?.image?.height;

    return {
      flag: false,
      fragment: {
        ...f,
        ratio:
          typeof w === "number" && typeof h === "number" && h > 0
            ? w / h
            : randomBetween(0.75, 1.8),
      },
    };
  });

  const lastItem = pageItems[pageItems.length - 1];

  const initialCursor =
    hasMore && lastItem
      ? {
          createdAt: new Date(lastItem.createdAt).toISOString(),
          id: String(lastItem._id),
        }
      : null;

  return (
    <FragmentDetailsFeed
      fragmentId={fragmentId}
      mainFragment={mainFragment}
      initialRelatedItems={initialRelatedItems}
      initialCursor={initialCursor}
      initialHasMore={hasMore}
    />
  );
};

export default FragmentPage;

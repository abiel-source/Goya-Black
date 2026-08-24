// import MasonryGallery from "@/components/view/MasonryGallery";
// import connectDB from "@/config/database";
// import Fragment from "@/models/Fragment";
// import { randomBetween } from "@/utils/restructureData";

// const HomePage = async () => {
//   await connectDB();
//   // const fragments = await Fragment.find({}).lean();

//   const recentFragmentsDocs = await Fragment.find({})
//     .sort({ createdAt: -1 })
//     .limit(25)
//     .lean();

//   const recentFragments = JSON.parse(JSON.stringify(recentFragmentsDocs));

//   // add ratio field to structure
//   const restructuredFragments = recentFragments.map((f) => {
//     const w = f?.image?.width;
//     const h = f?.image?.height;

//     return {
//       ...f,
//       ratio:
//         typeof w === "number" && typeof h === "number" && h > 0
//           ? w / h
//           : randomBetween(0.75, 1.8),
//     };
//   });

//   return (
//     <>
//       {recentFragmentsDocs.length === 0 ? (
//         <h1 className="text-center text-2xl font-bold mt-10">
//           Fragment Not Found
//         </h1>
//       ) : (
//         <MasonryGallery data={restructuredFragments} />
//       )}
//     </>
//   );
// };

// export default HomePage;

// app/page.jsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MasonryGallery from "@/components/view/MasonryGallery";
import getNextFragmentsPage from "@/app/actions/query/getNextFragmentsPage";

const PAGE_SIZE = 20;

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef(null);
  const hasLoadedInitialRef = useRef(false);

  const loadFragments = useCallback(
    async ({ initial = false } = {}) => {
      if (initial) {
        if (hasLoadedInitialRef.current) return;
        hasLoadedInitialRef.current = true;
        setLoadingInitial(true);
      } else {
        if (loadingMore || loadingInitial || !hasMore) return;
        setLoadingMore(true);
      }

      try {
        const result = await getNextFragmentsPage({
          cursorCreatedAt: initial ? null : cursor?.createdAt ?? null,
          cursorId: initial ? null : cursor?.id ?? null,
          limit: PAGE_SIZE,
        });

        if (initial) {
          setItems(result.items);
        } else {
          setItems((prev) => [...prev, ...result.items]);
        }

        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Failed to load fragments:", error);
      } finally {
        if (initial) {
          setLoadingInitial(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [cursor, hasMore, loadingInitial, loadingMore]
  );

  useEffect(() => {
    loadFragments({ initial: true });
  }, [loadFragments]);

  useEffect(() => {
    if (loadingInitial) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting) {
          loadFragments();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [loadFragments, loadingInitial]);

  if (loadingInitial) {
    return (
      <h1 className="mt-10 text-center text-2xl font-bold">
        Loading Fragments...
      </h1>
    );
  }

  if (items.length === 0) {
    return (
      <h1 className="mt-10 text-center text-2xl font-bold">
        Fragment Not Found
      </h1>
    );
  }

  return (
    <>
      <MasonryGallery data={items} />

      <div ref={sentinelRef} className="h-16 w-full" />

      {loadingMore && (
        <p className="py-6 text-center text-sm text-zinc-400">
          Loading more...
        </p>
      )}

      {!hasMore && items.length > 0 && (
        <p className="py-6 text-center text-sm text-zinc-300">
          No more fragments.
        </p>
      )}
    </>
  );
};

export default HomePage;

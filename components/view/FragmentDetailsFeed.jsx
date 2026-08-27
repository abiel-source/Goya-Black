"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MasonryGallery from "@/components/view/MasonryGallery";
import getNextRelatedFragmentsPage from "@/app/actions/query/getNextRelatedPaintingsPage";

const PAGE_SIZE = 20;

export default function FragmentDetailsFeed({
  fragmentId,
  mainFragment,
  initialRelatedItems,
  initialCursor,
  initialHasMore,
}) {
  const [relatedItems, setRelatedItems] = useState(initialRelatedItems || []);
  const [cursor, setCursor] = useState(initialCursor || null);
  const [hasMore, setHasMore] = useState(initialHasMore ?? false);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursor) return;

    setLoadingMore(true);

    try {
      const res = await getNextRelatedFragmentsPage({
        fragmentId,
        cursorCreatedAt: cursor.createdAt,
        cursorId: cursor.id,
        limit: PAGE_SIZE,
      });

      setRelatedItems((prev) => [...prev, ...(res.items || [])]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } catch (e) {
      console.error("Failed to load related fragments:", e);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, fragmentId, hasMore, loadingMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [loadMore]);

  const data = [mainFragment, ...relatedItems];

  return (
    <>
      <MasonryGallery data={data} isDetails={true} />

      <div ref={sentinelRef} className="h-16 w-full" />

      {loadingMore && (
        <p className="py-6 text-center text-sm text-white/70">
          Loading more...
        </p>
      )}

      {!hasMore && (
        <p className="py-6 text-center text-sm text-white/50">
          No more fragments.
        </p>
      )}
    </>
  );
}

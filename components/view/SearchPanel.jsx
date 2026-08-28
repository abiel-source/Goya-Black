"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

import getRecommendedGalleries from "@/app/actions/search/getRecommendedGalleries";
import getSimilarUsers from "@/app/actions/search/getSimilarUsers";
import getQueryPredictions from "@/app/actions/search/getQueryPredictions";

const SearchPanel = ({ query, setQuery }) => {
  const { data: session, status } = useSession();
  const myId = session?.user?.id;

  const trimmedQuery = query.trim();
  const isEmptyQuery = trimmedQuery.length === 0;

  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const [recommendedGalleries, setRecommendedGalleries] = useState([]);
  const [similarUsers, setSimilarUsers] = useState([]);

  const [loadingDefaultState, setLoadingDefaultState] = useState(false);
  const [defaultStateLoaded, setDefaultStateLoaded] = useState(false);

  // load default search results
  useEffect(() => {
    if (!myId || defaultStateLoaded) return;

    let isMounted = true;

    (async () => {
      try {
        setLoadingDefaultState(true);

        const [galleriesRes, usersRes] = await Promise.all([
          getRecommendedGalleries(myId),
          getSimilarUsers(myId, 5),
        ]);

        if (!isMounted) return;

        setRecommendedGalleries(galleriesRes || []);
        setSimilarUsers(usersRes || []);
        setDefaultStateLoaded(true);
      } catch (e) {
        if (!isMounted) return;
        console.error("Failed to load default search state", e);
        setRecommendedGalleries([]);
        setSimilarUsers([]);
        setDefaultStateLoaded(true);
      } finally {
        if (isMounted) {
          setLoadingDefaultState(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [myId, defaultStateLoaded]);

  // query predictions (autocomplete)
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setPredictions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoadingPredictions(true);
        const res = await getQueryPredictions(trimmed);
        setPredictions(res || []);
      } catch (e) {
        console.error("Failed to fetch query predictions", e);
        setPredictions([]);
      } finally {
        setLoadingPredictions(false);
      }
    }, 250); // "debounce delay"

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {isEmptyQuery ? (
          loadingDefaultState && !defaultStateLoaded ? (
            <div className="text-zinc-400 text-sm">Loading...</div>
          ) : (
            <div className="space-y-6">
              <section>
                <h2 className="mb-3 text-sm font-semibold text-zinc-600 font-medium">
                  Recommended Galleries
                </h2>

                {recommendedGalleries.length === 0 ? (
                  <div className="text-zinc-400 text-sm">
                    {myId
                      ? "No recommended galleries yet."
                      : "Sign in to get recommendations."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recommendedGalleries.map((gallery) => (
                      <Link
                        href={`/search?gallery=${gallery._id}&label=${gallery.name}`}
                        key={gallery._id}
                        className="flex flex-row items-center"
                      >
                        {gallery.coverImage && (
                          <Image
                            className="h-12 w-12 rounded-xl"
                            src={gallery.coverImage}
                            alt=""
                            width={28}
                            height={28}
                          />
                        )}

                        <div className="rounded-lg px-3 py-2 text-[#111111] bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors duration-150">
                          {gallery.name || "Untitled Gallery"}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-3 text-sm font-semibold text-zinc-600 font-medium">
                  Similar Users
                </h2>

                {similarUsers.length === 0 ? (
                  <div className="text-zinc-400 text-sm">
                    {myId
                      ? "No similar users yet."
                      : "Sign in to see similar users."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {similarUsers.map((user) => (
                      <Link
                        href={`/profile/${user._id}`}
                        key={user._id}
                        className="flex flex-row items-center"
                      >
                        {user.image ? (
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={user.image}
                            alt=""
                            width={28}
                            height={28}
                          />
                        ) : (
                          <User size={28} strokeWidth={1.75} />
                        )}
                        <div className="rounded-lg px-3 py-2 text-[#111111] bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors duration-150">
                          {user.username || "Unknown User"}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )
        ) : loadingPredictions ? (
          <div className="text-zinc-400 text-sm">Loading...</div>
        ) : predictions.length === 0 ? (
          <div className="text-zinc-400 text-sm">No suggestions</div>
        ) : (
          <div className="space-y-2">
            {predictions.map((prediction) => (
              <Link
                key={prediction}
                href={`/search?q=${prediction}`}
                className="block"
                // onClick={() => setQuery(prediction)}
              >
                {prediction}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;

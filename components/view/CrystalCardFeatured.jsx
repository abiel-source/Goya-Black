"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import getFragmentSrc from "@/app/actions/query/getFragmentSrc";

const CrystalCardFeatured = ({ data, style, width }) => {
  const name = data?.name || "Untitled";
  const crystalId = data?._id;

  const coverFragmentId = useMemo(() => {
    const first = data?.images?.[0];
    return first?.toString?.() ?? first ?? null;
  }, [data?.images]);

  const [coverImg, setCoverImg] = useState(null);
  const [loadingCoverImg, setLoadingCoverImg] = useState(false);

  useEffect(() => {
    if (!coverFragmentId) {
      setCoverImg("");
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        setLoadingCoverImg(true);
        const res = await getFragmentSrc(coverFragmentId);
        if (isMounted) {
          setCoverImg(res?.url || "");
        }
      } finally {
        if (isMounted) {
          setLoadingCoverImg(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [coverFragmentId]);

  if (!crystalId) return null;

  return (
    <div style={{ ...style, width }}>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[320px]">
          <div className="flex flex-col bg-black overflow-hidden w-full">
            <Link href={`/crystal/${crystalId}`} className="block w-full">
              <div
                className="relative w-full rounded-lg overflow-hidden bg-white/5 border border-white/10"
                style={{ aspectRatio: 0.75, minHeight: 120 }}
              >
                {loadingCoverImg ? (
                  <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
                    Loading...
                  </div>
                ) : coverImg ? (
                  <Image
                    src={coverImg}
                    alt={name}
                    fill
                    sizes={`(max-width: 768px) 320px, ${Math.ceil(width)}px`}
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
                    No cover yet
                  </div>
                )}
              </div>

              <div className="p-2">
                <span className="text-sm text-white">{name}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrystalCardFeatured;

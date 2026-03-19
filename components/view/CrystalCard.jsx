"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import getFragmentSrc from "@/app/actions/query/getFragmentSrc";

const CrystalCard = ({ data, style, width }) => {
  const name = data?.name || "Untitled";
  const crystalId = data?._id;

  // cache first fragment as cover image
  // recompute dependent on data?.images
  // (probably overkill)
  const coverFragmentId = useMemo(() => {
    const first = data?.images?.[0];
    return first?.toString?.() ?? first ?? null;
  }, [data?.images]);
  // const coverFragmentId = data?.images?.[0] ?? null;

  // null = unknown/not loaded, "" = none, string = url
  const [coverImg, setCoverImg] = useState(null);
  const [loadingCoverImg, setLoadingCoverImg] = useState(false);

  // EFFECT: initialize cover image
  useEffect(() => {
    if (!coverFragmentId) {
      setCoverImg("");
      return;
    }

    (async () => {
      const res = await getFragmentSrc(coverFragmentId);
      setCoverImg(res?.url || "");
    })();
  }, [coverFragmentId]);

  if (!crystalId) return null;

  return (
    <div style={style}>
      <div className="flex flex-col bg-black overflow-hidden w-full">
        <Link href={`/library/${crystalId}`} className="block w-full">
          <div
            className="relative w-full rounded-lg overflow-hidden bg-white/5 border border-white/10"
            style={{ aspectRatio: 1.25, minHeight: 120 }}
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
                sizes={`${Math.ceil(width)}px`}
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
  );
};

export default CrystalCard;

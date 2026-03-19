////////////////////////////////////////////////////////////////////////////
/////////////////////////////// AUTHOR NOTES ///////////////////////////////
////////////////////////////////////////////////////////////////////////////
// rewrite to use session status like in FragmentCardDetails.jsx
// update UI first optimistically then make server call in try/catch
// will have to update handling of checkLikeStatus.js when I change it
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

"use client";

import Image from "next/image";
import Link from "next/link";

import { useSession } from "next-auth/react";

const FragmentCardNoHover = ({ data, style, width }) => {
  const name = data?.name || "";
  const src = data?.image?.url || "";
  const ratio = data?.ratio;
  const fragmentId = data?._id;

  const { data: session } = useSession();
  const userId = session?.user?.id;

  return (
    // IMPORTANT: apply masonic's positioning style
    <div style={style}>
      <div className="flex flex-col bg-black overflow-hidden w-full">
        {/* Hover group wrapper */}
        <div
          className="relative w-full group"
          style={{
            aspectRatio: `${ratio}`,
            minHeight: 140,
          }}
        >
          {src && fragmentId && (
            <Link
              href={`/fragment/${fragmentId}`}
              className="block h-full w-full"
            >
              <Image
                src={src}
                alt={name}
                fill
                sizes={`${Math.ceil(width)}px`}
                style={{ objectFit: "cover" }}
                priority={false}
                className="
                  rounded-lg
                  transition-opacity
                  duration-200
                  group-hover:opacity-80
                "
              />
            </Link>
          )}
        </div>

        <span className="p-2 text-sm text-white">{name}</span>
      </div>
    </div>
  );
};

export default FragmentCardNoHover;

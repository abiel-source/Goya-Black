"use client";

import { Heart } from "lucide-react";

export default function Comment({ comment, indent = 0, onToggleLike, liking }) {
  const user = comment?.userId;
  const username = user?.username || "unknown";
  const avatar = user?.image || "";
  const text = comment?.text || "";
  const likes = comment?.likes ?? 0;
  const isLikedByMe = !!comment?.isLikedByMe;

  return (
    <div className="flex gap-3 py-2" style={{ paddingLeft: indent }}>
      <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-100 shrink-0">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={username} className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm text-[#111111] wrap-break-words">
          <span className="font-semibold">{username}</span>{" "}
          <span className="text-zinc-700">{text}</span>
        </div>

        <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-[#2D6A4F] transition-colors duration-150 disabled:opacity-50"
            onClick={() => onToggleLike?.(comment)}
            disabled={!!liking}
            title={isLikedByMe ? "Unlike" : "Like"}
          >
            <Heart
              size={16}
              strokeWidth={1.75}
              className={isLikedByMe ? "fill-[#2D6A4F] stroke-[#2D6A4F]" : ""}
            />
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

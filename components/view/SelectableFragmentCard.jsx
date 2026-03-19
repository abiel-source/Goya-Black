"use client";

export default function SelectableFragmentCard({
  data,
  style,
  width,
  selected,
  setSelected,
}) {
  const id = data?._id?.toString();
  const url = data?.image?.url;
  const ratio = data?.ratio || 1;

  const isSelected = id && selected.has(id);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={style}>
      <button
        type="button"
        onClick={toggle}
        className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black"
        style={{ aspectRatio: `${ratio}` }}
      >
        {url && (
          <img
            src={url}
            alt="fragment"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* overlay */}
        <div
          className={`absolute inset-0 transition ${
            isSelected ? "bg-black/35" : "bg-black/0 hover:bg-black/20"
          }`}
        />

        {/* check badge */}
        <div
          className={`absolute top-2 right-2 h-6 w-6 rounded-full text-xs font-bold grid place-items-center transition
          ${
            isSelected ? "bg-[#5D3FD3] text-white" : "bg-white/10 text-white/70"
          }
        `}
        >
          ✓
        </div>
      </button>
    </div>
  );
}

import Link from "next/link";

const RankMenu = ({ toggleMenu }) => {
  return (
    <div
      role="menu"
      className="
          absolute right-0 top-full mt-2
          z-50 w-64 origin-top-right rounded-xl
          border border-[#E5E7EB] bg-white
          p-2 shadow-lg focus:outline-none
        "
    >
      <h1 className="block rounded-lg px-3 py-2 text-[#111111] font-semibold text-sm">
        <div>Rank</div>
        <div className="text-zinc-400 font-normal">(coming soon)</div>
      </h1>

      <div className="block rounded-lg px-4 py-3 text-sm text-zinc-600 bg-zinc-50 border border-[#E5E7EB]">
        <div>
          Rise through the ranks; get recognized for your outstanding crystals.
        </div>
        <br />
        <div className="font-semibold text-[#111111]">
          Total of 36 tiers in ascending order:
        </div>
        <div>6) Quartz (VI - I)</div>
        <div>5) Topaz (VI - I)</div>
        <div>4) Amethyst (VI - I)</div>
        <div>3) Jade (VI - I)</div>
        <div>2) Diamond (VI - I)</div>
        <div>1) Onyx (VI - I)</div>
        <br />
        <div>{"e.g., Jade I > Jade IV and Topaz VI > Quartz I"}</div>
      </div>

      <Link
        href="/settings/features"
        role="menuitem"
        className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#722F37] transition-colors duration-150"
        onClick={() => toggleMenu("rank")}
      >
        Learn more
      </Link>
    </div>
  );
};

export default RankMenu;

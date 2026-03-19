import Link from "next/link";

const RankMenu = ({ toggleMenu }) => {
  return (
    <div
      role="menu"
      className="
          absolute right-0 top-full mt-2
          z-50 w-64 origin-top-right rounded-md
          border border-[#5D3FD3]/75 bg-black 
          text-white p-2 shadow-lg
          ring-1 ring-black ring-opacity-5 focus:outline-none
        "
    >
      <h1 className="block rounded-lg px-3 py-2 text-white font-semibold">
        <div>Rank Menu</div>
        <div>(coming soon...)</div>
      </h1>

      <div className="block rounded-lg px-4 py-3 text-sm text-white bg-[#5D3FD3]/33">
        <div>
          Rise through the ranks; get recognized for your outstanding crystals.
        </div>
        <br />
        <div className="font-semibold">
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
        className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-[#5D3FD3]/90"
        onClick={toggleMenu("rank")}
      >
        Learn more
      </Link>
    </div>
  );
};

export default RankMenu;

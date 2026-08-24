import Link from "next/link";

const HeaderProfileMenu = ({ setActiveMenu, signOut }) => {
  return (
    <div
      id="user-menu"
      className="
          absolute right-0 top-full mt-2
          z-50 w-56 origin-top-right rounded-xl
          border border-[#E5E7EB] bg-white
          p-2 shadow-lg focus:outline-none
        "
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
      tabIndex={-1}
    >
      <h1 className="block rounded-lg px-3 py-2 text-[#111111] font-semibold text-sm">
        Profile
      </h1>

      <Link
        href="/library"
        className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#2D6A4F] transition-colors duration-150"
        role="menuitem"
        tabIndex={-1}
        onClick={() => setActiveMenu(null)}
      >
        Your Library
      </Link>

      <button
        onClick={() => {
          setActiveMenu(null);
          signOut({ callbackUrl: "/" });
        }}
        className="block w-full text-left rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-red-600 transition-colors duration-150"
        role="menuitem"
        tabIndex={-1}
      >
        Sign Out
      </button>
    </div>
  );
};

export default HeaderProfileMenu;

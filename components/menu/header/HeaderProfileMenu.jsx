import Link from "next/link";

const HeaderProfileMenu = ({ setActiveMenu, signOut }) => {
  return (
    <div
      id="user-menu"
      className="
          absolute right-0 top-full mt-2
          z-50 w-64 origin-top-right rounded-md
          border border-[#5D3FD3]/75 bg-black 
          text-white p-2 shadow-lg
          ring-1 ring-black ring-opacity-5 focus:outline-none
        "
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
      tabIndex={-1}
    >
      <h1 className="block rounded-lg px-3 py-2 text-white font-semibold">
        Profile Menu
      </h1>

      <Link
        href="/library"
        className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-[#5D3FD3]/90"
        role="menuitem"
        tabIndex={-1}
        onClick={() => setActiveMenu(null)}
      >
        Your Profile
      </Link>

      <button
        onClick={() => {
          setActiveMenu(null);
          signOut({ callbackUrl: "/" });
        }}
        className="block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-[#5D3FD3]/90"
        role="menuitem"
        tabIndex={-1}
      >
        Sign Out
      </button>
    </div>
  );
};

export default HeaderProfileMenu;

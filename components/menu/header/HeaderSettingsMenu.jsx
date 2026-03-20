import Link from "next/link";

const HeaderSettingsMenu = ({ toggleMenu }) => {
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
        Settings Menu
      </h1>

      <Link
        href="/settings/about"
        role="menuitem"
        className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-[#5D3FD3]/90"
        onClick={() => toggleMenu("settings")}
      >
        About
      </Link>

      <Link
        href="/settings/features"
        role="menuitem"
        className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-[#5D3FD3]/90"
        onClick={() => toggleMenu("settings")}
      >
        Features & Developer Notes
      </Link>

      {/* <Link
        href="/settings/dev"
        role="menuitem"
        className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-[#5D3FD3]/90"
        onClick={toggleMenu("settings")}
      >
        Developer Notes
      </Link> */}

      <Link
        href="/settings/policy"
        role="menuitem"
        className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-[#5D3FD3]/90"
        onClick={() => toggleMenu("settings")}
      >
        Privacy Policy
      </Link>
    </div>
  );
};

export default HeaderSettingsMenu;

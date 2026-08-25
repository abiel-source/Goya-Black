import Link from "next/link";

const HeaderSettingsMenu = ({ toggleMenu }) => {
  return (
    <div
      role="menu"
      className="
          absolute right-0 top-full mt-2
          z-50 w-56 origin-top-right rounded-xl
          border border-[#E5E7EB] bg-white
          p-2 shadow-lg focus:outline-none
        "
    >
      <h1 className="block rounded-lg px-3 py-2 text-[#111111] font-semibold text-sm">
        Settings
      </h1>

      <Link
        href="/settings/about"
        role="menuitem"
        className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#2D6A4F] transition-colors duration-150"
        onClick={() => toggleMenu("settings")}
      >
        About
      </Link>

      <Link
        href="/settings/features"
        role="menuitem"
        className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#2D6A4F] transition-colors duration-150"
        onClick={() => toggleMenu("settings")}
      >
        Features & Developer Notes
      </Link>

      <Link
        href="/settings/policy"
        role="menuitem"
        className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#2D6A4F] transition-colors duration-150"
        onClick={() => toggleMenu("settings")}
      >
        Privacy Policy
      </Link>
    </div>
  );
};

export default HeaderSettingsMenu;

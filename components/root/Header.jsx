"use client";

import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import Link from "next/link";
import { Search, Settings, User, ShieldHalf } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import RankMenu from "@/components/menu/header/RankMenu";
import HeaderSettingsMenu from "@/components/menu/header/HeaderSettingsMenu";
import HeaderProfileMenu from "@/components/menu/header/HeaderProfileMenu";
import SearchModal from "@/components/modals/SearchModal";

const iconBtn =
  "inline-flex h-9 items-center justify-center rounded-lg text-white hover:bg-white/10 transition";

const Header = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [providers, setProviders] = useState(null);

  // Pattern: single state controls which dropdown is open
  // null | "rank" | "settings" | "profile"
  const [activeMenu, setActiveMenu] = useState(null);

  // search bar modal/dropdown
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // refs for each dropdown wrapper
  const rankMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const menuRefs = useMemo(
    () => ({
      rank: rankMenuRef,
      settings: settingsMenuRef,
      profile: profileMenuRef,
    }),
    []
  );

  const toggleMenu = (name) => {
    setActiveMenu((curr) => (curr === name ? null : name));
  };

  const handleSearchSubmit = () => {
    const trimmed = query.trim();

    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // sync search input + modal state to URL parameters
  useEffect(() => {
    const q = searchParams.get("q")?.trim();
    const crystalId = searchParams.get("crystal")?.trim();
    const label = searchParams.get("label")?.trim();

    if (pathname === "/search") {
      setQuery(q || label || crystalId || "");
    } else {
      setQuery("");
    }

    setSearchOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    setAuthProviders();

    const handleResize = () => setIsMobileMenuOpen(false);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (e) => {
      if (!activeMenu) return;

      const activeRef = menuRefs[activeMenu];
      const el = activeRef?.current;

      if (el && !el.contains(e.target)) {
        setActiveMenu(null);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveMenu(null);
    };

    // use "click" instead of "mousedown"
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMenu, menuRefs]);

  // Close dropdowns on route change (usually feels right)
  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-zinc-900 bg-black">
      <div className="flex h-full w-full items-center justify-between px-4">
        {/* Logo + Search */}
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link
            href="/"
            className="px-1.5 flex items-center text-xs font-semibold text-white"
          >
            <Image
              src="/CrystalClearLogo.svg"
              alt="Logo"
              width={20}
              height={18}
            />
          </Link>

          {/* Mobile Search Icon */}
          {/* <button
            type="button"
            aria-label="SEARCH"
            onClick={() => setSearchOpen(true)}
            className="
                      inline-flex h-9 w-9 items-center justify-center
                      rounded-lg text-white hover:bg-white/10 transition md:hidden"
          >
            <Search size={20} strokeWidth={1.75} />
          </button> */}

          {/* Search Bar */}
          <div className="flex items-center">
            <div className="relative">
              <input
                type="search"
                placeholder="search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                className="
                  h-9 sm:w-sm md:w-lg lg:w-2xl
                  rounded-lg border border-zinc-800 bg-black
                  pl-3 ml-2 pr-10 text-sm text-white
                  placeholder:text-white/40
                  outline-none
                  focus:border-[#5D3FD3]
                "
              />
              <button
                type="button"
                aria-label="Search"
                onClick={handleSearchSubmit}
                className="
                  absolute right-1 top-1
                  inline-flex h-7 w-7 items-center justify-center
                  rounded-md text-white/80
                  hover:bg-white/10 hover:text-white
                  transition
                "
              >
                <Search size={20} strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <SearchModal
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            query={query}
            setQuery={setQuery}
          />
        </div>

        {/* top-right controls logged IN */}
        {session && (
          <nav className="relative flex items-center gap-5">
            {/* RANK dropdown wrapper */}
            <div className="relative" ref={rankMenuRef}>
              <button
                type="button"
                title="RANK"
                aria-label="RANK"
                aria-haspopup="menu"
                aria-expanded={activeMenu === "rank"}
                onClick={() => toggleMenu("rank")}
                className={iconBtn}
              >
                <ShieldHalf size={20} strokeWidth={1.75} />
              </button>

              {activeMenu === "rank" && <RankMenu toggleMenu={toggleMenu} />}
            </div>

            {/* SETTINGS dropdown wrapper */}
            <div className="relative" ref={settingsMenuRef}>
              <button
                type="button"
                title="SETTINGS"
                aria-label="SETTINGS"
                aria-haspopup="menu"
                aria-expanded={activeMenu === "settings"}
                onClick={() => toggleMenu("settings")}
                className={iconBtn}
              >
                <Settings size={20} strokeWidth={1.75} />
              </button>

              {activeMenu === "settings" && (
                <HeaderSettingsMenu toggleMenu={toggleMenu} />
              )}
            </div>

            {/* PROFILE dropdown wrapper */}
            <div className="relative" ref={profileMenuRef}>
              {profileImage ? (
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm"
                  id="user-menu-button"
                  aria-haspopup="true"
                  aria-expanded={activeMenu === "profile"}
                  onClick={() => toggleMenu("profile")}
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={profileImage}
                    alt=""
                    width={40}
                    height={40}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  title="PROFILE"
                  aria-label="PROFILE"
                  aria-haspopup="menu"
                  aria-expanded={activeMenu === "profile"}
                  onClick={() => toggleMenu("profile")}
                  className={iconBtn}
                >
                  <User size={20} strokeWidth={1.75} />
                </button>
              )}

              {/* drop down profile menu options */}
              {activeMenu === "profile" && (
                <HeaderProfileMenu
                  setActiveMenu={setActiveMenu}
                  signOut={signOut}
                />
              )}
            </div>
          </nav>
        )}

        {/* top-right controls logged OUT */}
        {!session && (
          <nav className="flex items-center gap-4">
            {/* SETTINGS dropdown wrapper */}
            <div className="relative" ref={settingsMenuRef}>
              <button
                type="button"
                title="SETTINGS"
                aria-label="SETTINGS"
                aria-haspopup="menu"
                aria-expanded={activeMenu === "settings"}
                onClick={() => toggleMenu("settings")}
                className={iconBtn}
              >
                <Settings size={20} strokeWidth={1.75} />
              </button>

              {activeMenu === "settings" && (
                <HeaderSettingsMenu toggleMenu={toggleMenu} />
              )}
            </div>

            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="flex items-center text-white font-extrabold text-sm rounded-lg px-2 py-2 bg-[#5D3FD3]/90 hover:bg-[#5D3FD3]/75"
                >
                  <FaGoogle className="text-white text-sm mr-2" />
                  <span>Sign In</span>
                </button>
              ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

"use client";

import Image from "next/image";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { Search, Settings, User, ShieldHalf } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import RankMenu from "@/components/menu/header/RankMenu";
import HeaderSettingsMenu from "@/components/menu/header/HeaderSettingsMenu";
import HeaderProfileMenu from "@/components/menu/header/HeaderProfileMenu";
import SearchModal from "@/components/modals/SearchModal";

const iconBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:text-[#111111] transition-colors duration-150";

const Header = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [providers, setProviders] = useState(null);

  const [activeMenu, setActiveMenu] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

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
      if (el && !el.contains(e.target)) setActiveMenu(null);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMenu, menuRefs]);

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  return (
    <header className="z-50 h-16 border-b border-[#E5E7EB] bg-white shrink-0">
      <div className="flex h-full w-full items-center justify-between px-4">
        {/* Search */}
        <div className="flex items-center gap-0 flex-1 min-w-0">
          <div className="relative flex-1 mr-4">
            <input
              type="search"
              placeholder="Search photos, collections..."
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
                h-9 w-full
                rounded-lg border border-[#E5E7EB] bg-[#F9F9F7]
                pl-3 pr-10 text-sm text-[#111111]
                placeholder:text-zinc-400
                outline-none
                focus:border-[#722F37] focus:bg-white
                transition-colors duration-150
              "
            />
            <button
              type="button"
              aria-label="Search"
              onClick={handleSearchSubmit}
              className="
                absolute right-1 top-1
                inline-flex h-7 w-7 items-center justify-center
                rounded-md text-zinc-400 hover:text-[#111111]
                transition-colors duration-150
              "
            >
              <Search size={16} strokeWidth={1.75} />
            </button>
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
          <nav className="relative flex items-center gap-1">
            <div className="relative" ref={rankMenuRef}>
              <button
                type="button"
                title="Rank"
                aria-label="Rank"
                aria-haspopup="menu"
                aria-expanded={activeMenu === "rank"}
                onClick={() => toggleMenu("rank")}
                className={iconBtn}
              >
                <ShieldHalf size={20} strokeWidth={1.75} />
              </button>
              {activeMenu === "rank" && <RankMenu toggleMenu={toggleMenu} />}
            </div>

            <div className="relative" ref={settingsMenuRef}>
              <button
                type="button"
                title="Settings"
                aria-label="Settings"
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

            <div className="relative ml-1" ref={profileMenuRef}>
              {profileImage ? (
                <button
                  type="button"
                  className="relative flex rounded-full ring-2 ring-transparent hover:ring-[#722F37] transition-all duration-150"
                  id="user-menu-button"
                  aria-haspopup="true"
                  aria-expanded={activeMenu === "profile"}
                  onClick={() => toggleMenu("profile")}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="h-8 w-8 rounded-full object-cover"
                    src={profileImage}
                    alt=""
                    width={40}
                    height={40}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  title="Profile"
                  aria-label="Profile"
                  aria-haspopup="menu"
                  aria-expanded={activeMenu === "profile"}
                  onClick={() => toggleMenu("profile")}
                  className={iconBtn}
                >
                  <User size={20} strokeWidth={1.75} />
                </button>
              )}
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
          <nav className="flex items-center gap-3">
            <div className="relative" ref={settingsMenuRef}>
              <button
                type="button"
                title="Settings"
                aria-label="Settings"
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
                  className="flex items-center gap-2 text-white text-sm font-medium rounded-lg px-3 py-2 bg-[#722F37] hover:bg-[#5E2530] transition-colors duration-150"
                >
                  <FaGoogle className="text-white text-xs" />
                  <span>Sign in</span>
                </button>
              ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

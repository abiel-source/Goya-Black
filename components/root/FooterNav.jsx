"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import CreateMenu from "@/components/menu/CreateMenu";
import MenuDropdown from "@/components/view/MenuDropdown";
import MessagesModal from "@/components/modals/MessagesModal";

import {
  HomeIcon,
  GlobeAsiaAustraliaIcon,
  PlusCircleIcon,
  BookmarkIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  GlobeAsiaAustraliaIcon as GlobeAsiaAustraliaIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
} from "@heroicons/react/24/solid";

const navBtn = `
  inline-flex h-10 w-10 items-center justify-center
  rounded-lg text-zinc-400 hover:text-[#2D6A4F]
  transition-colors duration-150
`;

const navBtnActive = `
  inline-flex h-10 w-10 items-center justify-center
  rounded-lg text-[#2D6A4F]
`;

export default function FooterNav() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const createWrapRef = useRef(null);

  const menuRefs = useMemo(() => ({ create: createWrapRef }), []);

  const pathname = usePathname();

  const activeIcon = messagesOpen
    ? "messages"
    : activeMenu === "create" || pathname.startsWith("/create")
    ? "create"
    : activeMenu === "settings"
    ? "settings"
    : pathname === "/"
    ? "home"
    : pathname.startsWith("/explore")
    ? "explore"
    : pathname.startsWith("/library")
    ? "library"
    : null;

  const toggleMenu = (name) => {
    setActiveMenu((curr) => (curr === name ? null : name));
  };

  useEffect(() => {
    const onClick = (e) => {
      if (!activeMenu) return;
      const activeRef = menuRefs[activeMenu];
      const el = activeRef?.current;
      if (el && !el.contains(e.target)) setActiveMenu(null);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setMessagesOpen(false);
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMenu, menuRefs]);

  return (
    <>
      <nav
        className="
          md:hidden
          fixed bottom-0 left-0 right-0 z-50
          h-16
          border-t border-[#E5E7EB] bg-white
          flex items-center justify-around
          px-4
        "
        aria-label="Footer navigation"
      >
        <Link href="/" title="Home" aria-label="Home" className={activeIcon === "home" ? navBtnActive : navBtn}>
          {activeIcon === "home" ? (
            <HomeIconSolid className="h-6 w-6" />
          ) : (
            <HomeIcon className="h-6 w-6" />
          )}
        </Link>

        <Link href="/explore" title="Explore" aria-label="Explore" className={activeIcon === "explore" ? navBtnActive : navBtn}>
          {activeIcon === "explore" ? (
            <GlobeAsiaAustraliaIconSolid className="h-6 w-6" />
          ) : (
            <GlobeAsiaAustraliaIcon className="h-6 w-6" />
          )}
        </Link>

        <CreateMenu
          title="Create"
          ariaLabel="Create"
          Icon={activeIcon === "create" ? PlusCircleIconSolid : PlusCircleIcon}
          isOpen={activeMenu === "create"}
          onToggle={() => toggleMenu("create")}
          wrapRef={createWrapRef}
          direction="up"
          setActiveMenu={setActiveMenu}
        />

        <Link href="/library" title="Library" aria-label="Library" className={activeIcon === "library" ? navBtnActive : navBtn}>
          {activeIcon === "library" ? (
            <UserCircleIconSolid className="h-6 w-6" />
          ) : (
            <UserCircleIcon className="h-6 w-6" />
          )}
        </Link>

        <button
          type="button"
          title="Messages"
          aria-label="Messages"
          onClick={() => setMessagesOpen(true)}
          className={activeIcon === "messages" ? navBtnActive : navBtn}
        >
          {activeIcon === "messages" ? (
            <ChatBubbleLeftIconSolid className="h-6 w-6" />
          ) : (
            <ChatBubbleLeftIcon className="h-6 w-6" />
          )}
        </button>
      </nav>

      <MessagesModal
        open={messagesOpen}
        onClose={() => setMessagesOpen(false)}
      />
    </>
  );
}

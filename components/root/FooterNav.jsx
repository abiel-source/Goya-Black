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

export default function FooterNav() {
  const [activeMenu, setActiveMenu] = useState(null); // null | "create"
  const [messagesOpen, setMessagesOpen] = useState(false);

  const createWrapRef = useRef(null);

  const menuRefs = useMemo(
    () => ({
      create: createWrapRef,
    }),
    []
  );

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

      if (el && !el.contains(e.target)) {
        setActiveMenu(null);
      }
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
          border-t border-zinc-900 bg-black
          flex items-center justify-around
          px-4
        "
        aria-label="Footer navigation"
      >
        {/* Home */}
        <Link
          href="/"
          title="Home"
          aria-label="Home"
          className="
            inline-flex h-10 w-10 items-center justify-center
            rounded-lg text-white hover:bg-white/10 transition
          "
        >
          {activeIcon === "home" ? (
            <HomeIconSolid className="h-6 w-6 text-white" />
          ) : (
            <HomeIcon className="h-6 w-6 text-white" />
          )}
        </Link>

        {/* Explore */}
        <Link
          href="/explore"
          title="Explore"
          aria-label="Explore"
          className="
            inline-flex h-10 w-10 items-center justify-center
            rounded-lg text-white hover:bg-white/10 transition
          "
        >
          {activeIcon === "explore" ? (
            <GlobeAsiaAustraliaIconSolid className="h-6 w-6 text-white" />
          ) : (
            <GlobeAsiaAustraliaIcon className="h-6 w-6 text-white" />
          )}
        </Link>

        {/* Create dropdown */}
        {/* <MenuDropdown
          title="Create"
          ariaLabel="Create"
          Icon={activeIcon == "create" ? PlusCircleIconSolid : PlusCircleIcon}
          isOpen={activeMenu === "create"}
          onToggle={() => toggleMenu("create")}
          wrapRef={createWrapRef}
          direction="up"
        >
          <Link
            href="/create/fragment"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10"
            onClick={() => setActiveMenu(null)}
          >
            Create Fragment
          </Link>

          <Link
            href="/create/crystal"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10"
            onClick={() => setActiveMenu(null)}
          >
            Create Crystal
          </Link>
        </MenuDropdown> */}

        <CreateMenu
          title="Create"
          ariaLabel="Create"
          Icon={activeIcon == "create" ? PlusCircleIconSolid : PlusCircleIcon}
          isOpen={activeMenu === "create"}
          onToggle={() => toggleMenu("create")}
          wrapRef={createWrapRef}
          direction="up"
          setActiveMenu={setActiveMenu}
        />

        {/* Library */}
        <Link
          href="/library"
          title="Library"
          aria-label="Library"
          className="
            inline-flex h-10 w-10 items-center justify-center
            rounded-lg text-white hover:bg-white/10 transition
          "
        >
          {activeIcon === "library" ? (
            <UserCircleIconSolid className="h-6 w-6 text-white" />
          ) : (
            <UserCircleIcon className="h-6 w-6 text-white" />
          )}
        </Link>

        {/* Messages modal */}
        <button
          type="button"
          title="Messages"
          aria-label="Messages"
          onClick={() => setMessagesOpen(true)}
          className="
            inline-flex h-10 w-10 items-center justify-center
            rounded-lg text-white hover:bg-white/10 transition
          "
        >
          {activeIcon === "messages" ? (
            <ChatBubbleLeftIconSolid className="h-6 w-6 text-white" />
          ) : (
            <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
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

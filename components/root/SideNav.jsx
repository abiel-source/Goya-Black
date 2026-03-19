"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import MenuDropdown from "@/components/view/MenuDropdown";
import CreateMenu from "@/components/menu/CreateMenu";
import SettingsMenu from "@/components/menu/SettingsMenu";
import MessagesModal from "@/components/modals/MessagesModal";

import {
  HomeIcon,
  GlobeAsiaAustraliaIcon,
  PlusCircleIcon,
  BookmarkIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  GlobeAsiaAustraliaIcon as GlobeAsiaAustraliaIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from "@heroicons/react/24/solid";

export default function SideNav() {
  // null | "create" | "messages" | "settings"
  const [activeMenu, setActiveMenu] = useState(null);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const createWrapRef = useRef(null);
  const messagesWrapRef = useRef(null);
  const settingsWrapRef = useRef(null);

  const menuRefs = useMemo(
    () => ({
      create: createWrapRef,
      messages: messagesWrapRef,
      settings: settingsWrapRef,
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
      if (e.key === "Escape") setActiveMenu(null);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMenu, menuRefs]);

  // FUNNY FIX: explicitly set side navigation bar to z-49;
  // why? side navigation bar should be intentionally placed lower than header, which is z-50
  // otherwise, header's search modal, gets clipped by the side navigation bar!
  //
  // header creates its own stacking context;
  // so components contained in header can not rise above components contained in sidenav
  // unless the header context itself is higher than the sidenav context
  //
  // this is achieved by setting the header's stacking context higher (z=50)
  // than sidenav's sticking context (z=49)
  return (
    <aside
      className="
        z-49
        hidden md:flex
        sticky top-16
        h-[calc(100dvh-4rem)]
        w-16 shrink-0
        border-r border-zinc-900 bg-black
        flex-col items-center
        py-8
      "
      aria-label="Sidebar"
    >
      {/* Top Controls */}
      <div className="flex flex-col items-center gap-8">
        {/* Home */}
        <Link
          href="/"
          title="Home"
          aria-label="Home"
          className="
            inline-flex h-9 w-9 items-center justify-center
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
            inline-flex h-9 w-9 items-center justify-center
            rounded-lg text-white hover:bg-white/10 transition
          "
        >
          {activeIcon === "explore" ? (
            <GlobeAsiaAustraliaIconSolid className="h-6 w-6 text-white" />
          ) : (
            <GlobeAsiaAustraliaIcon className="h-6 w-6 text-white" />
          )}
        </Link>

        {/* Create */}
        <CreateMenu
          title="Create"
          ariaLabel="Create"
          Icon={activeIcon == "create" ? PlusCircleIconSolid : PlusCircleIcon}
          isOpen={activeMenu === "create"}
          onToggle={() => toggleMenu("create")}
          wrapRef={createWrapRef}
          setActiveMenu={setActiveMenu}
        />

        {/* Library */}
        <Link
          href="/library"
          title="Library"
          aria-label="Library"
          className="
            inline-flex h-9 w-9 items-center justify-center
            rounded-lg text-white hover:bg-white/10 transition"
        >
          {activeIcon === "library" ? (
            <UserCircleIconSolid className="h-6 w-6 text-white" />
          ) : (
            <UserCircleIcon className="h-6 w-6 text-white" />
          )}
        </Link>

        {/* Messages */}
        <button
          type="button"
          title="Messages"
          aria-label="Messages"
          onClick={() => setMessagesOpen(true)}
          className="
            inline-flex h-9 w-9 items-center justify-center
            rounded-lg text-white hover:bg-white/10 transition"
        >
          {activeIcon === "messages" ? (
            <ChatBubbleLeftIconSolid className="h-6 w-6 text-white" />
          ) : (
            <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
          )}
        </button>

        {/* modal */}
        <MessagesModal
          open={messagesOpen}
          onClose={() => setMessagesOpen(false)}
        />
      </div>

      {/* Bottom Control: Settings */}
      <div className="mt-auto pt-8">
        <SettingsMenu
          title="Settings"
          ariaLabel="Settings"
          Icon={activeIcon == "settings" ? Cog6ToothIconSolid : Cog6ToothIcon}
          isOpen={activeMenu === "settings"}
          onToggle={() => toggleMenu("settings")}
          wrapRef={settingsWrapRef}
        />
      </div>
    </aside>
  );
}

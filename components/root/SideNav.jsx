"use client";

import Link from "next/link";
import Image from "next/image";
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

const navBtn = `
  inline-flex h-9 w-9 items-center justify-center
  rounded-lg text-zinc-400 hover:text-[#111111] hover:bg-zinc-100
  transition-colors duration-150
`;

const navBtnActive = `
  inline-flex h-9 w-9 items-center justify-center
  rounded-lg text-[#111111]
`;

export default function SideNav() {
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
      if (el && !el.contains(e.target)) setActiveMenu(null);
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

  return (
    <aside
      className="
        z-49
        hidden md:flex
        h-full
        w-16 shrink-0
        border-r border-[#E5E7EB] bg-white
        flex-col items-center
        py-3
      "
      aria-label="Sidebar"
    >
      <div className="flex flex-col items-center gap-4">
        <Link href="/" className="flex items-center justify-center mb-2">
          <Image src="/goya.svg" alt="Goya Black" width={30} height={30} />
        </Link>
        <Link href="/" title="Home" aria-label="Home" className={activeIcon === "home" ? navBtnActive : navBtn}>
          {activeIcon === "home" ? <HomeIconSolid className="h-6 w-6" /> : <HomeIcon className="h-6 w-6" />}
        </Link>

        <Link href="/explore" title="Explore" aria-label="Explore" className={activeIcon === "explore" ? navBtnActive : navBtn}>
          {activeIcon === "explore" ? <GlobeAsiaAustraliaIconSolid className="h-6 w-6" /> : <GlobeAsiaAustraliaIcon className="h-6 w-6" />}
        </Link>
      </div>

      <div className="w-8 border-t border-[#E5E7EB] my-5" />

      <div className="flex flex-col items-center gap-4">
        <CreateMenu
          title="Create"
          ariaLabel="Create"
          Icon={activeIcon === "create" ? PlusCircleIconSolid : PlusCircleIcon}
          isOpen={activeMenu === "create"}
          onToggle={() => toggleMenu("create")}
          wrapRef={createWrapRef}
          setActiveMenu={setActiveMenu}
        />

        <Link href="/library" title="Library" aria-label="Library" className={activeIcon === "library" ? navBtnActive : navBtn}>
          {activeIcon === "library" ? <UserCircleIconSolid className="h-6 w-6" /> : <UserCircleIcon className="h-6 w-6" />}
        </Link>

        <button
          type="button"
          title="Messages"
          aria-label="Messages"
          onClick={() => setMessagesOpen(true)}
          className={activeIcon === "messages" ? navBtnActive : navBtn}
        >
          {activeIcon === "messages" ? <ChatBubbleLeftIconSolid className="h-6 w-6" /> : <ChatBubbleLeftIcon className="h-6 w-6" />}
        </button>

        <MessagesModal open={messagesOpen} onClose={() => setMessagesOpen(false)} />
      </div>

      <div className="mt-auto pt-3">
        <SettingsMenu
          title="Settings"
          ariaLabel="Settings"
          Icon={activeIcon === "settings" ? Cog6ToothIconSolid : Cog6ToothIcon}
          isOpen={activeMenu === "settings"}
          onToggle={() => toggleMenu("settings")}
          wrapRef={settingsWrapRef}
        />
      </div>
    </aside>
  );
}

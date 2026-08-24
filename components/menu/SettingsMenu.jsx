import Link from "next/link";

// settings menu dropdown for sidenav only

const SettingsMenu = ({
  title,
  ariaLabel,
  Icon,
  isOpen,
  onToggle,
  wrapRef,
  direction = "right",
}) => {
  const menuPositionClass =
    direction === "up"
      ? `
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        `
      : `
          absolute left-full top-1/2 -translate-y-[90%] ml-3
        `;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        title={title}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/8 transition-colors duration-150"
      >
        <Icon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`
            ${menuPositionClass}
            z-50 w-64 rounded-xl border border-[#E5E7EB] bg-white
            shadow-lg p-2
          `}
        >
          <h1 className="block rounded-lg px-3 py-2 text-[#111111] font-semibold text-sm">
            Settings
          </h1>

          <Link
            href="/settings/about"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#2D6A4F] transition-colors duration-150"
            onClick={onToggle}
          >
            About
          </Link>

          <Link
            href="/settings/features"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#2D6A4F] transition-colors duration-150"
            onClick={onToggle}
          >
            Features & Developer Notes
          </Link>

          <Link
            href="/settings/policy"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#2D6A4F] transition-colors duration-150"
            onClick={onToggle}
          >
            Privacy Policy
          </Link>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;

import Link from "next/link";
import { PenLine, LayoutGrid } from "lucide-react";

const CreateMenu = ({
  title,
  ariaLabel,
  Icon,
  isOpen,
  onToggle,
  wrapRef,
  setActiveMenu,
  direction = "right",
}) => {
  const menuPositionClass =
    direction === "up"
      ? `
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          `
      : `
            absolute left-full top-1/2 -translate-y-1/2 ml-3
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
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-[#111111] hover:bg-zinc-100 transition-colors duration-150"
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
            Create
          </h1>
          <Link
            href="/submit"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#722F37] transition-colors duration-150"
            onClick={() => setActiveMenu(null)}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 flex justify-center">
                <PenLine size={16} strokeWidth={1.75} />
              </div>
              <span>Submit a Work</span>
            </div>
          </Link>

          <Link
            href="/create/gallery"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-[#722F37] transition-colors duration-150"
            onClick={() => setActiveMenu(null)}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 flex justify-center">
                <LayoutGrid size={16} strokeWidth={1.75} />
              </div>
              <span>New Gallery</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreateMenu;

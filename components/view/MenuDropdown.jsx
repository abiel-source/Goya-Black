const MenuDropdown = ({
  title,
  ariaLabel,
  Icon,
  isOpen,
  onToggle,
  wrapRef,
  children,
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
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10 transition"
      >
        <Icon className="h-6 w-6 text-white" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`
            ${menuPositionClass}
            z-50 w-56 rounded-xl border border-zinc-800 bg-zinc-700
            shadow-lg p-2
          `}
        >
          {children ?? (
            <div className="px-3 py-2 text-sm text-white/80">Empty menu</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;

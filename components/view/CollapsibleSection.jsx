"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const CollapsibleSection = ({
  children,
  headerText,
  isInitiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  return (
    <section>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg bg-[#5D3FD3]/90 hover:bg-[#5D3FD3]/75 p-2 mt-10"
      >
        <ChevronDown
          className={`ml-2 h-5 w-5 shrink-0 transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
        <h2 className="text-center font-bold w-full">{headerText}</h2>
        <ChevronDown
          className={`ml-2 h-5 w-5 shrink-0 transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default CollapsibleSection;

import React, { useState, useRef, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi2";

export interface Option {
  value: string;
  label: string;
}

const MenuSelect = ({
  options,
  selected,
  setSelected,
}: {
  options: Option[];
  selected: Option;
  setSelected: (option: Option) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between bg-base-100 rounded-lg p-3 cursor-pointer hover:bg-base-200"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="text-sm">{selected.label}</p>
        <HiChevronDown className="w-5 h-5 ml-2" />
      </div>

      {isOpen && (
        <ul className="absolute menu items-center bg-base-200 p-2 rounded-box z-10 mt-2 gap-1 w-fit">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className={`rounded-lg w-full ${selected.value === option.value
                  ? "bg-primary disabled:pointer-events-none text-black"
                  : ""
                }`}
            >
              <p className="">{option.label}</p>
            </li>
          ))}
          {/*
          <li>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Item 2
            </a>
          </li>
            */}
        </ul>
      )}
    </div>
  );
};

export default MenuSelect;

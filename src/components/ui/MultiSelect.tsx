"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Filter } from "lucide-react";

interface MultiSelectProps {
  label: string;
  options: (string | number)[];
  selected: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
}

export default function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string | number) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
          selected.length > 0 
            ? "bg-blue-600/20 border-blue-500/50 text-blue-400" 
            : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
        }`}
      >
        <span className="text-sm font-medium">
          {selected.length > 0 ? `${label} (${selected.length})` : label}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#0b1021] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? "bg-blue-600 border-blue-600" : "border-slate-600"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
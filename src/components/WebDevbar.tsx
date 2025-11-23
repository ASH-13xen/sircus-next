"use client";

import React from "react";

// --- MOCKS FOR PREVIEW (Delete these in your real project) ---
// In your real project, remove these lines and uncomment the real imports below.
 import Link from "next/link";
// import { usePathname } from "next/navigation";

const usePathname = () => "/learn/webdev/html"; 


// -------------------------------------------------------------

const navItems = [
  { name: "HTML", path: "/learn/webdev/html" },
  { name: "CSS", path: "/learn/webdev/css" },
  { name: "JavaScript", path: "/learn/webdev/javascript" },
];

const WebDevBar = () => {
  const pathname = usePathname();

  return (
    // Outer container: Fixed position, transparent, allows clicks to pass through to page behind it
    <div className="fixed top-17 left-0 right-0 z-50 flex w-full justify-center pointer-events-none">
      
      {/* Navigation Pill: The actual floating element (pointer-events-auto re-enables clicks) */}
      <nav className="pointer-events-auto flex w-full max-w-xl items-center gap-1 rounded-full border border-slate-800 bg-slate-950/60 p-1 shadow-2xl backdrop-blur-xl mx-4 transition-all hover:bg-slate-950/80 hover:border-slate-700">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                relative flex-1 rounded-full py-2 text-center text-sm font-bold tracking-wide transition-all duration-300 ease-out
                ${
                  isActive
                    ? "hover:bg-slate-500/20 "
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default WebDevBar;
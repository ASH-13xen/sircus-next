"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch results based on query (debouncing handled by React/Convex naturally)
  const results = useQuery(api.users.searchUsers, { searchTerm: query });
  
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

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search students..."
          className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-hidden transition-all placeholder:text-slate-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-full bg-[#0b1021] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          
          {results === undefined ? (
            <div className="p-4 flex justify-center text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">
              No students found.
            </div>
          ) : (
            <div>
              <p className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Students
              </p>
              {results.map((user) => (
                <Link
                  key={user._id}
                  href={`/profile/${user._id}`}
                  onClick={() => setIsOpen(false)} // Close on click
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-0"
                >
                  <Avatar className="w-8 h-8 border border-slate-700">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {user.name}
                    </p>
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span>{user.role}</span>
                      {user.branch && <span>• {user.branch}</span>}
                    </div>
                  </div>

                  {user.isPremium && (
                    <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20">
                      PRO
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
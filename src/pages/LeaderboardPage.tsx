"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Link from "next/link";
import { Loader2, Filter, X } from "lucide-react";
import MultiSelect from "@/components/ui/MultiSelect";

export default function LeaderboardPage() {
  const [selectedYears, setSelectedYears] = useState<(string | number)[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<(string | number)[]>([]);

  const topUsers = useQuery(api.users.getLeaderboard, {
    years: selectedYears.length > 0 ? (selectedYears as number[]) : undefined,
    branches: selectedBranches.length > 0 ? (selectedBranches as string[]) : undefined,
  });

  return (
    <div className="min-h-screen text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Hall of Fame
          </h1>
          <p className="text-slate-400">Top performers of the SircuS</p>
        </div>

        {/* --- FILTERS SECTION --- */}
        {/* FIX: Added 'relative z-50' so dropdowns appear ABOVE the list below */}
        <div className="relative z-50 flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-400 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter By:</span>
          </div>

          <MultiSelect 
            label="Batches" 
            options={[2024, 2025, 2026, 2027, 2028]} 
            selected={selectedYears}
            onChange={setSelectedYears}
          />

          <MultiSelect 
            label="Branches" 
            options={["CSE", "ECE", "DSAI"]} 
            selected={selectedBranches}
            onChange={setSelectedBranches}
          />

          {/* Clear Filters Button */}
          {(selectedYears.length > 0 || selectedBranches.length > 0) && (
            <button
              onClick={() => {
                setSelectedYears([]);
                setSelectedBranches([]);
              }}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 ml-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 transition-all"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* --- LEADERBOARD LIST --- */}
        {/* This stays at default z-index (0), so filters (z-50) will float over it */}
        <div className="relative z-0 bg-slate-900/60 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
          {topUsers === undefined ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : topUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
              <p className="text-lg">No students found matching these filters.</p>
              <p className="text-sm text-slate-600">Try adjusting your selection.</p>
            </div>
          ) : (
            topUsers.map((user, index) => (
              <div 
                key={user._id} 
                className={`flex items-center justify-between p-5 border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors ${
                  index === 0 ? "bg-yellow-500/10 border-l-4 border-l-yellow-500" : 
                  index === 1 ? "bg-slate-500/10 border-l-4 border-l-slate-400" : 
                  index === 2 ? "bg-orange-500/10 border-l-4 border-l-orange-600" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank Number */}
                  <span className={`font-mono font-bold text-xl w-8 text-center ${
                    index === 0 ? "text-yellow-400 text-3xl" : 
                    index === 1 ? "text-slate-300 text-2xl" : 
                    index === 2 ? "text-orange-400 text-2xl" : "text-slate-600"
                  }`}>
                    {index + 1}
                  </span>
                  
                  {/* Avatar */}
                  <img 
                    src={user.image || "/default-avatar.png"} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover"
                  />
                  
                  {/* User Info */}
                  <div>
                    <Link 
                      href={`/profile/${user._id}`} 
                      className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      {user.name}
                      {user.isPremium && (
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30">PRO</span>
                      )}
                    </Link>
                    
                    <div className="flex gap-3 text-xs text-slate-400 mt-1 font-medium">
                      <span className="px-2 py-0.5 bg-slate-800 rounded">{user.role}</span>
                      {user.branch && <span className="px-2 py-0.5 bg-slate-800 rounded text-blue-300">{user.branch}</span>}
                      {user.collegeYear && <span className="px-2 py-0.5 bg-slate-800 rounded text-green-300">'{user.collegeYear.toString().slice(-2)}</span>}
                    </div>
                  </div>
                </div>

                {/* XP Score */}
                <div className="text-right">
                  <p className="font-bold text-2xl text-blue-400 font-mono tracking-tight">
                    {user.currentXP.toLocaleString()}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">XP</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
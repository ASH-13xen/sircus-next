/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Link from "next/link";
import { Loader2, Filter, X, Trophy, Medal, Crown } from "lucide-react";
import MultiSelect from "@/components/ui/MultiSelect"; // Assuming this component exists

export default function LeaderboardPage() {
  const [selectedYears, setSelectedYears] = useState<(string | number)[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<(string | number)[]>(
    []
  );

  const topUsers = useQuery(api.users.getLeaderboard, {
    years: selectedYears.length > 0 ? (selectedYears as number[]) : undefined,
    branches:
      selectedBranches.length > 0 ? (selectedBranches as string[]) : undefined,
  });

  // Helper to get rank styles
  const getRankStyles = (index: number) => {
    switch (index) {
      case 0:
        return {
          bg: "bg-gradient-to-r from-yellow-500/10 to-transparent",
          border: "border-yellow-500/50",
          text: "text-yellow-400",
          icon: <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />,
          glow: "shadow-[0_0_20px_rgba(234,179,8,0.1)]",
        };
      case 1:
        return {
          bg: "bg-gradient-to-r from-slate-400/10 to-transparent",
          border: "border-slate-400/50",
          text: "text-slate-300",
          icon: <Medal className="w-5 h-5 text-slate-300" />,
          glow: "",
        };
      case 2:
        return {
          bg: "bg-gradient-to-r from-orange-700/10 to-transparent",
          border: "border-orange-700/50",
          text: "text-orange-400",
          icon: <Medal className="w-5 h-5 text-orange-600" />,
          glow: "",
        };
      default:
        return {
          bg: "hover:bg-slate-800/30",
          border: "border-transparent",
          text: "text-slate-500",
          icon: (
            <span className="text-sm font-mono font-bold text-slate-600">
              #{index + 1}
            </span>
          ),
          glow: "",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] relative isolate overflow-hidden font-sans">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 rounded-full blur-[100px] -z-10" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-5xl mx-auto p-6 md:p-12">
        {/* --- HEADER --- */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#0b1021] border border-slate-800 shadow-xl mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Hall of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Fame
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Recognizing the top performers. Compete, earn XP, and climb the
            ranks.
          </p>
        </div>

        {/* --- FILTERS SECTION --- */}
        <div className="relative z-50 flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-[#0b1021] p-5 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Filters
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Note: Ensure MultiSelect is styled for dark mode or accepts className props */}
            <div className="min-w-[150px]">
              <MultiSelect
                label="Batches"
                options={[2024, 2025, 2026, 2027, 2028]}
                selected={selectedYears}
                onChange={setSelectedYears}
              />
            </div>
            <div className="min-w-[150px]">
              <MultiSelect
                label="Branches"
                options={["CSE", "ECE", "DSAI"]}
                selected={selectedBranches}
                onChange={setSelectedBranches}
              />
            </div>

            {/* Clear Filters Button */}
            {(selectedYears.length > 0 || selectedBranches.length > 0) && (
              <button
                onClick={() => {
                  setSelectedYears([]);
                  setSelectedBranches([]);
                }}
                className="flex items-center justify-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 px-4 py-2 bg-red-950/10 hover:bg-red-950/20 rounded-lg border border-red-900/30 transition-all"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* --- LEADERBOARD LIST --- */}
        <div className="relative z-0 bg-[#0b1021] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Table Header (Visual Only) */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
            <div className="col-span-7 md:col-span-8">User</div>
            <div className="col-span-3 text-right pr-4">XP Score</div>
          </div>

          {topUsers === undefined ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : topUsers.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-slate-800/50 text-slate-600">
                <Filter className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg text-white font-medium">
                  No students found
                </p>
                <p className="text-sm text-slate-500">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {topUsers.map((user, index) => {
                const style = getRankStyles(index);

                return (
                  <div
                    key={user._id}
                    className={`grid grid-cols-12 gap-4 items-center p-4 transition-all duration-300 ${style.bg} ${index < 3 ? "border-l-2" : ""} ${style.border} ${style.glow}`}
                  >
                    {/* Rank Column */}
                    <div className="col-span-2 md:col-span-1 flex justify-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${index < 3 ? "bg-slate-900/50 border border-slate-700" : ""}`}
                      >
                        {style.icon}
                      </div>
                    </div>

                    {/* User Info Column */}
                    <div className="col-span-7 md:col-span-8 flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={user.image || "/default-avatar.png"}
                          alt={user.name}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 ${index === 0 ? "border-yellow-500" : "border-slate-800"}`}
                        />
                        {index === 0 && (
                          <div className="absolute -top-2 -right-1">
                            <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 rotate-12" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <Link
                          href={`/profile/${user._id}`}
                          className="text-sm md:text-base font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-2 group"
                        >
                          {user.name}
                          {user.isPremium && (
                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20 font-bold tracking-wide">
                              PRO
                            </span>
                          )}
                        </Link>

                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 bg-slate-800/50 text-slate-400 rounded border border-slate-700/50 uppercase tracking-wide">
                            {user.role}
                          </span>
                          {user.branch && (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-900/20 text-blue-300 rounded border border-blue-900/30 hidden sm:inline-block">
                              {user.branch}
                            </span>
                          )}
                          {user.collegeYear && (
                            <span className="text-[10px] px-2 py-0.5 bg-slate-800/50 text-slate-500 rounded border border-slate-700/50 hidden sm:inline-block">
                              {user.collegeYear.toString().slice(-2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* XP Column */}
                    <div className="col-span-3 text-right pr-2 md:pr-4">
                      <p
                        className={`font-mono font-bold text-lg md:text-xl tracking-tighter ${index < 3 ? style.text : "text-white"}`}
                      >
                        {user.currentXP.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        XP
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

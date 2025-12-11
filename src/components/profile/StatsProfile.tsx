"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Target, Award } from "lucide-react";
import PortfolioModal from "./PortfolioModal"; // Import the modal
import { Id } from "@/../convex/_generated/dataModel";

interface StatsGridProps {
  totalSkills: number;
  totalTests: number;
  totalProjects: number;
  totalCertifications: number;
  // We need to pass these down to open the modal correctly
  userId?: Id<"users">; 
  isOwner?: boolean;
}

export default function StatsProfile({
  totalSkills,
  totalTests,
  totalProjects,
  totalCertifications,
  userId,
  isOwner = false,
}: StatsGridProps) {
  
  // State for the modal
  const [activeModal, setActiveModal] = useState<"skills" | "tests" | "projects" | "certificates" | null>(null);

  const stats = [
    { 
      label: "Total Skills", 
      value: totalSkills, 
      icon: Target, 
      color: "text-blue-400",
      key: "skills" as const
    },
    { 
      label: "Tests Passed", 
      value: totalTests, 
      icon: Star, 
      color: "text-emerald-400",
      key: "tests" as const
    },
    { 
      label: "Projects Built", 
      value: totalProjects, 
      icon: Trophy, 
      color: "text-purple-400",
      key: "projects" as const
    },
    { 
      label: "Certifications", 
      value: totalCertifications, 
      icon: Award, 
      color: "text-yellow-400",
      key: "certificates" as const
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Statistics
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card 
              key={stat.label} 
              // ADD CLICK HANDLER
              onClick={() => setActiveModal(stat.key)}
              className={`bg-[#0b1021] border-slate-800 transition-all duration-300 group relative overflow-hidden cursor-pointer hover:border-slate-600 hover:bg-slate-900/80`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${stat.color.split('-')[1]}-900/10`} />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-white font-sans tracking-tight">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* RENDER THE MODAL IF ID IS PRESENT */}
      {userId && (
        <PortfolioModal 
          isOpen={!!activeModal} 
          onClose={() => setActiveModal(null)} 
          type={activeModal}
          userId={userId}
          isOwner={isOwner}
        />
      )}
    </>
  );
}
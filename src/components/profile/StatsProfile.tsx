"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Target, Award } from "lucide-react";

interface StatsGridProps {
  totalSkills: number;
  totalTests: number;
  totalProjects: number;
  totalCertifications: number;
}

export default function StatsProfile({
  totalSkills,
  totalTests,
  totalProjects,
  totalCertifications,
}: StatsGridProps) {
  
  // I've added color properties here to match the multi-colored 
  // accents seen in the "Learning Paths" screenshot.
  const stats = [
    { 
      label: "Total Skills", 
      value: totalSkills, 
      icon: Target, 
      color: "text-blue-400",
      hoverBorder: "hover:border-blue-500/50",
      shadow: "shadow-blue-500/10"
    },
    { 
      label: "Tests Passed", 
      value: totalTests, 
      icon: Star, 
      color: "text-emerald-400",
      hoverBorder: "hover:border-emerald-500/50",
      shadow: "shadow-emerald-500/10"
    },
    { 
      label: "Projects Built", 
      value: totalProjects, 
      icon: Trophy, 
      color: "text-purple-400",
      hoverBorder: "hover:border-purple-500/50",
      shadow: "shadow-purple-500/10"
    },
    { 
      label: "Certifications", 
      value: totalCertifications, 
      icon: Award, 
      color: "text-yellow-400",
      hoverBorder: "hover:border-yellow-500/50",
      shadow: "shadow-yellow-500/10"
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
        Statistics
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            className={`bg-[#0b1021] border-slate-800 transition-all duration-300 ${stat.hoverBorder} group relative overflow-hidden`}
          >
            {/* Subtle background glow on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${stat.color.split('-')[1]}-900/10`} />

            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between">
                
                {/* Stats Text */}
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-white font-sans tracking-tight">
                    {stat.value.toLocaleString()}
                  </p>
                </div>

                {/* Icon Box */}
                <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 ${stat.color} ${stat.shadow} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
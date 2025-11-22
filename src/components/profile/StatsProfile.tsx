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
  const stats = [
    { label: "Total Skills", value: totalSkills, icon: Target },
    { label: "Tests Passed", value: totalTests, icon: Star },
    { label: "Projects Built", value: totalProjects, icon: Trophy },
    { label: "Certifications", value: totalCertifications, icon: Award },
  ];

  return (
    <div>
      <h2 className="text-3xl font-display mb-6">Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-accent text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

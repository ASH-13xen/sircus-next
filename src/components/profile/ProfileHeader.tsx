"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { Calendar, Edit, LogOut, Mail } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  image?: string;
  role: string;
  joinDate: number;
}

export default function ProfileHeader({
  name,
  email,
  image,
  role,
  joinDate,
}: ProfileHeaderProps) {
  const formattedJoinDate = new Date(joinDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    // Wrapped in the theme's card style (Dark Navy + Slate Border)
    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 p-8 bg-[#0b1021] border border-slate-800 rounded-2xl shadow-xl">
      
      {/* Avatar Section with "Neon" Glow Effect */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
        <Avatar className="w-24 h-24 border-4 border-[#0b1021] relative shadow-2xl">
          <AvatarImage src={image || ""} className="object-cover" />
          <AvatarFallback className="text-3xl font-bold bg-slate-800 text-blue-500">
            {name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Info Section */}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {name}
          </h1>
          {/* Tech-style Pill Badge */}
          <Badge 
            variant="outline" 
            className="bg-blue-500/10 border-blue-500/20 text-blue-400 px-3 py-1 rounded-md uppercase tracking-wider text-[10px] font-bold"
          >
            {role}
          </Badge>
        </div>

        {/* Meta Data Grid */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-800/50 text-slate-400">
                <Mail className="w-3.5 h-3.5" />
            </div>
            <span>{email}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-800/50 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
            </div>
            <span>Joined {formattedJoinDate}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row md:flex-col lg:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
        <Button 
            variant="outline" 
            className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all flex-1 md:flex-none"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>

        <SignOutButton>
          <Button 
            variant="outline" 
            className="border-red-900/30 bg-red-950/10 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-900/50 transition-all flex-1 md:flex-none"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
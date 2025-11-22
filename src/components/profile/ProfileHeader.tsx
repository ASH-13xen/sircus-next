"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { Calendar, Edit, LogOut } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  image?: string;
  role: string;
  joinDate: number; // Passing the raw timestamp
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
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <Avatar className="w-24 h-24 border-4 border-primary">
        <AvatarImage src={image || ""} />
        <AvatarFallback className="text-2xl bg-primary/20 text-primary">
          {name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-display text-foreground">{name}</h1>
          <Badge variant="outline" className="text-primary border-primary/30">
            {role}
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground mb-3">{email}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Joined {formattedJoinDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>

        <SignOutButton>
          <Button variant="destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}

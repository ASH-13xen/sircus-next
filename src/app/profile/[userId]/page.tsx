
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import UserProfileDisplay from "@/components/profile/UserProfileDisplay"; // <--- IMPORT SHARED COMPONENT
import { Id } from "../../../../convex/_generated/dataModel";

export default function PublicProfilePage() {
  const params = useParams();
  
  // Safe cast the string from URL to a Convex ID
  // (Assuming your folder structure is app/profile/[userId]/page.tsx)
  const userId = (params?.userId as Id<"users">);

  const userData = useQuery(api.users.getUserById, { userId });

  // --- LOADING STATE ---
  if (userData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // --- NOT FOUND STATE ---
  if (userData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-slate-400">
        <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
        <p>The profile you are looking for does not exist.</p>
      </div>
    );
  }

  // --- MAIN CONTENT ---
  // Pass isOwner={false} so visitors CANNOT edit this profile.
  return <UserProfileDisplay userData={userData} isOwner={false} />;
}
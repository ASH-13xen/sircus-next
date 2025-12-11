"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn } from "lucide-react";
import UserProfileDisplay from "@/components/profile/UserProfileDisplay"; // <--- IMPORT THE SHARED COMPONENT

export default function Profile() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const userData = useQuery(api.users.getUserProfile);
  const storeUser = useMutation(api.users.storeUser);

  // Auto-Sync Effect
  useEffect(() => {
    if (isClerkLoaded && clerkUser && userData === null) {
      storeUser({});
    }
  }, [isClerkLoaded, clerkUser, userData, storeUser]);

  // --- LOADING STATE ---
  if (userData === undefined || !isClerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // --- NOT LOGGED IN STATE ---
  if (!clerkUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] px-4">
        <div className="bg-[#0b1021] border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

          <div className="mx-auto p-4 rounded-full bg-slate-800/50 w-20 h-20 flex items-center justify-center border border-slate-700">
            <LogIn className="w-8 h-8 text-blue-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Access Restricted
            </h2>
            <p className="text-slate-400">
              Please sign in to view your profile and manage your settings.
            </p>
          </div>

          <SignInButton mode="modal">
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Sign In / Sign Up
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // --- SYNCING STATE ---
  if (userData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-slate-400 font-medium animate-pulse">
          Synchronizing profile data...
        </p>
      </div>
    );
  }

  // --- MAIN CONTENT ---
  // We delegate the rendering to your powerful UserProfileDisplay component
  // We pass isOwner={true} so you can edit your details.
  return <UserProfileDisplay userData={userData} isOwner={true} />;
}

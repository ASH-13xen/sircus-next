"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LevelProgress from "@/components/profile/LevelProgress";
import StatsProfile from "@/components/profile/StatsProfile";
import { getRoleFromXP, getLevelFromXP, getNextLevelXP } from "../../../convex/gameLogic";
import { AlertTriangle, Lock, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner"; // Assuming you have a toast library, or use alert()
import UserSearch from "./UserSearch";
import ResumeUpload from "./ResumeUpload";
import TranscriptUpload from "./TranscriptUpload";
// Props: accept userData and a flag to know if this is MY profile
export default function UserProfileDisplay({ 
  userData, 
  isOwner = false 
}: { 
  userData: any, 
  isOwner?: boolean 
}) {
  const updateProfile = useMutation(api.users.updateAcademicDetails);
  
  // Stats Calculation
  const displayLevel = getLevelFromXP(userData.currentXP);
  const displayRole = getRoleFromXP(userData.currentXP);
  const nextLevelGoal = getNextLevelXP(userData.currentXP);

  // --- EDIT STATE LOGIC ---
  const updateCount = userData.profileUpdateCount || 0;
  const isLocked = updateCount >= 2;
  const isMissingInfo = !userData.branch || !userData.collegeYear;

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [branch, setBranch] = useState(userData.branch || "CSE");
  const [year, setYear] = useState(userData.collegeYear || 2028);

  const handleSave = async () => {
    try {
      await updateProfile({ branch, collegeYear: parseInt(year.toString()) });
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
      alert(error.message); // Fallback if no toast
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#0b1021] to-[#020617] py-12 border-b border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-end mb-8">
               <UserSearch />
            </div>

            <ProfileHeader
              name={userData.name}
              email={userData.email || "Private Email"}
              image={userData.image}
              role={displayRole}
              joinDate={userData._creationTime}
              isPremium={userData.isPremium}
            />
            <div className="flex flex-wrap items-center justify-end gap-4 mt-6 px-4 sm:px-0">
                <ResumeUpload 
                resumeUrl={userData.resumeUrl} // Ensure backend returns this!
                isOwner={isOwner} 
                />
                <TranscriptUpload 
                    transcriptUrl={userData.transcriptUrl} // Make sure query returns this!
                    isOwner={isOwner} 
                />
            </div>
            <div className="mt-8">
              <LevelProgress
                currentLevel={displayLevel}
                currentXP={userData.currentXP}
                nextLevelXP={nextLevelGoal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Details Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <StatsProfile
            totalSkills={userData.totalSkills || 0}
            totalTests={userData.totalTests || 0}
            totalProjects={userData.totalProjects || 0}
            totalCertifications={userData.totalCertifications || 0}
            userId={userData._id} 
            isOwner={isOwner}
          />
          
          {/* --- ACADEMIC DETAILS CARD --- */}
          {/* Logic: Show this card if data exists OR if it's the owner (to prompt them to add it) */}
          {(userData.branch || isOwner) && (
            <div className={`border rounded-2xl p-6 shadow-lg relative overflow-hidden transition-colors ${
               isMissingInfo && isOwner ? "bg-yellow-900/10 border-yellow-600/50" : "bg-[#0b1021] border-slate-800"
            }`}>
              
              {/* HEADER ROW */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${isMissingInfo && isOwner ? "text-yellow-500" : "text-slate-200"}`}>
                    {isMissingInfo && isOwner ? <AlertTriangle className="w-5 h-5" /> : null}
                    Academic Details
                  </h3>
                  {isOwner && !isLocked && (
                    <p className="text-xs text-slate-400 mt-1">
                      {isMissingInfo 
                        ? "Please complete your profile." 
                        : `You have ${2 - updateCount} edit(s) remaining.`}
                    </p>
                  )}
                </div>

                {/* EDIT BUTTON (Only for Owner & Not Locked) */}
                {isOwner && !isEditing && !isLocked && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors text-blue-400"
                    title="Edit Details"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                
                {/* LOCKED INDICATOR */}
                {isLocked && isOwner && (
                  <div className="flex items-center gap-1 text-slate-500 text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                )}
              </div>

              {/* --- VIEW MODE --- */}
              {!isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider mb-1">Branch</span>
                    <span className="text-xl font-mono text-blue-400 font-bold">{userData.branch || "Not Set"}</span>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider mb-1">Batch</span>
                    <span className="text-xl font-mono text-green-400 font-bold">{userData.collegeYear || "Not Set"}</span>
                  </div>
                </div>
              ) : (
                
              /* --- EDIT MODE --- */
                <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700">
                  <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded text-sm text-yellow-200 flex gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>
                      <strong>Caution:</strong> Academic details can only be changed <strong>once</strong> after setting. 
                      Please ensure this information is accurate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">Branch</label>
                      <select 
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-600 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                      >
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="DSAI">DSAI</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">Graduation Year</label>
                      <select 
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-600 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                      >
                         {[2024, 2025, 2026, 2027, 2028, 2029].map(y => (
                           <option key={y} value={y}>{y}</option>
                         ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center gap-2 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Save Details
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
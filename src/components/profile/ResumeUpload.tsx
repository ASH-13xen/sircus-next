"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { FileText, Upload, Loader2, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner"; // Or use alert()

interface ResumeUploadProps {
  resumeUrl?: string | null;
  isOwner: boolean;
}

export default function ResumeUpload({ resumeUrl, isOwner }: ResumeUploadProps) {
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const saveResume = useMutation(api.users.updateResume);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get the URL from Convex
      const postUrl = await generateUploadUrl();

      // 2. POST the file directly to that URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json();

      // 3. Save the ID to the user's profile
      await saveResume({ storageId });
      
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  // --- VISITOR VIEW ---
  if (!isOwner) {
    if (!resumeUrl) return null; // Nothing to show
    return (
      <a 
        href={resumeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg border border-slate-700 transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span className="text-sm font-medium">View Resume</span>
      </a>
    );
  }

  // --- OWNER VIEW ---
  return (
    <div className="flex gap-3 items-center">
      {/* Hidden Input */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUpload}
      />

      {/* Upload/Replace Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          resumeUrl 
            ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            : "bg-blue-600 border-blue-500 text-white hover:bg-blue-500"
        }`}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : resumeUrl ? (
          <RefreshCw className="w-4 h-4" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isUploading ? "Uploading..." : resumeUrl ? "Replace Resume" : "Upload Resume"}
        </span>
      </button>

      {/* View Button (Only if resume exists) */}
      {resumeUrl && (
        <a 
          href={resumeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 bg-slate-800 text-blue-400 rounded-lg border border-slate-700 hover:bg-slate-700"
          title="View Current Resume"
        >
          <Eye className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
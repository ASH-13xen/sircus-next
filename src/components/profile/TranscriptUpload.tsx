"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { GraduationCap, Upload, Loader2, Eye, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner"; 

interface TranscriptUploadProps {
  transcriptUrl?: string | null;
  isOwner: boolean;
}

export default function TranscriptUpload({ transcriptUrl, isOwner }: TranscriptUploadProps) {
  // Re-use the same generateUploadUrl logic
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const saveTranscript = useMutation(api.users.updateTranscript);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json();

      await saveTranscript({ storageId });
      toast.success("Transcript uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload transcript");
    } finally {
      setIsUploading(false);
    }
  };

  // --- VISITOR VIEW ---
  if (!isOwner) {
    if (!transcriptUrl) return null;
    return (
      <a 
        href={transcriptUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-green-400 rounded-lg border border-slate-700 transition-colors"
      >
        <GraduationCap className="w-4 h-4" />
        <span className="text-sm font-medium">View Transcript</span>
      </a>
    );
  }

  // --- OWNER VIEW ---
  return (
    <div className="flex gap-3 items-center">
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUpload}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          transcriptUrl 
            ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
        }`}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : transcriptUrl ? (
          <RefreshCw className="w-4 h-4" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isUploading ? "Uploading..." : transcriptUrl ? "Replace Transcript" : "Upload Transcript"}
        </span>
      </button>

      {transcriptUrl && (
        <a 
          href={transcriptUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 bg-slate-800 text-green-400 rounded-lg border border-slate-700 hover:bg-slate-700"
          title="View Current Transcript"
        >
          <Eye className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
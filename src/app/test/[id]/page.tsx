"use client";

import LoaderUI from "@/components/LoaderUI"; // Assuming you might want to keep this, or replace with inline styles below
import TestHeader from "@/components/test/TestHeader";
import TestWorkspace from "@/components/test/TestWorkspace";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { CheckCircle2, Terminal, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function TestPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  // FIX: Log for build, but kept subtle
  useEffect(() => {
    if(id) console.log("Initializing Test Environment:", id);
  }, [id]);

  // 1. Fetch the specific Test/Assessment details
  // const testData = useQuery(api.tests.getTestById, { id });

  // MOCK DATA for now
  const testData = {
    title: "Frontend Developer Assessment",
    duration: 3600, // 1 hour in seconds
    questions: ["two-sum", "reverse-string"], // IDs of questions
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- 1. LOADING STATE (Themed) ---
  if (!testData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#02040a] relative overflow-hidden">
        {/* Tech Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 relative z-10" />
            </div>
            <p className="text-slate-400 font-mono text-sm tracking-wider animate-pulse">BOOTING ENVIRONMENT...</p>
        </div>
      </div>
    );
  }

  // --- 2. SUBMITTED STATE (Themed) ---
  if (isSubmitted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#02040a] relative isolate">
        
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] -z-10" />
        <div 
            className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
            style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
        />

        {/* Success Card */}
        <div className="relative z-10 bg-[#0b1021] border border-slate-800 p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full mx-4 overflow-hidden">
           
           {/* Top Gradient Line */}
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

           <div className="flex justify-center mb-8">
             <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
             </div>
           </div>

           <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
             Assessment Submitted
           </h1>
           
           <p className="text-slate-400 text-lg mb-8 leading-relaxed">
             Your code has been pushed to our evaluation servers. Results will be available on your dashboard shortly.
           </p>

           <div className="flex flex-col gap-3">
             <Link href="/dashboard">
                <Button className="w-full h-12 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                    Return to Dashboard
                </Button>
             </Link>
             <Button variant="ghost" className="text-slate-500 hover:text-white hover:bg-slate-800">
                View Submission Logs
             </Button>
           </div>
        </div>
      </div>
    );
  }

  // --- 3. MAIN WORKSPACE (Themed Layout) ---
  return (
    <div className="h-screen flex flex-col bg-[#02040a] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
      <Toaster 
        toastOptions={{
            style: {
                background: '#0b1021',
                color: '#fff',
                border: '1px solid #1e293b'
            }
        }}
      />

      {/* HEADER: Timer & Submit */}
      {/* Ensure TestHeader is updated to accept dark theme props or styled internally */}
      <div className="shrink-0 z-50 border-b border-slate-800 bg-[#0b1021]">
          <TestHeader
            testTitle={testData.title}
            duration={testData.duration}
            onTimeout={() => setIsSubmitted(true)}
            onSubmit={() => setIsSubmitted(true)}
          />
      </div>

      {/* MAIN WORKSPACE */}
      {/* We use flex-1 to fill the remaining height. overflow-hidden prevents page scroll, handling scroll inside Workspace */}
      <div className="flex-1 overflow-hidden relative">
        <TestWorkspace questions={testData.questions} />
      </div>
    </div>
  );
}
export default TestPage;
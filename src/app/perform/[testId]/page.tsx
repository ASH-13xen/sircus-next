/* eslint-disable react-hooks/immutability */
// app/perform/[testId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader2, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react"; // Added useRef

import PerformCodeEditor from "@/components/perform/PerformCodeEditor";
import AIProctor from "@/components/perform/AIProctor";

export default function PerformTestRoom() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.testId as Id<"perform_tests">;

  // 1. Fetch Data
  const test = useQuery(
    api.perform.getPerformTest,
    testId ? { testId } : "skip"
  );

  // 2. Fetch Global Server Time (for synchronization)
  const serverNow = useQuery(api.perform.getServerTime);

  const submitTest = useMutation(api.perform.submitPerformTest);

  const [timeLeft, setTimeLeft] = useState<string>("Loading...");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store the offset (Server Time - Client Time)
  const timeOffset = useRef<number>(0);

  // --- SYNCHRONIZE CLOCKS ---
  useEffect(() => {
    if (serverNow) {
      // Calculate how far off the client clock is from the server
      timeOffset.current = serverNow - Date.now();
    }
  }, [serverNow]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    // Wait until test data AND server time are loaded
    if (!test || test.status !== "live" || serverNow === undefined) return;

    // Safety: If for some reason startTime is missing in DB (old tests), use serverNow
    const safeStartTime = test.startTime || serverNow;

    const DURATION_MS = 60 * 60 * 1000; // 1 Hour in ms
    const endTime = safeStartTime + DURATION_MS;

    const timer = setInterval(() => {
      // current "Global" time = Client Time + Offset
      const now = Date.now() + timeOffset.current;
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("00:00");
        handleAutoSubmit();
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Prevent NaN by checking if calculation is valid
        if (isNaN(minutes) || isNaN(seconds)) {
          setTimeLeft("Error");
        } else {
          setTimeLeft(
            `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          );
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [test, serverNow]); // Re-run when these change

  const handleAutoSubmit = () => {
    if (isSubmitting) return;
    toast.error("Submitting test due to time limit or violations...", {
      duration: 5000,
    });

    // Clean up local storage for this test ID
    localStorage.removeItem(`violations_${testId}`);

    handleSubmit();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitTest({ testId });
      toast.success("Test Submitted Successfully! Rank Updated.");
      router.push("/perform");
    } catch (e) {
      toast.error("Failed to submit");
      setIsSubmitting(false);
    }
  };

  if (!test) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#02040a]">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  // Handle Completed State
  if (test.status !== "live") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#02040a] text-white gap-4">
        <h1 className="text-2xl font-bold">Test Completed</h1>
        <p className="text-slate-400">
          Your Score:{" "}
          <span className="text-blue-400 font-bold">{test.score || 0}/5</span>
        </p>
        <Button onClick={() => router.push("/perform")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#02040a] text-slate-200 relative">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0b1021]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/perform")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="font-bold text-lg text-white">
              {test.skill.toUpperCase()} Assessment
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Environment
            </p>
          </div>
        </div>

        {/* TIMER */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-md shadow-inner">
          <Clock className="w-4 h-4 text-blue-500" />
          <span
            className={`font-mono font-bold text-lg tracking-widest ${timeLeft === "00:00" ? "text-red-500" : "text-white"}`}
          >
            {timeLeft}
          </span>
        </div>

        <Button
          variant="destructive"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Finish & Submit
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <PerformCodeEditor testId={testId} />
      </div>

      <AIProctor testId={testId} onViolationLimitReached={handleAutoSubmit} />
    </div>
  );
}

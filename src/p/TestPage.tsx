/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Trophy,
  Video,
  ShieldAlert,
  Loader2,
  Signal,
  CheckCircle2,
  AlertCircle,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { Id, Doc } from "../../convex/_generated/dataModel";

// --- TYPE DEFINITIONS ---
type TestWithScore = Doc<"tests"> & { myScore?: number };

export default function TestPage() {
  const { user, isLoaded } = useUser();
  const proctorEmail = process.env.NEXT_PUBLIC_PROCTOR_EMAIL;

  const isProctor =
    isLoaded &&
    !!proctorEmail &&
    user?.primaryEmailAddress?.emailAddress === proctorEmail;

  // Fetch data
  const availableTests = useQuery(api.tests.getAvailableTests);
  const upcomingTests = useQuery(api.tests.getUpcomingTests);
  const pastTests = useQuery(api.tests.getPastTests);
  const register = useMutation(api.tests.registerForTest);

  const handleRegister = async (testId: Id<"tests">) => {
    try {
      await register({ testId });
      toast.success("Registration confirmed.");
    } catch (error) {
      toast.error("Registration failed.");
    }
  };

  // Loading State
  if (
    availableTests === undefined ||
    upcomingTests === undefined ||
    pastTests === undefined
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] relative isolate font-sans text-slate-200 selection:bg-blue-500/30">
      {/* Background Grid Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] -z-10" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        {/* --- HEADER & PROCTOR ACTIONS --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Interview <span className="text-blue-500">Center</span>
            </h1>
            <p className="text-slate-400">
              Manage your technical assessments and live coding sessions.
            </p>
          </div>

          {isProctor && (
            <Link href="/test/proctor">
              <Button
                variant="destructive"
                className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.2)] gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                Proctor Dashboard
              </Button>
            </Link>
          )}
        </div>

        {/* --- SECTION 1: UPCOMING INTERVIEWS --- */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Signal className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">
              My Scheduled Sessions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTests.length === 0 && (
              <div className="col-span-full py-16 bg-[#0b1021] border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium">
                  No upcoming interviews scheduled.
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  Register for an open slot below.
                </p>
              </div>
            )}
            {upcomingTests.map((test) =>
              test ? (
                <TestCard key={test._id} test={test} type="upcoming" />
              ) : null
            )}
          </div>
        </section>

        {/* --- SECTION 2: OPEN REGISTRATIONS --- */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Open Slots</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">
                  No open slots available right now.
                </p>
              </div>
            )}
            {availableTests.map((test) => (
              <TestCard
                key={test._id}
                test={test}
                type="register"
                onRegister={() => handleRegister(test._id)}
              />
            ))}
          </div>
        </section>

        {/* --- SECTION 3: PAST HISTORY --- */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-slate-400" />
            <h2 className="text-2xl font-bold text-white">History</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTests.map((test) =>
              test ? <TestCard key={test._id} test={test} type="past" /> : null
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// --- UPDATED CARD COMPONENT ---
interface TestCardProps {
  test: TestWithScore;
  type: "upcoming" | "register" | "past";
  onRegister?: () => void;
}

function TestCard({ test, type, onRegister }: TestCardProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!test) return null;

  // Logic: Can join 10 mins before start time
  const isTimeReached = now ? now >= test.startTime - 10 * 60 * 1000 : false;
  const isLive = test.status === "live";

  // Dynamic Styles based on state
  const isPast = type === "past";
  const borderColor = isLive
    ? "border-red-500/50"
    : isPast
      ? "border-slate-800"
      : "border-slate-700";
  const glowClass = isLive
    ? "shadow-[0_0_20px_rgba(239,68,68,0.15)]"
    : "hover:shadow-lg hover:shadow-blue-900/10";

  return (
    <Card
      className={`
        flex flex-col h-full bg-[#0b1021] ${borderColor} ${glowClass}
        transition-all duration-300 relative overflow-hidden group rounded-2xl
        ${isPast ? "opacity-75 hover:opacity-100" : ""}
      `}
    >
      {/* Top Highlight Gradient */}
      {!isPast && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-4">
          {isLive ? (
            <Badge className="bg-red-500/10 text-red-500 border-red-500/50 animate-pulse gap-1.5 pl-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              LIVE NOW
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className={`
                ${test.domain === "Web" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : ""}
                ${test.domain === "DSA" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : ""}
                ${test.domain === "AI" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : ""}
                ${!["Web", "DSA", "AI"].includes(test.domain) ? "bg-slate-800 text-slate-400 border-slate-700" : ""}
            `}
            >
              {test.domain}
            </Badge>
          )}

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
            <Clock className="w-3 h-3" />
            {test.durationMinutes}m
          </div>
        </div>

        <CardTitle
          className={`text-xl font-bold tracking-tight ${isPast ? "text-slate-400" : "text-white"}`}
        >
          {test.title}
        </CardTitle>
        <p className="text-sm text-slate-500 font-medium">{test.topic}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Date & Time Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Date
            </span>
            <span className="text-slate-300 font-mono text-xs">
              {new Date(test.startTime).toLocaleDateString()}
            </span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Time
            </span>
            <span className="text-slate-300 font-mono text-xs">
              {new Date(test.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Score Display (Past Tests) */}
        {type === "past" && test.myScore !== undefined ? (
          <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
            <span className="text-xs text-slate-500 uppercase font-bold">
              Result
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl font-bold font-mono ${test.myScore > test.maxPoints * 0.7 ? "text-emerald-400" : "text-yellow-400"}`}
              >
                {test.myScore}
              </span>
              <span className="text-xs text-slate-600 font-mono">
                / {test.maxPoints}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 pt-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-500/50" />
            <span>
              Max Score:{" "}
              <span className="text-slate-300">{test.maxPoints}</span>
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t border-slate-800/50">
        {/* BUTTON LOGIC */}
        {type === "register" && (
          <Button
            onClick={onRegister}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
          >
            Register Slot
          </Button>
        )}

        {type === "upcoming" && (
          <div className="w-full">
            {isTimeReached || isLive ? (
              <Link
                href={`/test/interview/${test._id}`}
                className="w-full block"
              >
                <Button
                  className={`w-full ${
                    isLive
                      ? "bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                  }`}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isLive ? "JOIN LIVE NOW" : "Enter Waiting Room"}
                </Button>
              </Link>
            ) : (
              <Button className="w-full bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed hover:bg-slate-800">
                <span className="mr-2 opacity-50">
                  <Play className="w-3 h-3" />
                </span>
                Starts at{" "}
                {new Date(test.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Button>
            )}
          </div>
        )}

        {type === "past" && (
          <Button
            variant="outline"
            disabled
            className="w-full border-slate-800 text-slate-600 bg-transparent"
          >
            Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

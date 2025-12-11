/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Loader2,
  Video,
  ShieldAlert,
  Trophy,
  CheckCircle2,
  Play,
  Signal,
  Laptop2,
  Lock,
  XCircle,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import CodeEditor from "@/components/test/CodeEditor";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function InterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const testId = params?.id as Id<"tests">;

  // Data
  const test = useQuery(api.tests.getTestById, testId ? { testId } : "skip");
  const updateStatus = useMutation(api.tests.updateTestStatus);
  const finalizeResult = useMutation(api.tests.finalizeTestResult);
  const generateToken = useAction(api.stream.generateStreamToken);

  const proctorEmail = process.env.NEXT_PUBLIC_PROCTOR_EMAIL;
  const isProctor =
    isLoaded && user?.primaryEmailAddress?.emailAddress === proctorEmail;

  // Stream State
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);

  // --- SCORING MODAL STATE ---
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreInput, setScoreInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- USE EFFECTS ---
  useEffect(() => {
    if (!user || !isLoaded) return;
    const initClient = async () => {
      try {
        const token = await generateToken();
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
        const videoClient = new StreamVideoClient({
          apiKey,
          user: {
            id: user.id,
            name: user.fullName || "Participant",
            image: user.imageUrl,
          },
          token,
        });
        setClient(videoClient);
      } catch (err) {
        console.error(err);
      }
    };
    initClient();
  }, [user, isLoaded, generateToken]);

  useEffect(() => {
    if (!client || !testId) return;
    const myCall = client.call("default", testId);
    setCall(myCall);
  }, [client, testId]);

  useEffect(() => {
    if (isProctor || !test || test.status !== "live") return;
    const handleVisibilityChange = () => {
      if (document.hidden) toast.error("⚠️ Focus Lost: Tab switching detected!", {
        style: { background: '#7f1d1d', color: '#fff', border: '1px solid #991b1b' }
      });
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [test?.status, isProctor]);

  // --- HANDLERS ---
  const handleJoinCall = async () => {
    if (!call) return;
    await call.join({ create: true });
    setIsJoined(true);
  };

  const handleStartTest = async () => {
    await updateStatus({ testId, status: "live" });
    toast.success("System Live. Recording started.");
  };

  const handleEndTestClick = () => {
    setShowScoreModal(true);
  };

  const handleSubmitScore = async () => {
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 0 || score > (test?.maxPoints || 100)) {
      toast.error(
        `Invalid Input: Range 0 - ${test?.maxPoints}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await finalizeResult({ testId, score });
      toast.success("Session Finalized. Data saved.");
      setShowScoreModal(false);
      router.push("/test");
    } catch (err) {
      toast.error("Error saving results.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!testId || test === undefined || !client || !call) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#02040a]">
        <div className="flex flex-col items-center gap-4">
             <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
             <p className="text-slate-500 font-mono text-sm tracking-widest">ESTABLISHING SECURE CONNECTION...</p>
        </div>
      </div>
    );
  }
  if (test === null) return <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">Test Not Found</div>;
  if (!isProctor && !test.isRegistered) return <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">Access Denied</div>;

  return (
    <StreamVideo client={client}>
      <div className="min-h-screen bg-[#02040a] relative isolate font-sans text-slate-200 selection:bg-blue-500/30">
        
        {/* Background Grid */}
        <div 
            className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
            style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
        />

        <div className="flex flex-col h-screen p-4 lg:p-6 gap-6">
            
            {/* --- HEADER CONTROL BAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0b1021] border border-slate-800 p-4 rounded-xl shadow-lg shrink-0">
            <div>
                <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Laptop2 className="w-6 h-6 text-blue-500" />
                    {test.title}
                </h1>
                
                {test.status === "live" ? (
                     <Badge className="bg-red-500/10 text-red-500 border-red-500/50 animate-pulse gap-1.5 pl-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        LIVE
                     </Badge>
                ) : (
                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                        {test.status?.toUpperCase() || "SCHEDULED"}
                    </Badge>
                )}
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> Max Points: {test.maxPoints}</span>
                    <span className="w-px h-3 bg-slate-800" />
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Duration: {test.durationMinutes}m</span>
                </div>
            </div>

            {/* PROCTOR CONTROLS */}
            {isProctor && (
                <div className="flex gap-3">
                {test.status !== "live" && (
                    <Button
                    onClick={handleStartTest}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Initialize Session
                    </Button>
                )}
                {test.status !== "completed" && (
                    <Button onClick={handleEndTestClick} variant="destructive" className="bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600/20">
                    <XCircle className="w-4 h-4 mr-2" />
                    End & Grade
                    </Button>
                )}
                </div>
            )}
            </div>

            {/* --- MAIN SPLIT LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            
            {/* LEFT PANEL: VIDEO FEED */}
            <Card className="flex flex-col bg-[#0b1021] border-slate-800 overflow-hidden h-full rounded-2xl shadow-2xl relative">
                
                {/* Panel Header */}
                <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                     <Signal className={`w-3 h-3 ${isJoined ? "text-green-500" : "text-slate-500"}`} />
                     <span className="text-[10px] font-bold uppercase tracking-wider text-white">Video Feed</span>
                </div>

                <CardContent className="flex-1 p-0 flex flex-col relative h-full">
                {isJoined ? (
                    <StreamTheme className="h-full w-full">
                    <StreamCall call={call}>
                        <div className="h-full w-full flex flex-col bg-slate-950">
                        <SpeakerLayout />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                            <div className="bg-[#0b1021]/80 backdrop-blur-lg p-2 rounded-2xl border border-slate-700 shadow-xl">
                                <CallControls onLeave={() => setIsJoined(false)} />
                            </div>
                        </div>
                        </div>
                    </StreamCall>
                    </StreamTheme>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8 relative overflow-hidden">
                    {/* Background Noise Effect for "No Signal" vibe */}
                    <div className="absolute inset-0 opacity-5" style={{backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+') "}} />

                    {test.status === "scheduled" ? (
                        <div className="text-center space-y-4 relative z-10">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 border-slate-800 border-dashed animate-[spin_10s_linear_infinite]">
                            <Video className="text-slate-500 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg tracking-tight">Signal Standby</h3>
                            <p className="text-slate-500 text-sm">Waiting for secure connection...</p>
                        </div>
                        </div>
                    ) : test.status === "live" ? (
                        <div className="text-center space-y-6 relative z-10">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] mx-auto relative">
                            <span className="absolute inset-0 rounded-full border border-emerald-500/50 animate-ping opacity-20" />
                            <Video className="text-emerald-500 w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Connection Available</h3>
                            <p className="text-emerald-400/70 text-sm">System is live and recording.</p>
                        </div>
                        <Button
                            onClick={handleJoinCall}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 shadow-lg shadow-emerald-900/20"
                        >
                            Connect Video
                        </Button>
                        </div>
                    ) : (
                        <div className="text-slate-500 font-mono text-sm">SESSION TERMINATED</div>
                    )}
                    </div>
                )}
                </CardContent>
            </Card>

            {/* RIGHT PANEL: CODE EDITOR */}
            <div className="h-full flex flex-col relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0b1021] shadow-2xl">
                {test.status === "live" || test.status === "completed" || isProctor ? (
                    <div className="h-full">
                        <CodeEditor testId={testId} isProctor={!!isProctor} />
                    </div>
                ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-[#0b1021] relative">
                     <div className="absolute inset-0 bg-slate-900/20" style={{backgroundImage: "linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b), linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px", opacity: 0.1}} />
                    
                    <div className="relative z-10 bg-[#02040a] p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-sm">
                        <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-xl flex items-center justify-center mb-6 border border-slate-700">
                            <Lock className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Environment Locked</h3>
                        <p className="text-slate-400 text-sm">
                            The coding interface is currently restricted. Waiting for administrator authorization.
                        </p>
                    </div>
                </div>
                )}
            </div>
            </div>

            {/* --- SCORING MODAL OVERLAY --- */}
            {showScoreModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#0b1021] border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
                 
                 {/* Modal Top Glow */}
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Trophy className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Finalize Evaluation</h2>
                </div>

                <div className="space-y-4">
                     <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Award final marks to the candidate. This action is irreversible and will update the global leaderboard.
                        </p>
                     </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Score Awarded (Max: {test.maxPoints})
                        </label>
                        <Input
                        type="number"
                        placeholder="0"
                        value={scoreInput}
                        onChange={(e) => setScoreInput(e.target.value)}
                        autoFocus
                        className="bg-[#02040a] border-slate-700 text-white text-lg h-12 focus:ring-blue-500/50 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                    <Button
                    variant="ghost"
                    onClick={() => setShowScoreModal(false)}
                    disabled={isSubmitting}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                    Cancel
                    </Button>
                    <Button
                    onClick={handleSubmitScore}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 min-w-[140px]"
                    >
                    {isSubmitting ? (
                        <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                        </>
                    ) : (
                        <>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Result
                        </>
                    )}
                    </Button>
                </div>
                </div>
            </div>
            )}
        </div>
      </div>
    </StreamVideo>
  );
}
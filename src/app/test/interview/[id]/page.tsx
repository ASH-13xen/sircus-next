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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Ensure you have this or use standard <input>

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
  const finalizeResult = useMutation(api.tests.finalizeTestResult); // <--- Use the new mutation
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

  // ... (Keep existing useEffects for Stream Init, Call Object, and Anti-Cheat) ...
  // Re-paste them here if you need the full file, otherwise keep your existing ones.
  // For brevity, I am assuming the previous useEffects are here.

  // --- KEEP THESE USE EFFECTS FROM PREVIOUS CODE ---
  useEffect(() => {
    if (!user || !isLoaded) return;
    const initClient = async () => {
      /* ... existing code ... */
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
      if (document.hidden) toast.error("Tab switching detected!");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [test?.status, isProctor]);
  // ------------------------------------------------

  // --- HANDLERS ---

  const handleJoinCall = async () => {
    if (!call) return;
    await call.join({ create: true });
    setIsJoined(true);
  };

  const handleStartTest = async () => {
    await updateStatus({ testId, status: "live" });
    toast.success("Session is now LIVE");
  };

  // 1. Trigger the Modal instead of ending immediately
  const handleEndTestClick = () => {
    setShowScoreModal(true);
  };

  // 2. Submit Score and Calculate XP
  const handleSubmitScore = async () => {
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 0 || score > (test?.maxPoints || 100)) {
      toast.error(
        `Please enter a valid score between 0 and ${test?.maxPoints}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await finalizeResult({ testId, score });
      toast.success("Session Ended. XP Awarded!");
      setShowScoreModal(false);
      router.push("/test");
    } catch (err) {
      toast.error("Failed to finalize results");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!testId || test === undefined || !client || !call) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (test === null) return <div>Test Not Found</div>;
  if (!isProctor && !test.isRegistered) return <div>Access Denied</div>;

  return (
    <StreamVideo client={client}>
      <div className="container mx-auto p-4 lg:p-6 min-h-screen flex flex-col gap-4 relative">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {test.title}
              </h1>
              <Badge
                variant={test.status === "live" ? "destructive" : "outline"}
              >
                {test.status?.toUpperCase() || "SCHEDULED"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Max Points: {test.maxPoints} • Duration: {test.durationMinutes}{" "}
              mins
            </p>
          </div>

          {/* PROCTOR CONTROLS */}
          {isProctor && (
            <div className="flex gap-2">
              {test.status !== "live" && (
                <Button
                  onClick={handleStartTest}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Session
                </Button>
              )}
              {test.status !== "completed" && (
                <Button onClick={handleEndTestClick} variant="destructive">
                  End Session & Grade
                </Button>
              )}
            </div>
          )}
        </div>

        {/* MAIN CONTENT (Split Screen) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[600px]">
          {/* VIDEO CARD */}
          <Card className="flex flex-col bg-slate-950 border-slate-800 overflow-hidden h-full rounded-xl">
            <CardContent className="flex-1 p-0 flex flex-col relative">
              {isJoined ? (
                <StreamTheme className="h-full w-full">
                  <StreamCall call={call}>
                    <div className="h-full w-full flex flex-col">
                      <SpeakerLayout />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                        <CallControls onLeave={() => setIsJoined(false)} />
                      </div>
                    </div>
                  </StreamCall>
                </StreamTheme>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
                  {test.status === "scheduled" ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <Video className="text-slate-400" />
                      </div>
                      <h3 className="text-white font-semibold">
                        Waiting for Host
                      </h3>
                    </div>
                  ) : test.status === "live" ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 animate-pulse mx-auto">
                        <Video className="text-green-500" />
                      </div>
                      <Button
                        onClick={handleJoinCall}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Join Video Call
                      </Button>
                    </div>
                  ) : (
                    <div className="text-white">Session Ended</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* EDITOR CARD */}
          <div className="h-full flex flex-col">
            {test.status === "live" ||
            test.status === "completed" ||
            isProctor ? (
              <CodeEditor testId={testId} isProctor={!!isProctor} />
            ) : (
              <Card className="h-full flex items-center justify-center p-6 text-center bg-muted/20">
                <div>
                  <ShieldAlert className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold">Locked</h3>
                  <p className="text-muted-foreground">
                    Waiting for proctor to start.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* --- SCORING MODAL OVERLAY --- */}
        {showScoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-background border border-border p-6 rounded-lg shadow-lg w-full max-w-md space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-6 h-6" />
                <h2 className="text-xl font-bold">Finalize Results</h2>
              </div>

              <p className="text-muted-foreground text-sm">
                Enter the marks awarded to the candidate. This will calculate
                their XP, update their Level, and end the session.
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Marks (Out of {test.maxPoints})
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 85"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowScoreModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitScore}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Submit & End
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StreamVideo>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

// --- STREAM IMPORTS ---
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

  // Data Fetching
  const test = useQuery(api.tests.getTestById, { testId });
  const updateStatus = useMutation(api.tests.updateTestStatus);
  const generateToken = useAction(api.stream.generateStreamToken);

  const proctorEmail = process.env.NEXT_PUBLIC_PROCTOR_EMAIL;
  const isProctor =
    isLoaded && user?.primaryEmailAddress?.emailAddress === proctorEmail;

  // --- STREAM STATE ---
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);

  // 1. Initialize Stream Client
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
        console.error("Failed to init stream", err);
      }
    };

    initClient();
  }, [user, isLoaded, generateToken]);

  // 2. Setup the Call Object (but don't join yet)
  useEffect(() => {
    if (!client || !test) return;

    // Use testId as the unique call ID
    const myCall = client.call("default", testId);
    setCall(myCall);
  }, [client, test, testId]);

  // --- HANDLERS ---
  const handleJoinCall = async () => {
    if (!call) return;
    try {
      await call.join({ create: true });
      setIsJoined(true);
    } catch (err) {
      toast.error("Failed to join call");
      console.error(err);
    }
  };

  const handleStartTest = async () => {
    try {
      await updateStatus({ testId, status: "live" });
      toast.success("Test is now LIVE");
    } catch (err) {
      toast.error("Failed to start test");
    }
  };

  const handleEndTest = async () => {
    try {
      await updateStatus({ testId, status: "completed" });
      toast.success("Test marked as COMPLETED");
      router.push("/test");
    } catch (err) {
      toast.error("Failed to end test");
    }
  };

  // --- LOADING / ERROR STATES ---
  if (test === undefined || !client || !call) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (test === null) return <div>Test Not Found</div>;

  if (!isProctor && !test.isRegistered) return <div>Access Denied</div>;

  // --- RENDER ---
  return (
    <StreamVideo client={client}>
      <div className="container mx-auto p-4 lg:p-8 min-h-screen flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {test.title}
              </h1>
              <Badge
                variant={test.status === "live" ? "destructive" : "outline"}
              >
                {test.status?.toUpperCase() || "SCHEDULED"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Topic: {test.topic} • Duration: {test.durationMinutes} mins
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
                <Button onClick={handleEndTest} variant="destructive">
                  End Session
                </Button>
              )}
            </div>
          )}
        </div>

        {/* MAIN VIDEO AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          <Card className="lg:col-span-2 flex flex-col bg-slate-950 border-slate-800 overflow-hidden">
            <CardContent className="flex-1 p-0 flex flex-col">
              {/* SCENARIO 1: LIVE AND JOINED */}
              {isJoined ? (
                <StreamTheme className="h-full w-full">
                  <StreamCall call={call}>
                    <div className="h-[500px] w-full flex flex-col">
                      <SpeakerLayout />
                      <CallControls onLeave={() => setIsJoined(false)} />
                    </div>
                  </StreamCall>
                </StreamTheme>
              ) : (
                /* SCENARIO 2: WAITING OR NOT JOINED YET */
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  {test.status === "scheduled" ? (
                    <div className="text-center space-y-4 p-8">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <Video className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Waiting for Host
                      </h3>
                      <p className="text-slate-400">
                        The proctor has not started the session.
                      </p>
                    </div>
                  ) : test.status === "live" ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-500">
                        <Video className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Live Session Active
                      </h3>
                      <Button
                        onClick={handleJoinCall}
                        className="mt-4 bg-green-600 hover:bg-green-700"
                      >
                        Join Video Call
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-white">Session Ended</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SIDEBAR */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Keep your existing sidebar content here */}
              <p className="text-muted-foreground text-sm">
                Participant: {user?.fullName}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StreamVideo>
  );
}

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
export const dynamic = "force-dynamic";

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
} from "lucide-react";
import { toast } from "sonner";
import { Id, Doc } from "../../convex/_generated/dataModel";

// --- TYPE DEFINITIONS ---
// We explicitly define this to match your schema's optional fields
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
      toast.success("Registered successfully!");
    } catch (error) {
      toast.error("Failed to register");
    }
  };

  // Loading State
  if (
    availableTests === undefined ||
    upcomingTests === undefined ||
    pastTests === undefined
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-10 space-y-12">
      {/* --- PROCTOR SWITCHER --- */}
      {isProctor && (
        <div className="flex justify-end mb-6">
          <Link href="/test/proctor">
            <Button variant="destructive" className="gap-2">
              <ShieldAlert className="w-4 h-4" /> Go to Proctor Dashboard
            </Button>
          </Link>
        </div>
      )}

      {/* --- SECTION 1: UPCOMING INTERVIEWS --- */}
      <section>
        <h2 className="text-3xl font-display mb-6">My Scheduled Interviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTests.length === 0 && (
            <div className="col-span-full text-center py-10 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                No upcoming interviews scheduled.
              </p>
            </div>
          )}
          {upcomingTests.map((test) =>
            // FIXED: Added check for 'test' existence to prevent passing null to TestCard
            test ? (
              <TestCard key={test._id} test={test} type="upcoming" />
            ) : null
          )}
        </div>
      </section>

      {/* --- SECTION 2: OPEN REGISTRATIONS --- */}
      <section>
        <h2 className="text-3xl font-display mb-6">Open Slots</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">
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
        <h2 className="text-3xl font-display mb-6">History</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastTests.map((test) =>
            test ? <TestCard key={test._id} test={test} type="past" /> : null
          )}
        </div>
      </section>
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

  // Use status check safe for optional strings
  const isLive = test.status === "live";

  return (
    <Card
      className={`flex flex-col h-full ${
        type === "past" ? "opacity-75 bg-muted/30" : ""
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={isLive ? "destructive" : "outline"} className="mb-2">
            {isLive ? "LIVE NOW" : test.domain}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground">
            {test.durationMinutes} mins
          </span>
        </div>
        <CardTitle className="text-xl">{test.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{test.topic}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {new Date(test.startTime).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {new Date(test.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="w-4 h-4 text-primary" />
          Max Points: {test.maxPoints}
        </div>
        {type === "past" && test.myScore !== undefined && (
          <div className="mt-2 p-2 bg-primary/10 rounded-md text-center font-bold text-primary">
            Score: {test.myScore} / {test.maxPoints}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        {type === "register" && (
          <Button onClick={onRegister} className="w-full" variant="secondary">
            Register Slot
          </Button>
        )}

        {type === "upcoming" && (
          <div className="w-full">
            {isTimeReached || isLive ? (
              // THIS LINK NOW GOES TO THE LIVE MEETING PAGE
              <Link
                href={`/test/interview/${test._id}`}
                className="w-full block"
              >
                <Button
                  className="w-full"
                  variant={isLive ? "destructive" : "default"}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isLive ? "Join Live Session" : "Join Waiting Room"}
                </Button>
              </Link>
            ) : (
              <Button className="w-full" disabled variant="outline">
                Starts at{" "}
                {new Date(test.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

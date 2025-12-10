"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
  ArrowRight,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Id, Doc } from "../../../convex/_generated/dataModel";

// --- TYPE DEFINITIONS ---
type TestWithScore = Doc<"tests"> & { myScore?: number };

export default function TestPage() {
  const { user, isLoaded } = useUser();

  // 1. Get the email from .env.local
  const proctorEmail = process.env.NEXT_PUBLIC_PROCTOR_EMAIL;

  // 2. Strict Check: Only true if Loaded AND Email exists AND matches
  const isProctor =
    isLoaded &&
    !!proctorEmail &&
    user?.primaryEmailAddress?.emailAddress === proctorEmail;

  // Fetch Data
  const availableTests = useQuery(api.tests.getAvailableTests);
  const upcomingTests = useQuery(api.tests.getUpcomingTests);
  const pastTests = useQuery(api.tests.getPastTests);

  const register = useMutation(api.tests.registerForTest);

  const handleRegister = async (testId: Id<"tests">) => {
    try {
      await register({ testId });
      toast.success("Registered successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to register");
    }
  };

  // --- LOADING STATE ---
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
      {/* --- PROCTOR DASHBOARD BUTTON --- */}
      {/* This block ONLY renders if isProctor is true */}
      {isProctor && (
        <div className="flex justify-end mb-6">
          <Link href="/test/proctor">
            <Button variant="destructive" className="gap-2">
              <ShieldAlert className="w-4 h-4" />
              Proctor Dashboard
            </Button>
          </Link>
        </div>
      )}

      {/* ... Rest of your sections (Upcoming, Register, Past) ... */}

      {/* --- SECTION 1: UPCOMING TESTS --- */}
      <section>
        <h2 className="text-3xl font-display mb-6">Upcoming Tests</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTests.length === 0 && (
            <div className="col-span-full text-center py-10 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                You havent registered for any upcoming tests.
              </p>
            </div>
          )}
          {upcomingTests.map((test) => (
            <TestCard key={test._id} test={test} type="upcoming" />
          ))}
        </div>
      </section>

      {/* --- SECTION 2: REGISTER --- */}
      <section>
        <h2 className="text-3xl font-display mb-6">Register for Tests</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.length === 0 && (
            <div className="col-span-full text-center py-10 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                No new tests available at the moment.
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

      {/* --- SECTION 3: PREVIOUS TESTS --- */}
      <section>
        <h2 className="text-3xl font-display mb-6">Previous Tests</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastTests.length === 0 && (
            <p className="text-muted-foreground col-span-full">
              No past test history found.
            </p>
          )}
          {pastTests.map((test) =>
            test ? <TestCard key={test._id} test={test} type="past" /> : null
          )}
        </div>
      </section>
    </div>
  );
}

// --- REUSABLE CARD COMPONENT ---
// (Keep your TestCard component exactly as it was)
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

  const isTimeReached = now ? now >= test.startTime : false;

  const formattedDate = new Date(test.startTime).toLocaleDateString();
  const formattedTime = new Date(test.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className={`flex flex-col h-full ${type === "past" ? "opacity-75 bg-muted/30" : ""}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="mb-2">
            {test.domain}
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
          {formattedDate}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {formattedTime}
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
            Register Now
          </Button>
        )}

        {type === "upcoming" && (
          <div className="w-full">
            {isTimeReached ? (
              <Link href={`/test/${test._id}`} className="w-full block">
                <Button className="w-full">
                  Enter Test <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button className="w-full" disabled variant="outline">
                Starts at {formattedTime}
              </Button>
            )}
          </div>
        )}

        {type === "past" && (
          <Button variant="outline" className="w-full" disabled>
            Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

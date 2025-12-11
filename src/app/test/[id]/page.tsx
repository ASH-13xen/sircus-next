"use client";

import LoaderUI from "@/components/LoaderUI";
import TestHeader from "@/components/test/TestHeader";
import TestWorkspace from "@/components/test/TestWorkspace";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

function TestPage() {
  const { id } = useParams();

  // 1. Fetch the specific Test/Assessment details
  // const testData = useQuery(api.tests.getTestById, { id });

  // MOCK DATA for now
  const testData = {
    title: "Frontend Developer Assessment",
    duration: 3600, // 1 hour in seconds
    questions: ["two-sum", "reverse-string"], // IDs of questions
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!testData) return <LoaderUI />;

  if (isSubmitted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">Assessment Submitted!</h1>
        <p className="text-muted-foreground">
          Thank you for participating. We will review your code shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toaster />

      {/* HEADER: Timer & Submit */}
      <TestHeader
        testTitle={testData.title}
        duration={testData.duration}
        onTimeout={() => setIsSubmitted(true)}
        onSubmit={() => setIsSubmitted(true)}
      />

      {/* MAIN WORKSPACE */}
      <div className="flex-1 overflow-hidden">
        <TestWorkspace questions={testData.questions} />
      </div>
    </div>
  );
}
export default TestPage;

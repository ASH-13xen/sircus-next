"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

export default function GradePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [score, setScore] = useState("");

  // NOTE: You need to create a mutation `finalizeTest` in convex/tests.ts
  // that updates the score AND sets status to "completed"
  // For now, let's assume you will create it.
  const finalizeTest = useMutation(api.tests.finalizeTestResult);

  const handleSubmit = async () => {
    try {
      await finalizeTest({
        testId: id as Id<"tests">,
        score: parseInt(score),
      });
      toast.success("Graded successfully!");
      router.push("/test/proctor");
    } catch (error) {
      toast.error("Failed to submit grade");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Grade Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Score (0-100)</label>
            <Input
              type="number"
              max={100}
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Submit & Complete Interview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

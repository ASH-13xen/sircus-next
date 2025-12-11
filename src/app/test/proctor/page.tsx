"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Video, Calendar, Clock, PlusCircle } from "lucide-react";

export default function ProctorDashboard() {
  const createTest = useMutation(api.tests.createTest);

  // NOTE: You need to create this query in your backend to fetch tests created by this user
  const myTests = useQuery(api.tests.getMyHostedTests) || [];

  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    topic: "",
    date: "",
    time: "",
    duration: "60",
    maxPoints: "100",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTimeString = `${formData.date}T${formData.time}`;
      const startTime = new Date(dateTimeString).getTime();

      await createTest({
        title: formData.title,
        domain: formData.domain,
        topic: formData.topic,
        startTime,
        durationMinutes: parseInt(formData.duration),
        maxPoints: parseInt(formData.maxPoints),
        status: "scheduled", // Default status
      });

      toast.success("Interview Slot Created Successfully");
      // Reset form logic here if needed
    } catch (error) {
      toast.error("Failed to create test");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-12">
      {/* --- SECTION 1: CREATE INTERVIEW --- */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Schedule New Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. Senior Frontend Viva"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              {/* Simplified other fields for brevity, keep your original fields here */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Domain"
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Topic"
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Duration (min)"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Max Pts"
                  value={formData.maxPoints}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPoints: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Schedule Interview
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* --- SECTION 2: UPCOMING INTERVIEWS (HOSTED BY ME) --- */}
      <div>
        <h2 className="text-3xl font-bold mb-6">My Scheduled Interviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTests.length === 0 && (
            <p className="text-muted-foreground">
              No interviews scheduled yet.
            </p>
          )}

          {myTests.map((test) => (
            <Card
              key={test._id}
              className={test.status === "completed" ? "opacity-60" : ""}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Badge
                    variant={test.status === "live" ? "destructive" : "outline"}
                  >
                    {test.status === "live" ? "LIVE NOW" : test.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {test.durationMinutes}m
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{test.title}</CardTitle>
                <CardDescription>
                  {new Date(test.startTime).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                {test.status !== "completed" ? (
                  <Link href={`/test/interview/${test._id}`} className="w-full">
                    <Button
                      className="w-full gap-2"
                      variant={
                        test.status === "live" ? "destructive" : "default"
                      }
                    >
                      <Video className="w-4 h-4" />
                      {test.status === "live"
                        ? "Rejoin Meeting"
                        : "Launch Meeting"}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Interview Completed
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

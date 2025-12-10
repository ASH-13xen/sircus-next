"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming you use sonner or similar
import { useRouter } from "next/navigation";

export default function ProctorDashboard() {
  const createTest = useMutation(api.tests.createTest);
  const router = useRouter();

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
      // Combine Date and Time into Unix Timestamp
      const dateTimeString = `${formData.date}T${formData.time}`;
      const startTime = new Date(dateTimeString).getTime();

      await createTest({
        title: formData.title,
        domain: formData.domain,
        topic: formData.topic,
        startTime,
        durationMinutes: parseInt(formData.duration),
        maxPoints: parseInt(formData.maxPoints),
      });

      toast.success("Test Created Successfully");
      router.push("/test");
    } catch (error) {
      toast.error("Failed to create test");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Test Title</Label>
              <Input
                placeholder="e.g. Advanced React Patterns"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Domain</Label>
                <Input
                  placeholder="e.g. Frontend"
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Topic</Label>
                <Input
                  placeholder="e.g. React Hooks"
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  required
                />
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Duration (mins)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Max Points</Label>
                <Input
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPoints: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Test
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Clock, Code2, Send } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils"; // You'll need a helper to format seconds to MM:SS
import toast from "react-hot-toast";

interface TestHeaderProps {
  testTitle: string;
  duration: number;
  onTimeout: () => void;
  onSubmit: () => void;
}

function TestHeader({
  testTitle,
  duration,
  onTimeout,
  onSubmit,
}: TestHeaderProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const handleSubmit = () => {
    const confirm = window.confirm(
      "Are you sure you want to submit? You cannot undo this."
    );
    if (confirm) onSubmit();
  };

  return (
    <div className="h-16 border-b bg-muted/20 flex items-center justify-between px-6 shrink-0">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Code2 className="size-5 text-primary" />
        </div>
        <h1 className="font-semibold text-lg">{testTitle}</h1>
      </div>

      {/* Timer */}
      <div
        className={`flex items-center gap-2 font-mono text-xl font-medium ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-foreground"}`}
      >
        <Clock className="size-5" />
        {Math.floor(timeLeft / 60)
          .toString()
          .padStart(2, "0")}
        :{(timeLeft % 60).toString().padStart(2, "0")}
      </div>

      {/* Actions */}
      <Button
        onClick={handleSubmit}
        size="lg"
        className="bg-green-600 hover:bg-green-700"
      >
        <Send className="size-4 mr-2" /> Submit Test
      </Button>
    </div>
  );
}
export default TestHeader;

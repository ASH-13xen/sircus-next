"use client";

import { Doc } from "../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Video, Code2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import useMeetingActions from "@/hooks/useMeetingActions"; // Assuming you have this from before

interface MeetingCardProps {
  interview: Doc<"interviews">;
}

function MeetingCard({ interview }: MeetingCardProps) {
  const router = useRouter();
  const { joinMeeting } = useMeetingActions();

  // 1. Calculate status color
  const getStatusColor = () => {
    switch (interview.status) {
      case "completed":
        return "text-green-500";
      case "succeeded":
        return "text-green-600";
      case "failed":
        return "text-red-500";
      default:
        return "text-primary";
    }
  };

  // 2. Handle Navigation based on Type
  const handleJoin = () => {
    if (interview.status === "completed") return;

    if (interview.type === "test") {
      // ROUTE TO TEST PAGE (Using Database ID)
      router.push(`/test/${interview._id}`);
    } else {
      // ROUTE TO MEETING PAGE (Using Stream Call ID)
      if (interview.streamCallId) {
        joinMeeting(interview.streamCallId);
      } else {
        // Fallback if no Stream ID (shouldn't happen for interviews)
        router.push(`/meeting/${interview._id}`);
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{interview.title}</CardTitle>
            <CardDescription>
              Created at {format(new Date(interview._creationTime), "PPP")}
            </CardDescription>
          </div>

          {/* TYPE BADGE */}
          <Badge variant={interview.type === "test" ? "secondary" : "default"}>
            {interview.type === "test" ? (
              <div className="flex items-center gap-1">
                <Code2 className="size-3" /> Test
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Video className="size-3" /> Interview
              </div>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(interview.startTime), "MMM dd, hh:mm a")}
          </div>
          <div
            className={`flex items-center gap-1 font-medium ${getStatusColor()} capitalize`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {interview.status}
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleJoin}
          disabled={
            interview.status === "completed" ||
            interview.status === "succeeded" ||
            interview.status === "failed"
          }
          variant={interview.type === "test" ? "outline" : "default"}
        >
          {interview.status === "completed"
            ? "Completed"
            : interview.type === "test"
              ? "Start Assessment"
              : "Join Meeting"}
        </Button>
      </CardContent>
    </Card>
  );
}
export default MeetingCard;

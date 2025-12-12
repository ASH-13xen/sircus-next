"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react"; // Added useQuery
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code2,
  Brain,
  Terminal,
  Shield,
  Loader2,
  Lock,
  Clock,
} from "lucide-react"; // Added icons

// ... SKILLS array (Keep existing) ...
const SKILLS = [
  {
    id: "web-development",
    name: "Web Development",
    icon: Code2,
    color: "text-blue-500",
  },
  {
    id: "dsa",
    name: "Data Structures",
    icon: Terminal,
    color: "text-green-500",
  },
  { id: "aiml", name: "AI & ML", icon: Brain, color: "text-purple-500" },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: Shield,
    color: "text-red-500",
  },
];

export default function PerformPage() {
  const createTest = useMutation(api.perform.createPerformTest);
  const router = useRouter();

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("javascript");
  const [isCreating, setIsCreating] = useState(false);

  // --- NEW: Check Cooldown Status ---
  // Only runs when a skill is selected (modal is open)
  const cooldownStatus = useQuery(
    api.perform.checkCooldown,
    selectedSkill ? { skill: selectedSkill } : "skip"
  );

  const handleStartTest = async () => {
    if (!selectedSkill) return;
    setIsCreating(true);
    try {
      const testId = await createTest({
        skill: selectedSkill,
        language: selectedLanguage,
      });
      router.push(`/perform/${testId}`);
    } catch (error) {
      console.error(error);
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      {/* ... (Keep existing Header & Cards Grid) ... */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">Skill Assessment Center</h1>
        <p className="text-muted-foreground">
          Select a domain. Answer 5/6 questions to pass.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SKILLS.map((skill) => (
          <Card
            key={skill.id}
            className="hover:border-primary cursor-pointer transition-all hover:scale-105"
            onClick={() => setSelectedSkill(skill.id)}
          >
            <CardHeader className="text-center">
              <skill.icon className={`w-12 h-12 mx-auto mb-4 ${skill.color}`} />
              <CardTitle>{skill.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                Take Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LANGUAGE SELECTION MODAL */}
      <Dialog
        open={!!selectedSkill}
        onOpenChange={(open) => !open && setSelectedSkill(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSkill ? (
                <span className="capitalize">
                  {selectedSkill.replace("-", " ")} Assessment
                </span>
              ) : (
                "Select Language"
              )}
            </DialogTitle>
          </DialogHeader>

          {/* LOADING STATE (While checking cooldown) */}
          {cooldownStatus === undefined ? (
            <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Checking eligibility...</p>
            </div>
          ) : (
            <>
              {/* If Cooldown Active: Show Warning */}
              {!cooldownStatus.allowed ? (
                <div className="py-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-600">
                      Cooldown Active
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      You have recently taken this assessment. To ensure fair
                      grading, please wait before retaking.
                    </p>
                  </div>
                </div>
              ) : (
                /* If Allowed: Show Language Selector */
                <div className="py-4">
                  <label className="text-sm font-medium mb-2 block">
                    Select Language
                  </label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedSkill(null)}
                >
                  Cancel
                </Button>

                {/* CONDITIONAL BUTTON */}
                {!cooldownStatus.allowed ? (
                  <Button
                    disabled
                    className="bg-slate-200 text-slate-500 cursor-not-allowed border-slate-300"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Available in {cooldownStatus.daysRemaining} days
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartTest}
                    disabled={isCreating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isCreating ? (
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    ) : null}
                    Start Test
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

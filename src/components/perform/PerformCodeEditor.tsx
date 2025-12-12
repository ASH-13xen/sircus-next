/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useMutation, useQuery, useAction } from "convex/react"; // <--- ADD useAction
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Play,
  Loader2,
  CheckCircle2,
  RefreshCcw,
  Terminal,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PerformEditorProps {
  testId: Id<"perform_tests">;
}

export default function PerformCodeEditor({ testId }: PerformEditorProps) {
  const testData = useQuery(api.perform.getPerformTest, { testId });
  const saveCode = useMutation(api.perform.saveQuestionCode);
  const markSolved = useMutation(api.perform.markQuestionSolved);

  // *** NEW: Import the Action ***
  const executeCode = useAction(api.perform.runCode);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [localCode, setLocalCode] = useState("// Loading...");
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "console">("problem");

  // --- 1. SYNC CODE ON QUESTION SWITCH ---
  useEffect(() => {
    if (testData && testData.questions[currentQIndex]) {
      const q = testData.questions[currentQIndex];
      setLocalCode(q.userCode || q.starterCode);
      setOutput(null);
      setActiveTab("problem");
    }
  }, [currentQIndex, testData]);

  // --- 2. DEBOUNCED AUTO-SAVE ---
  useEffect(() => {
    if (!testData) return;
    const timer = setTimeout(() => {
      const currentQ = testData.questions[currentQIndex];
      if (localCode !== currentQ.userCode) {
        saveCode({ testId, questionIndex: currentQIndex, code: localCode });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localCode, currentQIndex, testId, testData, saveCode]);

  // --- 3. RESET CODE HANDLER ---
  const handleReset = () => {
    if (!testData) return;
    const starter = testData.questions[currentQIndex].starterCode;
    setLocalCode(starter);
    toast.info("Code reset to starter template");
  };

  // --- 4. RUN CODE HANDLER (UPDATED) ---
  const runAndSubmit = async () => {
    setIsRunning(true);
    setActiveTab("console");
    setOutput("Executing script on secure server...");

    try {
      // *** FIX: Call the Convex Action instead of fetch ***
      if (!testData) return;
      const runOutput = await executeCode({
        language:
          (testData.language === "javascript"
            ? "javascript"
            : testData.language) || "javascript",
        code: localCode,
      });

      setOutput(runOutput);

      // Simple Check: If output doesn't contain "Error", mark solved
      // (In production, you'd want to check specific outputs)
      if (
        !runOutput.toLowerCase().includes("error") &&
        !runOutput.toLowerCase().includes("exception")
      ) {
        await markSolved({
          testId,
          questionIndex: currentQIndex,
          isSolved: true,
        });
        toast.success(`Question ${currentQIndex + 1} Passed!`, {
          icon: <CheckCircle2 className="text-green-500" />,
        });
      } else {
        toast.error("Execution Error. Check console.");
      }
    } catch (err) {
      setOutput("Error: Server execution failed. Please try again.");
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  if (!testData)
    return (
      <div className="p-8 text-white flex items-center gap-2">
        <Loader2 className="animate-spin" /> Loading Environment...
      </div>
    );

  const currentQuestion = testData.questions[currentQIndex];

  // ... (Rest of the JSX Return statement remains exactly the same) ...
  return (
    <div className="flex h-full gap-4 font-sans">
      {/* --- LEFT: QUESTION NAVIGATOR --- */}
      <div className="w-16 flex flex-col items-center py-4 gap-3 bg-[#0f1117] border-r border-slate-800">
        {testData.questions.map((q: any, idx: number) => (
          <button
            key={q.id}
            onClick={() => setCurrentQIndex(idx)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all relative group",
              currentQIndex === idx
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-110"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white",
              q.isSolved &&
                currentQIndex !== idx &&
                "bg-emerald-900/50 text-emerald-400 border border-emerald-500/30"
            )}
          >
            {q.isSolved ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}

            {/* Tooltip */}
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 border border-slate-700">
              {q.title}
            </span>
          </button>
        ))}
      </div>

      {/* --- CENTER: PROBLEM & CODE --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* LEFT PANE: DESCRIPTION & CONSOLE */}
        <div className="flex flex-col bg-[#0f1117] rounded-xl border border-slate-800 overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-slate-800 bg-[#0b0d12]">
            <button
              onClick={() => setActiveTab("problem")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-r border-slate-800",
                activeTab === "problem"
                  ? "bg-[#0f1117] text-blue-400 border-t-2 border-t-blue-500"
                  : "text-slate-500 hover:bg-slate-900"
              )}
            >
              <FileText className="w-4 h-4" /> Description
            </button>
            <button
              onClick={() => setActiveTab("console")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-r border-slate-800",
                activeTab === "console"
                  ? "bg-[#0f1117] text-green-400 border-t-2 border-t-green-500"
                  : "text-slate-500 hover:bg-slate-900"
              )}
            >
              <Terminal className="w-4 h-4" /> Output
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "problem" ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {currentQuestion.title}
                    </h2>
                    {currentQuestion.isSolved ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Solved
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-slate-500 border-slate-700"
                      >
                        Unsolved
                      </Badge>
                    )}
                  </div>
                  <div className="h-1 w-20 bg-blue-600 rounded-full" />
                </div>

                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                  <p className="leading-relaxed">
                    {currentQuestion.description}
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> Note
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ensure your code handles edge cases. Output should be
                    returned or printed as specified.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col animate-in fade-in duration-300">
                <div className="flex-1 bg-black rounded-lg p-4 font-mono text-sm border border-slate-800 overflow-auto shadow-inner">
                  {output ? (
                    <pre
                      className={cn(
                        "whitespace-pre-wrap",
                        output.includes("Error")
                          ? "text-red-400"
                          : "text-green-400"
                      )}
                    >
                      {output}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                      <Terminal className="w-10 h-10 opacity-20" />
                      <p>Run your code to see output here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: CODE EDITOR */}
        <div className="flex flex-col bg-[#0f1117] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#0b0d12] border-b border-slate-800">
            <span className="text-xs font-mono text-slate-500 uppercase bg-slate-800/50 px-2 py-1 rounded">
              {testData.language}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <RefreshCcw className="w-3 h-3 mr-1.5" /> Reset
              </Button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={
                testData.language === "javascript"
                  ? "javascript"
                  : testData.language
              }
              value={localCode}
              onChange={(val) => setLocalCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineHeight: 24,
                padding: { top: 16 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />
          </div>

          {/* Bottom Actions */}
          <div className="p-4 bg-[#0b0d12] border-t border-slate-800 flex pr-200">
            <Button
              onClick={runAndSubmit}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all hover:scale-105"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current " /> Run Code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

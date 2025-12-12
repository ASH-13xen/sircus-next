/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RotateCcw,
  Code,
  Loader2,
  Play,
  Send,
  Terminal,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  testId: Id<"tests">;
  isProctor?: boolean;
}

// Map your dropdown values to Piston API versions
const LANGUAGE_VERSIONS: Record<string, string> = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  c: "10.2.0",
  cpp: "10.2.0",
};

export default function CodeEditor({
  testId,
  isProctor = false,
}: CodeEditorProps) {
  const test = useQuery(api.tests.getTestById, { testId });

  // Mutations
  const updateCode = useMutation(api.tests.updateCode);
  const updateQuestion = useMutation(api.tests.updateQuestion);
  const updateOutput = useMutation(api.tests.updateOutput);
  const submitTest = useMutation(api.tests.submitTest);

  // Local State
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Loading environment...");
  const [question, setQuestion] = useState("Loading question...");
  const [output, setOutput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // --- SYNC LOGIC ---
  useEffect(() => {
    if (test) {
      if (test.language) setLanguage(test.language);

      if (test.currentCode) {
        if (isProctor) {
          setCode(test.currentCode);
        } else if (!isTyping && code === "// Loading environment...") {
          setCode(test.currentCode);
        }
      }

      if (test.question) {
        if (!isProctor || question === "Loading question...") {
          setQuestion(test.question);
        }
      }

      if (test.output !== undefined) {
        setOutput(test.output);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, isProctor]);

  // --- HANDLERS ---
  const handleCodeChange = (value: string | undefined) => {
    if (value === undefined || isProctor) return;
    setCode(value);
    setIsTyping(true);
    updateCode({ testId, code: value, language }).then(() =>
      setIsTyping(false)
    );
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isProctor) return;
    setQuestion(e.target.value);
    updateQuestion({ testId, question: e.target.value });
  };

  // --- REAL CODE EXECUTION ---
  const handleRunCode = async () => {
    if (isProctor) return;

    setIsRunning(true);
    const loadingMsg = "Running code...";
    setOutput(loadingMsg);
    await updateOutput({ testId, output: loadingMsg });

    try {
      // 1. Prepare payload for Piston API
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language,
          version: LANGUAGE_VERSIONS[language],
          files: [{ content: code }],
        }),
      });

      const data = await response.json();

      // 2. Check for API errors
      if (data.message) {
        throw new Error(data.message);
      }

      // 3. Extract Output (Result or Error)
      // Piston returns 'stdout' (success) and 'stderr' (errors)
      let result = "";
      if (data.run.output) {
        result = data.run.output;
      } else {
        result = data.run.stderr || "No output returned.";
      }

      // 4. Update Database (So Proctor sees it too)
      await updateOutput({ testId, output: result });
      toast.success("Executed successfully");
    } catch (error: any) {
      const errorMsg = `Execution Error: ${error.message || "Failed to run code"}`;
      await updateOutput({ testId, output: errorMsg });
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearConsole = () => {
    if (!isProctor) {
      updateOutput({ testId, output: "" });
    }
  };

  const handleSubmit = () => {
    toast.success("Test submitted successfully!");
    submitTest({ testId });
  };

  if (!test) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 bg-[#0b1021]">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading Environment...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0b1021] text-white">
      {/* ================= TOP PANEL: QUESTION ================= */}
      <div className="h-[35%] min-h-[150px] flex flex-col border-b border-slate-800 bg-[#0b1021]">
        <div className="px-4 py-2 border-b border-slate-800 bg-[#02040a] flex items-center justify-between h-[45px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-300">
              Problem Statement
            </span>
            {isProctor && (
              <span className="text-[10px] uppercase bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                Editable
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {isProctor ? (
            <textarea
              className="w-full h-full bg-slate-900/50 text-slate-300 p-3 rounded-md border border-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans text-sm leading-relaxed"
              value={question}
              onChange={handleQuestionChange}
              placeholder="Type the interview question here..."
            />
          ) : (
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {test.question || "Waiting for problem statement..."}
            </div>
          )}
        </div>
      </div>

      {/* ================= MIDDLE PANEL: EDITOR ================= */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#02040a] h-[50px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Code className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-sm">Editor</span>
            </div>

            <Select
              value={language}
              onValueChange={(val) => !isProctor && setLanguage(val)}
              disabled={isProctor}
            >
              <SelectTrigger className="w-[120px] h-7 bg-slate-900 border-slate-700 text-xs">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isProctor ? (
            <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 animate-pulse">
              ● LIVE VIEWING
            </span>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCode("// Resetting...\n")}
                className="h-7 text-xs text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-3 h-3 mr-2" /> Reset
              </Button>

              <Button
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning}
                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isRunning ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <Play className="w-3 h-3 mr-2" />
                )}
                Run
              </Button>

              <Button
                size="sm"
                onClick={handleSubmit}
                className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-3 h-3 mr-2" /> Submit
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 relative min-h-0">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={handleCodeChange}
            options={{
              readOnly: isProctor,
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
              fontFamily: "'JetBrains Mono', monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* ================= BOTTOM PANEL: CONSOLE ================= */}
      <div className="h-[25%] min-h-[120px] bg-[#02040a] border-t border-slate-800 flex flex-col">
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#0b1021] border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-3 h-3" />
            <span className="text-xs font-mono font-bold">CONSOLE</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-slate-500 hover:text-white disabled:opacity-30"
            onClick={handleClearConsole}
            disabled={isProctor}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex-1 p-3 overflow-auto font-mono text-sm">
          {output ? (
            <pre className="text-slate-300 whitespace-pre-wrap">{output}</pre>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <Play className="w-8 h-8 mb-2 opacity-20" />
              <span className="text-xs">
                {isProctor ? "Waiting for output..." : "Run code to see output"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

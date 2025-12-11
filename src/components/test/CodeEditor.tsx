/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Piston API mapping
const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
};

interface CodeEditorProps {
  testId: Id<"tests">;
  isProctor: boolean;
}

export default function CodeEditor({ testId, isProctor }: CodeEditorProps) {
  // 1. Convex Hooks
  const testData = useQuery(api.tests.getTestById, { testId });
  const saveCode = useMutation(api.tests.updateCode);
  const setProblem = useMutation(api.tests.setProblem);

  // 2. Local State for Debouncing (Fixes the Lag)
  const [localCode, setLocalCode] = useState<string>("// Loading...");
  const [localProblem, setLocalProblem] = useState<string>(""); // <--- NEW LOCAL STATE

  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Defaults
  const language = testData?.language || "python";

  // 3. Sync Remote Data to Local State (On Load)
  useEffect(() => {
    if (testData) {
      // Sync Code (only if empty or loading to prevent overwriting user)
      if (localCode === "// Loading..." || localCode === "") {
        setLocalCode(testData.currentCode || "# Start coding here...");
      }

      // Sync Problem Statement (only if empty to prevent overwriting user)
      if (localProblem === "") {
        setLocalProblem(testData.problemStatement || "");
      }
    }
  }, [testData, localCode, localProblem]);

  // 4. DEBOUNCED SAVE: CODE
  useEffect(() => {
    if (!testData) return;

    const timer = setTimeout(() => {
      if (localCode !== testData.currentCode) {
        saveCode({ testId, code: localCode, language }).then(() => {
          setLastSaved(new Date());
        });
      }
    }, 1000); // Saves 1 second after typing stops

    return () => clearTimeout(timer);
  }, [localCode, testId, saveCode, language, testData]);

  // 5. DEBOUNCED SAVE: PROBLEM STATEMENT (Fixes the TextArea Lag)
  useEffect(() => {
    if (!testData) return;

    // Don't save if it hasn't changed from DB value
    if (localProblem === testData.problemStatement) return;

    const timer = setTimeout(() => {
      setProblem({ testId, problem: localProblem });
    }, 1000); // Saves 1 second after typing stops

    return () => clearTimeout(timer);
  }, [localProblem, testId, setProblem, testData]);

  // 6. Handlers
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) setLocalCode(value);
  };

  const handleProblemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalProblem(e.target.value); // Instant UI update
  };

  const handleLanguageChange = (newLang: string) => {
    saveCode({ testId, code: localCode, language: newLang });
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language === "cpp" ? "c++" : language,
          version:
            LANGUAGE_VERSIONS[language as keyof typeof LANGUAGE_VERSIONS],
          files: [{ content: localCode }],
        }),
      });

      const data = await response.json();
      if (data.run.stderr) {
        setOutput(`Error:\n${data.run.stderr}`);
      } else {
        setOutput(data.run.stdout);
      }
    } catch (error) {
      toast.error("Failed to execute code");
      setOutput("Execution failed due to network error.");
    } finally {
      setIsRunning(false);
    }
  };

  if (!testData)
    return (
      <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-slate-400">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading Editor...
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white rounded-md overflow-hidden border border-slate-700 shadow-xl">
      {/* TOOLBAR */}
      <div className="flex justify-between items-center p-2 bg-[#2d2d2d] border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Select
            value={language}
            onValueChange={handleLanguageChange}
            disabled={!isProctor && testData.status === "completed"}
          >
            <SelectTrigger className="w-[120px] bg-slate-700 border-none text-white h-8 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-xs text-slate-500 flex items-center gap-1">
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Unsaved"}
          </span>
        </div>

        <Button
          size="sm"
          onClick={runCode}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs gap-2"
        >
          {isRunning ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Play className="w-3 h-3" />
          )}
          Run
        </Button>
      </div>

      {/* PROBLEM STATEMENT AREA */}
      <div className="p-3 bg-slate-800 border-b border-slate-700 text-sm">
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold text-slate-400 text-xs uppercase tracking-wider">
            Problem Statement
          </p>
        </div>

        {isProctor ? (
          <textarea
            className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-xs text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
            rows={2}
            value={localProblem} // Use Local State
            onChange={handleProblemChange} // Use Local Handler
            placeholder="Type the interview question here..."
          />
        ) : (
          <p className="text-slate-200 text-sm whitespace-pre-wrap">
            {localProblem}
          </p>
        )}
      </div>

      {/* EDITOR */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={localCode} // Use Local State
          onChange={handleEditorChange} // Use Local Handler
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            readOnly: testData.status !== "live",
          }}
        />
      </div>

      {/* OUTPUT CONSOLE */}
      <div className="h-[30%] min-h-[150px] bg-black border-t border-slate-700 p-3 font-mono text-xs overflow-auto">
        <p className="text-slate-500 mb-2 uppercase tracking-wider font-semibold border-b border-slate-800 pb-1">
          Terminal Output
        </p>
        {output ? (
          <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
        ) : (
          <span className="text-slate-600 italic">
            Result will appear here...
          </span>
        )}
      </div>
    </div>
  );
}

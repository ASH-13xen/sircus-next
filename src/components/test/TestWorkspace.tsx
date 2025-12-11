/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizeable";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Play, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";

interface TestWorkspaceProps {
  questions: string[]; // List of Question IDs
}

function TestWorkspace({ questions }: TestWorkspaceProps) {
  // Filter constants to only show questions assigned to this test
  const testQuestions = CODING_QUESTIONS.filter((q) =>
    questions.includes(q.id)
  );

  const [activeQuestion, setActiveQuestion] = useState(testQuestions[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java">(
    "javascript"
  );
  const [code, setCode] = useState(activeQuestion.starterCode[language]);

  // State for Test Case Results
  const [testResults, setTestResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("description");

  const handleRunCode = () => {
    // 1. MOCK execution logic
    // In real app: Send code + questionID to backend -> Judge0/Piston API

    toast.loading("Running test cases...");

    setTimeout(() => {
      toast.dismiss();
      // Simulate results
      const mockResults = [
        {
          id: 1,
          status: "passed",
          input: "[2,7,11,15], 9",
          expected: "[0,1]",
          actual: "[0,1]",
        },
        {
          id: 2,
          status: "passed",
          input: "[3,2,4], 6",
          expected: "[1,2]",
          actual: "[1,2]",
        },
        {
          id: 3,
          status: "failed",
          input: "[3,3], 6",
          expected: "[0,1]",
          actual: "null",
        },
      ];
      setTestResults(mockResults);
      setActiveTab("testcases"); // Auto switch to results tab
      toast.error("1 Test Case Failed");
    }, 1500);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* LEFT PANEL: QUESTION DESCRIPTION */}
      <ResizablePanel defaultSize={40} minSize={25} maxSize={50}>
        <div className="h-full flex flex-col border-r">
          {/* Question Navigator */}
          <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
            <Select
              value={activeQuestion.id}
              onValueChange={(val) => {
                const q = testQuestions.find((q) => q.id === val)!;
                setActiveQuestion(q);
                setCode(q.starterCode[language]);
                setTestResults([]); // Clear previous results
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Question" />
              </SelectTrigger>
              <SelectContent>
                {testQuestions.map((q, idx) => (
                  <SelectItem key={q.id} value={q.id}>
                    {idx + 1}. {q.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-4 pt-2">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="testcases" className="relative">
                  Test Results
                  {testResults.length > 0 && (
                    <span className="ml-2 flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="description"
              className="flex-1 overflow-hidden h-full mt-2"
            >
              <ScrollArea className="h-full px-6 pb-6">
                <div className="prose prose-sm dark:prose-invert max-w-none pt-4">
                  <h2 className="text-2xl font-bold">{activeQuestion.title}</h2>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {activeQuestion.description}
                  </p>

                  <h3 className="font-semibold mt-6 mb-2">Examples</h3>
                  {activeQuestion.examples.map((ex, i) => (
                    <Card key={i} className="mb-4 bg-muted/40">
                      <CardContent className="p-3 text-xs font-mono">
                        <div>
                          <span className="font-bold text-muted-foreground">
                            In:
                          </span>{" "}
                          {ex.input}
                        </div>
                        <div>
                          <span className="font-bold text-muted-foreground">
                            Out:
                          </span>{" "}
                          {ex.output}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="testcases"
              className="flex-1 overflow-hidden h-full mt-2"
            >
              <ScrollArea className="h-full px-6 pb-6 pt-4">
                {testResults.length === 0 ? (
                  <div className="text-center text-muted-foreground mt-20">
                    <Play className="size-10 mx-auto mb-4 opacity-20" />
                    <p>Run your code to see test results</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result, i) => (
                      <Card
                        key={i}
                        className={`border-l-4 ${result.status === "passed" ? "border-l-green-500" : "border-l-red-500"}`}
                      >
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {result.status === "passed" ? (
                              <CheckCircle2 className="size-4 text-green-500" />
                            ) : (
                              <XCircle className="size-4 text-red-500" />
                            )}
                            Test Case {i + 1}
                          </CardTitle>
                          <span
                            className={`text-xs font-bold uppercase ${result.status === "passed" ? "text-green-500" : "text-red-500"}`}
                          >
                            {result.status}
                          </span>
                        </CardHeader>
                        <CardContent className="py-3 px-4 bg-muted/20 border-t text-xs font-mono space-y-1">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-16">
                              Input:
                            </span>
                            <span>{result.input}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-16">
                              Expected:
                            </span>
                            <span>{result.expected}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-16">
                              Output:
                            </span>
                            <span
                              className={
                                result.status === "failed" ? "text-red-400" : ""
                              }
                            >
                              {result.actual}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* RIGHT PANEL: CODE EDITOR */}
      <ResizablePanel defaultSize={60}>
        <div className="h-full flex flex-col">
          {/* Editor Toolbar */}
          <div className="h-12 border-b flex items-center justify-between px-4 bg-background">
            <Select
              value={language}
              onValueChange={(val: any) => setLanguage(val)}
            >
              <SelectTrigger className="w-[150px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button size="sm" onClick={handleRunCode} className="h-8">
              <Play className="size-3.5 mr-2" /> Run Code
            </Button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default TestWorkspace;

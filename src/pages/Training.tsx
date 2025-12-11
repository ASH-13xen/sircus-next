/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Globe,
  ShieldAlert,
  BrainCircuit,
  Cpu,
  Server,
  Play,
  ArrowLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";

// ==========================================
// 1. MOCK DATA STRUCTURE
// ==========================================

type Difficulty = "Easy" | "Medium" | "Hard";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  time: string;
  questions: Question[];
}

interface Subject {
  id: string;
  title: string;
  icon: any;
  color: string; // Tailwind text color class
  bg: string; // Tailwind bg color class
  border: string; // Tailwind border color class
  topics: Topic[];
}

const SUBJECT_DATA: Record<string, Subject> = {
  DSA: {
    id: "DSA",
    title: "Data Structures & Algo",
    icon: Terminal,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    topics: [
      {
        id: "dsa-arrays",
        title: "Arrays & Strings",
        description: "Sliding window, two pointers, and string manipulation.",
        difficulty: "Easy",
        time: "15 Mins",
        questions: [
          {
            id: 1,
            text: "What is the time complexity to access an element in an array?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
            correctAnswer: 0,
          },
          {
            id: 2,
            text: "Which string operation is immutable in Java/Python?",
            options: ["Append", "Modification", "Concat", "Slice"],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: "dsa-trees",
        title: "Trees & Graphs",
        description: "BFS, DFS, Binary Search Trees and traversals.",
        difficulty: "Hard",
        time: "25 Mins",
        questions: [
          {
            id: 1,
            text: "In a BST, the left child is always...",
            options: [
              "Larger than root",
              "Smaller than root",
              "Equal to root",
              "Random",
            ],
            correctAnswer: 1,
          },
          {
            id: 2,
            text: "Which traversal visits the root node last?",
            options: ["Pre-order", "In-order", "Post-order", "Level-order"],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },
  Web: {
    id: "Web",
    title: "Web Development",
    icon: Globe,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    topics: [
      {
        id: "web-react",
        title: "React Fundamentals",
        description: "Hooks, State Management, and Lifecycle methods.",
        difficulty: "Medium",
        time: "20 Mins",
        questions: [
          {
            id: 1,
            text: "Which hook is used for side effects?",
            options: ["useState", "useEffect", "useContext", "useReducer"],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: "web-css",
        title: "CSS Layouts",
        description: "Flexbox, Grid, and Responsive Design.",
        difficulty: "Easy",
        time: "15 Mins",
        questions: [
          {
            id: 1,
            text: "Which property changes the axis in Flexbox?",
            options: [
              "justify-content",
              "align-items",
              "flex-direction",
              "flex-wrap",
            ],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },
  Security: {
    id: "Security",
    title: "Cyber Security",
    icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    topics: [
      {
        id: "sec-owasp",
        title: "OWASP Top 10",
        description: "Injection, Broken Auth, and XSS.",
        difficulty: "Hard",
        time: "30 Mins",
        questions: [
          {
            id: 1,
            text: "What protects against SQL Injection?",
            options: ["Prepared Statements", "HTTPS", "Firewalls", "Hashing"],
            correctAnswer: 0,
          },
        ],
      },
    ],
  },
  AI: {
    id: "AI",
    title: "AI & Machine Learning",
    icon: BrainCircuit,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    topics: [
      {
        id: "ai-basics",
        title: "ML Basics",
        description: "Supervised vs Unsupervised learning.",
        difficulty: "Medium",
        time: "20 Mins",
        questions: [
          {
            id: 1,
            text: "Which is a supervised learning algorithm?",
            options: ["K-Means", "Linear Regression", "Apriori", "PCA"],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
  Aptitude: {
    id: "Aptitude",
    title: "General Aptitude",
    icon: Cpu,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    topics: [
      {
        id: "apt-logic",
        title: "Logical Reasoning",
        description: "Patterns, Blood Relations, and Syllogisms.",
        difficulty: "Medium",
        time: "20 Mins",
        questions: [
          {
            id: 1,
            text: "Find the odd one out: 3, 5, 7, 9",
            options: ["3", "5", "7", "9"],
            correctAnswer: 3,
          },
        ],
      },
    ],
  },
  System: {
    id: "System",
    title: "System Design",
    icon: Server,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    topics: [], // Empty to simulate locked/coming soon
  },
};

// ==========================================
// 2. QUIZ ENGINE COMPONENT
// ==========================================

function QuizEngine({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (selectedOption === topic.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion < topic.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const percentage = Math.round((score / topic.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto pt-10">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Topics
        </Button>
        <Card className="bg-[#0b1021] border-slate-800 text-white">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
              {percentage >= 70 ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500" />
              )}
            </div>
            <h2 className="text-3xl font-bold">Test Completed!</h2>
            <div className="py-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-6xl font-bold text-blue-500">{score}</span>
              <span className="text-2xl text-slate-500">
                {" "}
                / {topic.questions.length}
              </span>
              <p className="mt-2 text-sm text-slate-400 uppercase tracking-widest">
                Your Score
              </p>
            </div>
            <Button
              onClick={onBack}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Return to Modules
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-white pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Exit Test
        </Button>
        <div className="text-sm font-medium text-slate-500">
          Question {currentQuestion + 1} of {topic.questions.length}
        </div>
      </div>

      <Card className="bg-[#0b1021] border-slate-800 text-white">
        <CardContent className="p-8">
          <h2 className="text-2xl font-medium mb-8 leading-relaxed">
            {topic.questions[currentQuestion].text}
          </h2>
          <div className="grid gap-4 mb-8">
            {topic.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3
                        ${
                          selectedOption === index
                            ? "bg-blue-600/20 border-blue-500 text-white"
                            : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                        }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border
                            ${selectedOption === index ? "bg-blue-500 border-blue-500 text-white" : "border-slate-600 text-slate-500"}`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {currentQuestion === topic.questions.length - 1
                ? "Finish Test"
                : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// 3. MAIN TRAINING PAGE
// ==========================================

export default function TrainingPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // --- VIEW 3: QUIZ MODE ---
  if (selectedTopic && selectedSubject) {
    return (
      <div className="min-h-screen bg-[#02040a] p-6 text-slate-200">
        <QuizEngine
          topic={selectedTopic}
          onBack={() => setSelectedTopic(null)} // Go back to topic list
        />
      </div>
    );
  }

  // --- VIEW 2: TOPIC LIST (e.g., Inside "Data Structures") ---
  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-[#02040a] p-6 text-slate-200">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedSubject(null)}
              className="text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <selectedSubject.icon
                  className={`w-6 h-6 ${selectedSubject.color}`}
                />
                {selectedSubject.title}
              </h1>
              <p className="text-slate-500">
                Select a module to begin your assessment
              </p>
            </div>
          </div>

          {/* Empty State */}
          {selectedSubject.topics.length === 0 && (
            <div className="text-center py-20 bg-[#0b1021] border border-slate-800 rounded-2xl border-dashed">
              <p className="text-slate-500">
                No modules available for this subject yet.
              </p>
              <Button variant="link" onClick={() => setSelectedSubject(null)}>
                Go Back
              </Button>
            </div>
          )}

          {/* Topic List Grid */}
          <div className="grid gap-4">
            {selectedSubject.topics.map((topic) => (
              <div
                key={topic.id}
                className="group bg-[#0b1021] border border-slate-800 hover:border-blue-500/40 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all shadow-lg hover:shadow-blue-900/10"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`
                                    ${topic.difficulty === "Easy" ? "border-green-500/30 text-green-400 bg-green-500/10" : ""}
                                    ${topic.difficulty === "Medium" ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" : ""}
                                    ${topic.difficulty === "Hard" ? "border-red-500/30 text-red-400 bg-red-500/10" : ""}
                                `}
                    >
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm">{topic.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />{" "}
                      {topic.questions.length} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {topic.time}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedTopic(topic)}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                >
                  Start Test <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 1: SUBJECT DASHBOARD ---
  return (
    <div className="min-h-screen text-slate-200 p-8 pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Mock Test <span className="text-blue-500">Arena</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Choose a domain to view available tests and skill assessments.
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(SUBJECT_DATA).map((subject) => (
            <div
              key={subject.id}
              className={`relative bg-[#0b1021] border border-slate-800 rounded-2xl p-6 transition-all duration-300 group
                ${subject.topics.length === 0 ? "opacity-60 cursor-not-allowed" : "hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer"}
              `}
              onClick={() => {
                if (subject.topics.length > 0) setSelectedSubject(subject);
              }}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${subject.bg} border ${subject.border}`}
              >
                <subject.icon className={`w-6 h-6 ${subject.color}`} />
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-white mb-2">
                {subject.title}
              </h3>
              <p className="text-slate-400 text-sm mb-6 h-10">
                {subject.topics.length > 0
                  ? `${subject.topics.length} modules available including ${subject.topics[0].title}.`
                  : "New modules coming soon."}
              </p>

              {/* Action Text */}
              <div
                className={`flex items-center text-sm font-medium ${subject.topics.length > 0 ? "text-blue-500 group-hover:translate-x-1 transition-transform" : "text-slate-500"}`}
              >
                {subject.topics.length > 0 ? "View Topics" : "Locked"}
                {subject.topics.length > 0 && (
                  <ChevronRight className="w-4 h-4 ml-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import BuyPremiumButton from "@/components/BuyPremiumButton";
import {
  ArrowRight,
  Shield,
  Code,
  Database,
  Brain,
  BookOpen,
  Layers,
  Lock,
  X,
  Send,
  Tent,
  MessageSquare,
  Bot,
} from "lucide-react";

const subjects = [
  {
    name: "Data Structures",
    route: "/learn/dsa",
    icon: Database,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    description: "Master the fundamentals of efficient coding.",
  },
  {
    name: "Web Development",
    route: "/learn/webdev",
    icon: Code,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    description: "Build modern, responsive web applications.",
  },
  {
    name: "Cyber Security",
    route: "/learn/cyber",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    description: "Protect systems from digital attacks.",
  },
  {
    name: "AI & ML",
    route: "/learn/aiml",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    description: "Explore the future of intelligence.",
  },
  {
    name: "Aptitude",
    route: "/learn/aptitude",
    icon: BookOpen,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    description: "Sharpen your logical reasoning skills.",
    isPremium: true,
  },
  {
    name: "System Design",
    route: "",
    icon: Layers,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    description: "Coming soon.",
    disabled: true,
  },
];

const LearnPage = () => {
  const userData = useQuery(api.users.getUserProfile);

  // --- CHATBOT STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the arena! I am RingMaster. Select a path above or ask me for guidance.",
      sender: "bot",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: inputMsg, sender: "user" },
    ]);
    setInputMsg("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm analyzing your request... (Demo Mode)",
          sender: "bot",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#02040a] relative isolate font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Grid Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 rounded-full blur-[100px] -z-10" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Header Section */}
      <div className="max-w-6xl mx-auto pt-16 pb-12 px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Learning{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Paths
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Select a domain to start your journey. Each path is curated to take
          you from beginner to advanced mastery.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-24">
        {subjects.map((subject, idx) => {
          const isLocked = subject.isPremium && !userData?.isPremium;
          const Icon = subject.icon;

          // --- CASE 1: LOCKED CARD (Premium) ---
          if (isLocked) {
            return (
              <div
                key={idx}
                className="group relative h-full p-1 rounded-2xl bg-gradient-to-b from-yellow-500/20 to-transparent shadow-lg shadow-yellow-900/10"
              >
                <div className="h-full bg-[#0b1021] rounded-xl p-6 relative overflow-hidden flex flex-col border border-yellow-500/30">
                  {/* Golden Glow Effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <Lock className="w-6 h-6 text-yellow-400" />
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded border border-yellow-500/50 text-yellow-400 bg-yellow-500/10 tracking-wider">
                        Premium
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-2 text-white">
                      {subject.name}
                    </h2>
                    <p className="text-slate-400 text-sm mb-6 flex-grow">
                      Unlock exclusive access to advanced Aptitude & Reasoning
                      modules.
                    </p>

                    <div className="mt-auto w-full pt-4 border-t border-slate-800">
                      <BuyPremiumButton />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // --- CASE 2: NORMAL / DISABLED CARD ---
          const CardContent = (
            <div
              className={`
              h-full p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden flex flex-col
              ${
                subject.disabled
                  ? "bg-[#0b1021] border-slate-800 opacity-60 cursor-not-allowed"
                  : "bg-[#0b1021] border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10"
              }
            `}
            >
              {/* Hover Gradient */}
              {!subject.disabled && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Box */}
                <div
                  className={`mb-5 p-3 w-fit rounded-lg border ${subject.bg} ${subject.border} ${subject.disabled ? "grayscale opacity-50" : ""}`}
                >
                  <Icon className={`w-6 h-6 ${subject.color}`} />
                </div>

                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {subject.name}
                </h2>

                <p className="text-slate-400 text-sm flex-grow mb-6 leading-relaxed">
                  {subject.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                  {subject.disabled ? (
                    <span className="text-slate-600 uppercase tracking-widest text-[10px] font-bold border border-slate-800 px-2 py-1 rounded">
                      In Development
                    </span>
                  ) : (
                    <span className="text-blue-400 text-sm font-medium flex items-center group-hover:text-blue-300 transition-colors">
                      Start Learning{" "}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );

          return subject.disabled ? (
            <div key={idx}>{CardContent}</div>
          ) : (
            <Link key={idx} href={subject.route} className="block h-full">
              {CardContent}
            </Link>
          );
        })}
      </div>

      {/* ======================================================= */}
      {/* RINGMASTER CHATBOT COMPONENT (Styled as Tech Comms)     */}
      {/* ======================================================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* Chat Window */}
        {isChatOpen && (
          <div className="w-[320px] sm:w-[380px] h-[500px] bg-[#0b1021] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 backdrop-blur-md">
            {/* Header */}
            <div className="p-4 bg-slate-900/80 border-b border-slate-700 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Tent className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">
                    RingMaster <span className="text-blue-500">AI</span>
                  </h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    SYSTEM ONLINE
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b1021] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type your query..."
                className="flex-1 bg-[#02040a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 transition-all"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="group relative w-14 h-14 rounded-full bg-black-600 hover:bg-blue-500 border border-blue-400/50 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 flex items-center justify-center overflow-hidden z-40"
        >
          {isChatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              {/* RingMaster Icon (Tent/Bot) */}
              <Tent className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" />

              {/* Notification Dot */}
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-pulse" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LearnPage;

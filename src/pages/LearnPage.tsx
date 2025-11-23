"use client"; 

import React from "react";
import { ArrowRight, Shield, Code, Database, Brain, BookOpen, Layers } from "lucide-react";


 import Link from "next/link";


const subjects = [
  { 
    name: "Data Structures & Algo", 
    route: "/learn/dsa", 
    icon: <Database className="w-6 h-6 text-blue-400" />,
    description: "Master the fundamentals of efficient coding."
  },
  { 
    name: "Web Development", 
    route: "/learn/webdev", 
    icon: <Code className="w-6 h-6 text-emerald-400" />,
    description: "Build modern, responsive web applications."
  },
  { 
    name: "Cyber Security", 
    route: "/learn/cyber", 
    icon: <Shield className="w-6 h-6 text-red-400" />,
    description: "Protect systems from digital attacks."
  },
  { 
    name: "AI & ML", 
    route: "/learn/aiml", 
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    description: "Explore the future of intelligence."
  },
  { 
    name: "Aptitude", 
    route: "/learn/aptitude", 
    icon: <BookOpen className="w-6 h-6 text-yellow-400" />,
    description: "Sharpen your logical reasoning skills."
  },
  { 
    name: "System Design", 
    route: "", 
    icon: <Layers className="w-6 h-6 text-gray-500" />,
    description: "Coming soon.",
    disabled: true
  },
];

const LearnPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-12 pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Learning Paths
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Select a domain to start your journey. Each path is curated to take you from beginner to advanced.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, idx) => {
          // Define the card content
          const CardContent = (
            <div className={`
              h-full p-6 rounded-xl border transition-all duration-300 group relative overflow-hidden
              ${subject.disabled 
                ? "bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed" 
                : "bg-slate-900/80 border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 backdrop-blur-md"
              }
            `}>
              {/* Hover Gradient Effect */}
              {!subject.disabled && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 p-3 bg-slate-800/50 w-fit rounded-lg border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                  {subject.icon}
                </div>
                
                <h2 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-blue-200 transition-colors">
                  {subject.name}
                </h2>
                
                <p className="text-slate-400 text-sm flex-grow mb-6">
                  {subject.description}
                </p>

                <div className="flex items-center text-sm font-medium">
                  {subject.disabled ? (
                    <span className="text-slate-600 uppercase tracking-wider text-xs font-bold">In Development</span>
                  ) : (
                    <span className="text-blue-400 flex items-center group-hover:text-blue-300">
                      Start Learning <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );

          // Render Link for active items, plain div for disabled items
          return subject.disabled ? (
            <div key={idx}>{CardContent}</div>
          ) : (
            <Link key={idx} href={subject.route} className="block h-full">
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LearnPage;
"use client";

import React from "react";
import { 
  ArrowRight, Box, Type, GitCommit, Layers, Network, 
  Share2, Hash, Search, ArrowUpDown, RefreshCw, Cpu 
} from "lucide-react";

// --- ⚠️ INSTRUCTION FOR REAL PROJECT ⚠️ ---
// 1. Uncomment the line below:
import Link from "next/link";
// 2. Delete the "MockLink" component definition below.



const dsaTopics = {
  "Data Structures": [
    { name: "Arrays", route: "/learn/dsa/arrays", icon: <Box className="text-blue-400" /> },
    { name: "Strings", route: "/learn/dsa/strings", icon: <Type className="text-pink-400" /> },
    { name: "Linked Lists", route: "/learn/dsa/linked-lists", icon: <GitCommit className="text-green-400" /> },
    { name: "Stacks & Queues", route: "/learn/dsa/stacks-queues", icon: <Layers className="text-purple-400" /> },
    { name: "Trees", route: "/learn/dsa/trees", icon: <Network className="text-emerald-400" /> },
    { name: "Graphs", route: "/learn/dsa/graphs", icon: <Share2 className="text-orange-400" /> },
    { name: "Hash Tables", route: "/learn/dsa/hash-tables", icon: <Hash className="text-yellow-400" /> },
  ],
  "Algorithms": [
    { name: "Searching Algorithms", route: "/learn/dsa/searching", icon: <Search className="text-cyan-400" /> },
    { name: "Sorting Algorithms", route: "/learn/dsa/sorting", icon: <ArrowUpDown className="text-indigo-400" /> },
    { name: "Recursion", route: "/learn/dsa/recursion", icon: <RefreshCw className="text-rose-400" /> },
    { name: "Dynamic Programming", route: "/learn/dsa/dp", icon: <Cpu className="text-violet-400" /> },
  ],
};

const dsa = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Main Header */}
      <div className="max-w-6xl mx-auto mb-12 pt-8 text-center sm:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Data Structures & Algorithms
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          The core building blocks of software engineering. Master these to write efficient, scalable code.
        </p>
      </div>

      {/* Loop through the categories (Data Structures, Algorithms) */}
      <div className="max-w-6xl mx-auto space-y-16">
        {Object.entries(dsaTopics).map(([category, topics]) => (
          <section key={category}>
            
            {/* Section Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4 flex items-center">
              {category}
              <span className="ml-4 text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {topics.length} Topics
              </span>
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topics.map((topic, idx) => (
                <Link key={idx} href={topic.route} className="block group h-full">
                  <div className="h-full p-5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                        {React.cloneElement(topic.icon, { className: `w-6 h-6 ${topic.icon.props.className}` })}
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-200 transition-colors mb-1">
                      {topic.name}
                    </h3>
                    
                    <div className="mt-auto pt-4">
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-0 group-hover:w-full transition-all duration-700 ease-out" />
                      </div>
                    </div>
                  
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default dsa;
import React from 'react';

const DPPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Dynamic Programming (DP)
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg leading-relaxed mb-12 text-slate-200">
          Dynamic Programming is an optimization technique for solving complex problems by breaking them down into simpler sub-problems. It is used when the sub-problems overlap.
        </p>

        {/* Key Concepts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Key Concepts
          </h2>
          <ul className="space-y-4 list-none">
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Overlapping Subproblems:</span>
              <span>A problem has overlapping subproblems if it can be broken down into subproblems that are reused several times. DP solves each subproblem only once.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Optimal Substructure:</span>
              <span>A problem has optimal substructure if an optimal solution can be constructed from optimal solutions of its subproblems.</span>
            </li>
          </ul>
        </div>

        {/* Techniques Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Two Common DP Techniques
          </h2>
          <ul className="space-y-4 list-none">
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Memoization (Top-Down):</span>
              <span>The function is written recursively, but results of subproblems are stored in a cache (e.g., a hash map or array) to avoid re-computation.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Tabulation (Bottom-Up):</span>
              <span>The solution is built iteratively from the smallest subproblem up to the main problem, storing results in a table (e.g., an array or matrix).</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default DPPage;
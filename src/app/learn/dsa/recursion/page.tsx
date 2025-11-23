import React from 'react';

const RecursionPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Recursion
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg leading-relaxed mb-12 text-slate-200">
          Recursion is a programming technique where a function calls itself to solve a problem. It breaks down a problem into smaller, identical sub-problems until it reaches a simple case that can be solved directly.
        </p>

        {/* Visualization of Recursion */}
        [Image of recursion stack trace diagram]

        {/* Key Concepts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Key Concepts
          </h2>
          <ul className="space-y-4 list-none">
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Base Case:</span>
              <span>The condition that stops the recursion. Without a base case, a recursive function would call itself indefinitely, causing a stack overflow.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Recursive Step:</span>
              <span>The part of the function where it calls itself, but with a modified input that moves it closer to the base case.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Call Stack:</span>
              <span>Each function call is placed on the call stack, and memory is consumed for each call.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default RecursionPage;
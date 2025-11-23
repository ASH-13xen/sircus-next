import React from 'react';

const HashTablesPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Hash Tables
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg leading-relaxed mb-12 text-slate-200">
          A Hash Table is a data structure that maps keys to values for highly efficient lookup. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.
        </p>

        {/* Key Concepts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Key Concepts
          </h2>
          <ul className="space-y-4 list-none">
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Key-Value Pairs:</span>
              <span>Data is stored as pairs, where a unique key maps to a value.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Hash Function:</span>
              <span>A function that takes a key and computes a consistent index (a "hash") in the underlying array.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">Collision:</span>
              <span>Occurs when two different keys hash to the same index. This is handled using techniques like Chaining or Open Addressing.</span>
            </li>
          </ul>
        </div>

        {/* Complexity Analysis Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Complexity Analysis (Average Case)
          </h2>
          
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-blue-400">
                  <th className="p-4 font-bold border-b border-slate-700">Operation</th>
                  <th className="p-4 font-bold border-b border-slate-700">Time Complexity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Search</td>
                  <td className="p-4 font-mono text-pink-400">O(1)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Insertion</td>
                  <td className="p-4 font-mono text-pink-400">O(1)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Deletion</td>
                  <td className="p-4 font-mono text-pink-400">O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HashTablesPage;
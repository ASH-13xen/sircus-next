import React from 'react';

const StacksQueuesPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Stacks & Queues
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg leading-relaxed mb-12 text-slate-200">
          Stacks and Queues are linear data structures that restrict how elements can be added and removed. They are often implemented using Arrays or Linked Lists.
        </p>

        [Image of stack vs queue data structure diagram]

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Stack Card */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
              Stack (LIFO)
            </h2>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Follows the <strong>Last-In, First-Out</strong> principle. Think of a stack of plates; you take the top one off first.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span><b>Push:</b> Add to top</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span><b>Pop:</b> Remove from top</span>
              </li>
            </ul>
          </div>

          {/* Queue Card */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
              Queue (FIFO)
            </h2>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Follows the <strong>First-In, First-Out</strong> principle. Think of a checkout line; the first person in is the first served.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                <span><b>Enqueue:</b> Add to back</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                <span><b>Dequeue:</b> Remove from front</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Complexity Analysis Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Complexity Analysis (Both)
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
                  <td className="p-4 text-slate-300">Access / Search</td>
                  <td className="p-4 font-mono text-pink-400">O(n)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Insertion (Push / Enqueue)</td>
                  <td className="p-4 font-mono text-emerald-400">O(1)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Deletion (Pop / Dequeue)</td>
                  <td className="p-4 font-mono text-emerald-400">O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StacksQueuesPage;
import React from 'react';

const SortingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Sorting Algorithms
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg leading-relaxed mb-12 text-slate-200">
          Sorting algorithms are used to rearrange elements of a list in a specific order (e.g., ascending or descending). Different algorithms have different performance characteristics depending on the data size and order.
        </p>

        [Image of visualization of sorting algorithms]

        {/* Sorting Table Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Common Sorting Algorithms
          </h2>
          
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-blue-400">
                  <th className="p-4 font-bold border-b border-slate-700">Algorithm</th>
                  <th className="p-4 font-bold border-b border-slate-700">Best/Avg Time</th>
                  <th className="p-4 font-bold border-b border-slate-700">Worst Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300 font-medium">Bubble Sort</td>
                  <td className="p-4 font-mono text-red-400">O(n²)</td>
                  <td className="p-4 font-mono text-red-400">O(n²)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300 font-medium">Selection Sort</td>
                  <td className="p-4 font-mono text-red-400">O(n²)</td>
                  <td className="p-4 font-mono text-red-400">O(n²)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300 font-medium">Insertion Sort</td>
                  <td className="p-4 font-mono text-yellow-400">O(n) / O(n²)</td>
                  <td className="p-4 font-mono text-red-400">O(n²)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300 font-medium">Merge Sort</td>
                  <td className="p-4 font-mono text-emerald-400">O(n log n)</td>
                  <td className="p-4 font-mono text-emerald-400">O(n log n)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300 font-medium">Quick Sort</td>
                  <td className="p-4 font-mono text-emerald-400">O(n log n)</td>
                  <td className="p-4 font-mono text-red-400">O(n²)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SortingPage;
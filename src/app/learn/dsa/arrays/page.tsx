import React from "react";

const ArraysPage = () => {
  const codeExample = `let fruits = ["Apple", "Banana", "Cherry"];

// Accessing elements
console.log(fruits[0]); // Output: Apple

// Adding an element to the end
fruits.push("Date");

// Removing an element from the end
fruits.pop();

// Iterating over an array
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Arrays
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg leading-relaxed mb-12 text-slate-200">
          An array is a fundamental data structure that stores a collection of
          elements of the same type in a contiguous block of memory. Each element
          is identified by an index or a key. In JavaScript, arrays are
          zero-indexed, meaning the first element is at index 0.
        </p>

        {/* Key Concepts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Key Concepts
          </h2>
          <ul className="space-y-4 list-none">
            <li className="flex items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap">Contiguous Memory:</span>
              <span>Elements are stored next to each other, which allows for fast access.</span>
            </li>
            <li className="flex items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap">Random Access:</span>
              <span>Any element can be accessed directly using its index in O(1) time.</span>
            </li>
            <li className="flex items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap">Dynamic Size:</span>
              <span>In languages like JavaScript and Python, arrays can grow or shrink in size.</span>
            </li>
          </ul>
        </div>

        {/* Code Example Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Code Example (JavaScript)
          </h2>
          <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-2xl">
            {/* Fake Window Controls */}
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-emerald-400">
              <code>{codeExample}</code>
            </pre>
          </div>
        </div>

        {/* Complexity Analysis Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Complexity Analysis
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
                  <td className="p-4 text-slate-300">Access</td>
                  <td className="p-4 font-mono text-pink-400">O(1)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Search</td>
                  <td className="p-4 font-mono text-pink-400">O(n)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Insertion (at end)</td>
                  <td className="p-4 font-mono text-pink-400">O(1)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Insertion (at beginning)</td>
                  <td className="p-4 font-mono text-pink-400">O(n)</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-300">Deletion</td>
                  <td className="p-4 font-mono text-pink-400">O(n)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArraysPage;
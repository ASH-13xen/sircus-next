import React from 'react';

const SearchingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Searching Algorithms
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg leading-relaxed mb-12 text-slate-200">
          Searching algorithms are used to find a specific item within a collection of items. The choice of algorithm depends on the structure of the data.
        </p>

        {/* Algorithms Section */}
        <div className="space-y-8">
          
          {/* Linear Search Card */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
              Linear Search
            </h2>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Checks every element in the collection one by one until the target is found or the end is reached. Works on unsorted data.
            </p>
            <div className="inline-flex items-center bg-slate-950 border border-slate-700 rounded-lg px-4 py-2">
              <span className="text-sm text-slate-400 mr-2">Time Complexity:</span>
              <span className="font-mono text-pink-400 font-bold">O(n)</span>
            </div>
          </div>

          {/* Binary Search Card */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
              Binary Search
            </h2>
            <p className="text-slate-300 mb-4 leading-relaxed">
              A highly efficient algorithm that repeatedly divides the search interval in half. It requires the collection to be <b>sorted</b>.
            </p>
            <div className="inline-flex items-center bg-slate-950 border border-slate-700 rounded-lg px-4 py-2">
              <span className="text-sm text-slate-400 mr-2">Time Complexity:</span>
              <span className="font-mono text-emerald-400 font-bold">O(log n)</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SearchingPage;
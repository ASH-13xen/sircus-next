import React from "react";

const GraphsPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Graphs
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg leading-relaxed mb-12 text-slate-200">
          A graph is a non-linear data structure consisting of a set of vertices
          (or nodes) and a set of edges connecting these vertices. Graphs are
          used to model networks, like social networks or road maps.
        </p>

        {/* Key Concepts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Key Concepts
          </h2>
          <ul className="space-y-4 list-none">
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">
                Vertex (Node):
              </span>
              <span>A data point in the graph.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">
                Edge:
              </span>
              <span>A connection between two vertices.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">
                Directed vs. Undirected:
              </span>
              <span>
                Edges in a directed graph have a direction (A -&gt; B), while
                edges in an undirected graph do not (A - B).
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">
                Weighted vs. Unweighted:
              </span>
              <span>Edges can have a cost or weight associated with them.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-start bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold mr-3 whitespace-nowrap mb-2 sm:mb-0">
                Adjacency List/Matrix:
              </span>
              <span>
                Two common ways to represent the connections in a graph.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GraphsPage;

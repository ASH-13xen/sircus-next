"use client";

import React from "react";
import { Monitor, Server, Layers } from "lucide-react"; 

// --- ⚠️ INSTRUCTION FOR REAL PROJECT ⚠️ ---
// 1. You should move this "WebDevBar" component to its own file (e.g., src/components/WebDevBar.tsx)
// 2. Import it here using: import WebDevBar from "@/components/WebDevBar";
// 3. Uncomment real Next.js imports for Link/navigation inside that component.

// --- INLINED COMPONENT (To Fix Import Error) ---
const WebDevBar = () => {
  // Mock active state for preview
  const pathname = "/learn/webdev"; 
  const navItems = [
    { name: "HTML", path: "/learn/webdev/html" },
    { name: "CSS", path: "/learn/webdev/css" },
    { name: "JavaScript", path: "/learn/webdev/javascript" },
  ];

  return (
    <div className="w-full flex justify-center py-6">
      <nav className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 backdrop-blur-md rounded-full shadow-xl max-w-3xl w-full mx-4 sm:mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <a 
              key={item.name} 
              href={item.path}
              className={`flex-1 text-center py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${isActive ? "bg-teal-500/10 text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.15)] ring-1 ring-teal-500/50" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"}`}
            >
              {item.name}
            </a>
          );
        })}
      </nav>
    </div>
  );
};
// ------------------------------------------------

const WebDevPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Navigation - Sticky Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <WebDevBar />
      </div>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
        
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12 text-center bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          Web Development
        </h1>

        {/* Section 1 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-teal-400 mb-4 flex items-center">
            <span className="bg-teal-500/10 p-2 rounded mr-3 text-lg">01</span>
            What Does Web Development Do?
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
            <p className="leading-relaxed">
              Web development refers to the creation and maintenance of websites and web applications. It encompasses everything from designing simple static web pages to developing complex dynamic web applications, e-commerce platforms, and content management systems.
            </p>
            <p className="leading-relaxed">
              Web developers work with various programming languages, frameworks, and tools to build user-friendly, responsive, and functional websites that provide a seamless experience for users across different devices and browsers.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-teal-400 mb-6 flex items-center">
            <span className="bg-teal-500/10 p-2 rounded mr-3 text-lg">02</span>
            What Are the Main Types?
          </h2>

          {/* Visualization of Web Development Types */}
          

          {/* Replacement for <Webdevtypesimage /> using a CSS grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-center hover:border-teal-500/50 transition-colors">
              <Monitor className="w-8 h-8 mx-auto text-blue-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Front-End</h3>
              <p className="text-xs text-slate-400">Visuals & Interactivity (HTML, CSS, JS)</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-center hover:border-teal-500/50 transition-colors">
              <Server className="w-8 h-8 mx-auto text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Back-End</h3>
              <p className="text-xs text-slate-400">Server & Database (Python, Node, Java)</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-center hover:border-teal-500/50 transition-colors">
              <Layers className="w-8 h-8 mx-auto text-emerald-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Full-Stack</h3>
              <p className="text-xs text-slate-400">Combined Skills</p>
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <p className="leading-relaxed">
              Web development can be broadly categorized into three main types: Front-end, Back-end, and Full-stack development. Front-end development deals with the visual aspects of a website. Back-end development focuses on server-side operations and databases. Full-stack development combines both skill sets.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-teal-400 mb-4 flex items-center">
            <span className="bg-teal-500/10 p-2 rounded mr-3 text-lg">03</span>
            Is It Easy to Learn?
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <p className="leading-relaxed">
              It depends. Basic HTML/CSS is accessible to beginners, but mastering frameworks and backend logic requires dedication. Continuous learning is essential due to the ever-evolving nature of technology.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-teal-400 mb-4 flex items-center">
            <span className="bg-teal-500/10 p-2 rounded mr-3 text-lg">04</span>
            Career Outlook
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <p className="leading-relaxed">
              The demand for skilled web developers continues to grow. Opportunities exist in tech companies, marketing agencies, healthcare, and finance. It is a dynamic and rewarding career path with high potential for specialization.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold text-teal-400 mb-4 flex items-center">
            <span className="bg-teal-500/10 p-2 rounded mr-3 text-lg">05</span>
            Learning Timeline
          </h2>
          
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
            <p className="leading-relaxed">
              <strong className="text-white">Beginner (3-6 Months):</strong> HTML, CSS, Basic JavaScript.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">Job Ready (1+ Year):</strong> Backend, Databases, Frameworks (React/Next.js), Git.
            </p>
            <p className="leading-relaxed text-sm text-slate-400 mt-4 border-t border-slate-800 pt-4">
              Ultimately, the time required depends on your dedication. Regular practice and building real projects are the fastest ways to learn.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default WebDevPage;
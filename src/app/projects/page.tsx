"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  ExternalLink, 
  PlayCircle, 
  Image as ImageIcon, 
  Layers, 
  Maximize2 
} from "lucide-react";

// --- MOCK DATA TYPE DEFINITION ---
interface Project {
  id: string;
  title: string;
  about: string;
  tech: string[];
  thumbnail: string;
  screenshots: string[];
  video?: string; // URL to video file
  links: {
    demo?: string;
    repo?: string;
  };
}

// --- MOCK DATA (Replace with your DB data) ---
const projects: Project[] = [
  {
    id: "1",
    title: "Nebula - AI Code Assistant",
    about: "A VS Code extension that uses LLMs to predict code patterns and refactor legacy codebases automatically. Features include real-time syntax analysis and context-aware suggestions.",
    tech: ["TypeScript", "Python", "TensorFlow", "VS Code API", "Redis"],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
    links: {
      demo: "https://example.com",
      repo: "https://github.com",
    },
  },
  {
    id: "2",
    title: "CryptoWatch Dashboard",
    about: "Real-time cryptocurrency tracking dashboard featuring live websocket connections for price updates, portfolio analytics, and historical data visualization using D3.js.",
    tech: ["React", "Next.js", "Tailwind CSS", "D3.js", "WebSockets"],
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop",
    screenshots: [
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000"
    ],
    links: {
      repo: "https://github.com",
    },
  },
  {
    id: "3",
    title: "SafeChain - Supply Chain Ledger",
    about: "A decentralized application (dApp) for tracking pharmaceutical supply chains. Ensures authenticity and temperature control compliance via smart contracts.",
    tech: ["Solidity", "Ethereum", "Web3.js", "React", "Node.js"],
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
    screenshots: [],
    links: {
      demo: "https://example.com",
      repo: "https://github.com",
    },
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#02040a] relative isolate pb-20">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/20 rounded-full blur-[100px] -z-10" />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
        style={{
            backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
        }}
      />

      {/* Header */}
      <div className="py-16 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Project <span className="text-blue-500">Showcase</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          A collection of my technical projects, featuring real-world applications, experimental code, and system designs.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 gap-12">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- INDIVIDUAL PROJECT CARD COMPONENT ---
function ProjectCard({ project }: { project: Project }) {
  const [activeMedia, setActiveMedia] = useState<"video" | "image">("image");

  return (
    <div className="bg-[#0b1021] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors duration-300 shadow-2xl flex flex-col lg:flex-row group">
      
      {/* --- LEFT: MEDIA SECTION (Video/Images) --- */}
      <div className="w-full lg:w-2/5 bg-black/50 border-b lg:border-b-0 lg:border-r border-slate-800 relative group-hover:bg-black/30 transition-colors">
        
        {/* Main Media Display */}
        <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-slate-900">
          {project.video && activeMedia === "video" ? (
             <video 
                src={project.video} 
                controls 
                className="w-full h-full object-cover"
                poster={project.thumbnail}
             />
          ) : (
             <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
             />
          )}

          {/* Type Indicator (Top Right) */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-2 border border-white/10">
            {project.video && activeMedia === "video" ? <PlayCircle size={12} className="text-red-500" /> : <ImageIcon size={12} className="text-blue-500" />}
            {project.video && activeMedia === "video" ? "Playing Demo" : "Preview"}
          </div>
        </div>

        {/* Media Controls / Thumbnails Row */}
        <div className="p-4 grid grid-cols-4 gap-2">
           {/* Video Toggle Button */}
           {project.video && (
             <button 
                onClick={() => setActiveMedia("video")}
                className={`col-span-1 aspect-video rounded-lg border flex flex-col items-center justify-center gap-1 transition-all
                  ${activeMedia === "video" ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"}
                `}
             >
                <PlayCircle size={20} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Video</span>
             </button>
           )}

           {/* Screenshot Toggles */}
           {project.screenshots.map((shot, idx) => (
             <button 
                key={idx}
                onClick={() => setActiveMedia("image")} // In real app, you'd set specific image URL
                className={`col-span-1 aspect-video rounded-lg border overflow-hidden relative opacity-70 hover:opacity-100 transition-opacity
                   ${activeMedia === "image" ? "border-blue-500 ring-1 ring-blue-500/50" : "border-slate-700"}
                `}
             >
                <img src={shot} alt="thumbnail" className="w-full h-full object-cover" />
             </button>
           ))}
        </div>
      </div>

      {/* --- RIGHT: CONTENT SECTION --- */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        
        {/* Header: Title & Icons */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {project.title}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Layers size={14} />
                <span>Full Stack Application</span>
            </div>
          </div>
          
          <div className="flex gap-3">
             {project.links.repo && (
                <Button variant="outline" size="sm" className="border-slate-700 bg-transparent text-slate-300 hover:text-white hover:bg-slate-800 gap-2">
                    <Github size={16} /> Code
                </Button>
             )}
             {project.links.demo && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    <ExternalLink size={16} /> Live Demo
                </Button>
             )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">About the project</h3>
            <p className="text-slate-400 leading-relaxed">
                {project.about}
            </p>
        </div>

        {/* Tech Stack (Pushed to bottom) */}
        <div className="mt-auto">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Technologies Built With</h3>
            <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                    <Badge 
                        key={t} 
                        variant="outline" 
                        className="bg-slate-800/50 text-blue-300 border-slate-700 hover:border-blue-500/50 hover:bg-blue-900/10 transition-colors py-1 px-3"
                    >
                        {t}
                    </Badge>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
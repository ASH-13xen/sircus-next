"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have this, otherwise standard input works
import { 
  Github, 
  ExternalLink, 
  PlayCircle, 
  Image as ImageIcon, 
  Layers, 
  Plus,
  Trash2,
  Search,
  X,
  Youtube
} from "lucide-react";

// --- TYPE DEFINITION ---
interface Project {
  id: string;
  title: string;
  about: string;
  tech: string[];
  thumbnail: string;
  screenshots: string[];
  video?: string; 
  links: {
    demo?: string;
    repo?: string;
    youtube?: string; // Added specific youtube link field
  };
}

// --- MOCK DATA ---
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Nebula - AI Code Assistant",
    about: "A VS Code extension that uses LLMs to predict code patterns and refactor legacy codebases automatically.",
    tech: ["TypeScript", "Python", "TensorFlow", "Redis"],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    screenshots: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000"],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    links: { demo: "https://example.com", repo: "https://github.com" },
  },
  {
    id: "2",
    title: "CryptoWatch Dashboard",
    about: "Real-time cryptocurrency tracking dashboard featuring live websocket connections for price updates.",
    tech: ["React", "Next.js", "Tailwind CSS", "WebSockets"],
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop",
    screenshots: [],
    links: { repo: "https://github.com" },
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    tech: "",
    github: "",
    youtube: ""
  });

  // Handle Delete
  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title,
      about: "User submitted project description placeholder.", // Simplified for this demo
      tech: formData.tech.split(",").map(t => t.trim()).filter(t => t), // Split CSV to array
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000", // Default placeholder
      screenshots: [],
      links: {
        repo: formData.github,
        youtube: formData.youtube
      }
    };

    setProjects([newProject, ...projects]);
    setFormData({ title: "", tech: "", github: "", youtube: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#02040a] relative isolate pb-20">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/20 rounded-full blur-[100px] -z-10" />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
      />

      {/* --- HEADER & CONTROLS --- */}
      <div className="container mx-auto px-4 pt-10 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Titles */}
          <div className="text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Project <span className="text-blue-500">Hub</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage and showcase your work</p>
          </div>

          {/* Search & Add Actions */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* User Search Bar */}
            <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full bg-[#0b1021] border border-slate-800 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
            </div>

            {/* Add Button */}
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={18} /> Add Project
            </Button>
          </div>
        </div>
      </div>

      {/* --- PROJECTS GRID --- */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 gap-12">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))
          ) : (
            <div className="text-center text-slate-500 py-20">No projects found. Add one!</div>
          )}
        </div>
      </div>

      {/* --- ADD PROJECT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b1021] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Add New Project</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase">Project Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. AI Dashboard"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase">Technologies Used</label>
                <input 
                  required
                  name="tech"
                  value={formData.tech}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase">GitHub Link</label>
                  <input 
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase">YouTube Link</label>
                  <input 
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 py-6">
                Create Project
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PROJECT CARD COMPONENT ---
function ProjectCard({ project, onDelete }: { project: Project, onDelete: (id: string) => void }) {
  const [activeMedia, setActiveMedia] = useState<"video" | "image">("image");

  return (
    <div className="bg-[#0b1021] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors duration-300 shadow-2xl flex flex-col lg:flex-row group relative">
      
      {/* DELETE BUTTON (Top Right) */}
      <button 
        onClick={() => onDelete(project.id)}
        className="absolute top-4 right-4 z-10 bg-red-500/10 hover:bg-red-500/90 text-red-500 hover:text-white p-2 rounded-full border border-red-500/50 transition-all opacity-0 group-hover:opacity-100"
        title="Delete Project"
      >
        <Trash2 size={16} />
      </button>

      {/* --- LEFT: MEDIA SECTION --- */}
      <div className="w-full lg:w-2/5 bg-black/50 border-b lg:border-b-0 lg:border-r border-slate-800 relative">
        <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-slate-900">
          {/* Display logic: if standard video is present show it, otherwise show img */}
          {project.video && activeMedia === "video" ? (
             <video src={project.video} controls className="w-full h-full object-cover" poster={project.thumbnail} />
          ) : (
             <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-90" />
          )}

          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-2 border border-white/10">
            {project.video && activeMedia === "video" ? "Playing Demo" : "Preview"}
          </div>
        </div>

        {/* Media Controls */}
        <div className="p-4 grid grid-cols-4 gap-2">
           {/* Standard Video Toggle */}
           {project.video && (
             <button 
                onClick={() => setActiveMedia("video")}
                className={`col-span-1 aspect-video rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${activeMedia === "video" ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-700 bg-slate-800/50 text-slate-400"}`}
             >
                <PlayCircle size={20} /> <span className="text-[10px] uppercase font-bold">Video</span>
             </button>
           )}
           {/* YouTube Link Button (opens in new tab as standard video element doesn't play YT) */}
           {project.links.youtube && (
              <a 
                href={project.links.youtube}
                target="_blank"
                rel="noreferrer"
                className="col-span-1 aspect-video rounded-lg border border-red-900/50 bg-red-900/10 text-red-400 hover:bg-red-900/20 flex flex-col items-center justify-center gap-1 transition-all"
              >
                 <Youtube size={20} /> <span className="text-[10px] uppercase font-bold">YouTube</span>
              </a>
           )}
        </div>
      </div>

      {/* --- RIGHT: CONTENT SECTION --- */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pr-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {project.title}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Layers size={14} /> <span>Full Stack Application</span>
            </div>
          </div>
          
          <div className="flex gap-3">
             {project.links.repo && (
                <Button variant="outline" size="sm" asChild className="border-slate-700 bg-transparent text-slate-300 hover:text-white hover:bg-slate-800 gap-2 cursor-pointer">
                    <a href={project.links.repo} target="_blank" rel="noreferrer"><Github size={16} /> Code</a>
                </Button>
             )}
             {project.links.demo && (
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
                    <a href={project.links.demo} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Live</a>
                </Button>
             )}
          </div>
        </div>

        <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">About the project</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{project.about}</p>
        </div>

        <div className="mt-auto">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Technologies Built With</h3>
            <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                    <Badge key={i} variant="outline" className="bg-slate-800/50 text-blue-300 border-slate-700 py-1 px-3">
                        {t}
                    </Badge>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
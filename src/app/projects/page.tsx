"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  ExternalLink, 
  PlayCircle, 
  Plus,
  Trash2,
  Search,
  X,
  Youtube,
  Pencil,
  Loader2
} from "lucide-react";
import { Id } from "@/../convex/_generated/dataModel";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function ProjectsPage() {
  const { user } = useUser();
  
  // --- CONVEX DATA ---
  const projects = useQuery(api.portfolio.getProjectFeed);
  const addProject = useMutation(api.portfolio.addProject);
  const updateProject = useMutation(api.portfolio.editProject);
  const deleteProject = useMutation(api.portfolio.deleteProject);

  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"projects"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech: "",
    github: "",
    youtube: "",
    screenshots: "", // Comma separated URLs
    liveLink: ""
  });

  // --- ACTIONS ---

  const resetForm = () => {
    setFormData({ title: "", description: "", tech: "", github: "", youtube: "", screenshots: "", liveLink: "" });
    setEditingId(null);
  };

  const handleCreateClick = () => {
    if (!user) return toast.error("Please login to add a project");
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setFormData({
        title: project.title,
        description: project.description,
        tech: project.techStack,
        github: project.githubLink || "",
        youtube: project.youtubeLink || "",
        screenshots: project.imageUrls || "",
        liveLink: project.liveLink || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: Id<"projects">) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject({ projectId: id });
        toast.success("Project deleted");
      } catch (err) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      techStack: formData.tech, // Stored as string in DB based on your preference
      githubLink: formData.github,
      youtubeLink: formData.youtube,
      imageUrls: formData.screenshots,
      liveLink: formData.liveLink
    };

    try {
      if (editingId) {
        await updateProject({ projectId: editingId, ...payload });
        toast.success("Project updated!");
      } else {
        await addProject(payload);
        toast.success("Project created!");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // Filter projects by search
  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#02040a] relative isolate pb-20 text-white font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/20 rounded-full blur-[100px] -z-10" />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
      />

      {/* --- HEADER --- */}
      <div className="container mx-auto px-4 pt-10 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Project <span className="text-blue-500">Hub</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage and showcase your work</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search projects or authors..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0b1021] border border-slate-800 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
            </div>
            <Button onClick={handleCreateClick} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={18} /> Add Project
            </Button>
          </div>
        </div>
      </div>

      {/* --- PROJECTS GRID --- */}
      <div className="container mx-auto px-4 max-w-6xl">
        {projects === undefined ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500"/></div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {filteredProjects && filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  currentUserId={user?.id} // Pass Clerk ID to check ownership
                  onDelete={handleDelete}
                  onEdit={handleEdit} 
                />
              ))
            ) : (
              <div className="text-center text-slate-500 py-20">No projects found. Be the first to add one!</div>
            )}
          </div>
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b1021] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">
                {editingId ? "Edit Project" : "Add New Project"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase">Project Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-hidden resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase">Technologies (comma separated)</label>
                <input 
                  required
                  value={formData.tech}
                  onChange={(e) => setFormData({...formData, tech: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase">Screenshots (Image URLs, comma separated)</label>
                <input 
                  value={formData.screenshots}
                  onChange={(e) => setFormData({...formData, screenshots: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase">GitHub Link</label>
                  <input 
                    value={formData.github}
                    onChange={(e) => setFormData({...formData, github: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-hidden"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase">YouTube Link</label>
                  <input 
                    value={formData.youtube}
                    onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>
               
              <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase">Live Demo Link</label>
                  <input 
                    value={formData.liveLink}
                    onChange={(e) => setFormData({...formData, liveLink: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-hidden"
                  />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 py-6">
                {editingId ? "Save Changes" : "Create Project"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PROJECT CARD ---
// --- PROJECT CARD ---
function ProjectCard({ 
  project, 
  currentUserId,
  onDelete, 
  onEdit 
}: { 
  project: any, 
  currentUserId?: string | null,
  onDelete: (id: Id<"projects">) => void,
  onEdit: (project: any) => void 
}) {
  const [activeMedia, setActiveMedia] = useState<"video" | string>("image");

  // Helper to split strings into arrays safely
  const techArray = project.techStack ? project.techStack.split(",").map((t: string) => t.trim()) : [];
  const screenshotArray = project.imageUrls ? project.imageUrls.split(",").map((s: string) => s.trim()).filter((s: string) => s) : [];
  
  // Default Thumbnail
  const thumbnail = screenshotArray.length > 0 ? screenshotArray[0] : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000";

  // Check Ownership
  const isOwner = currentUserId && project.author?.clerkId === currentUserId;

  const getMainMedia = () => {
    // 1. YouTube Video Logic (Basic Embed)
    if (activeMedia === "video" && project.youtubeLink) {
        // Extract ID from URL for embed (Simple implementation)
        const videoId = project.youtubeLink.split("v=")[1]?.split("&")[0] || project.youtubeLink.split("/").pop();
        return <iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-full" allowFullScreen />;
    }
    // 2. Screenshot
    if (activeMedia !== "video" && activeMedia !== "image") {
        return <img src={activeMedia} alt="screenshot" className="w-full h-full object-cover" />;
    }
    // 3. Default
    return <img src={thumbnail} alt={project.title} className="w-full h-full object-cover opacity-90" />;
  };

  return (
    <div className="bg-[#0b1021] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors duration-300 shadow-2xl flex flex-col lg:flex-row group relative">
      
      {/* ACTION BUTTONS (Only if Owner) 
         - Moved to 'left-4' to avoid overlap on the right side.
         - Reduced padding to 'p-1.5' for a smaller footprint.
      */}
      {isOwner && (
        <div className="absolute top-4 left-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button 
                onClick={() => onEdit(project)}
                className="bg-slate-900/80 hover:bg-blue-600 text-slate-200 hover:text-white p-1.5 rounded-lg border border-slate-700 backdrop-blur-md transition-colors"
                title="Edit Project"
            >
                <Pencil size={14} />
            </button>
            <button 
                onClick={() => onDelete(project._id)}
                className="bg-black/50 hover:bg-red-600 text-red-400 hover:text-white p-1.5 rounded-lg border border-red-900/30 hover:border-red-600 backdrop-blur-md transition-colors"
                title="Delete Project"
            >
                <Trash2 size={14} />
            </button>
        </div>
      )}

      {/* --- LEFT: MEDIA SECTION --- */}
      <div className="w-full lg:w-2/5 bg-black/50 border-b lg:border-b-0 lg:border-r border-slate-800 relative z-10">
        <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-slate-900">
          {getMainMedia()}
        </div>

        {/* Media Thumbnails */}
        <div className="p-4 grid grid-cols-4 gap-2">
           {/* YouTube Trigger */}
           {project.youtubeLink && (
              <button 
                onClick={() => setActiveMedia("video")}
                className={`col-span-1 aspect-video rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${activeMedia === "video" ? "border-red-500 bg-red-500/10 text-red-400" : "border-slate-700 bg-slate-800/50 text-slate-400"}`}
              >
                 <Youtube size={20} /> <span className="text-[10px] uppercase font-bold">Video</span>
              </button>
           )}
           {/* Screenshots Triggers */}
           {screenshotArray.map((shot: string, i: number) => (
             <button
                key={i}
                onClick={() => setActiveMedia(shot)}
                className={`col-span-1 aspect-video rounded-lg border overflow-hidden relative ${activeMedia === shot ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-700 opacity-70 hover:opacity-100"}`}
             >
                <img src={shot} alt="thumb" className="w-full h-full object-cover" />
             </button>
           ))}
        </div>
      </div>

      {/* --- RIGHT: CONTENT SECTION --- */}
      <div className="flex-1 p-6 md:p-8 flex flex-col relative z-0">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 pr-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {project.title}
            </h2>
            {/* Author Link */}
            <Link href={`/profile/${project.author?._id}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                 <Avatar className="w-5 h-5 border border-slate-700">
                    <AvatarImage src={project.author?.image} />
                    <AvatarFallback>{project.author?.name?.[0]}</AvatarFallback>
                 </Avatar>
                 By {project.author?.name}
            </Link>
          </div>
          
          <div className="flex gap-3 mt-2 md:mt-0">
             {project.githubLink && (
                <Button variant="outline" size="sm" asChild className="border-slate-700 bg-transparent text-slate-300 hover:text-white hover:bg-slate-800 gap-2 cursor-pointer">
                    <a href={project.githubLink} target="_blank" rel="noreferrer"><Github size={16} /> Code</a>
                </Button>
             )}
             {project.liveLink && (
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
                    <a href={project.liveLink} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Live</a>
                </Button>
             )}
          </div>
        </div>

        <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">About the project</h3>
            <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">{project.description}</p>
        </div>

        <div className="mt-auto">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Technologies Built With</h3>
            <div className="flex flex-wrap gap-2">
                {techArray.map((t: string, i: number) => (
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
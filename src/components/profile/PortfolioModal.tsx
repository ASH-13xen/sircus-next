"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useState } from "react";
import { Plus, ExternalLink, Github } from "lucide-react";

type ModalType = "skills" | "tests" | "projects" | "certificates" | null;

interface PortfolioModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  userId: Id<"users">;
  isOwner: boolean;
}

export default function PortfolioModal({ type, isOpen, onClose, userId, isOwner }: PortfolioModalProps) {
  // We conditionally fetch based on type to save resources
  const certificates = useQuery(api.portfolio.getCertificates, type === "certificates" ? { userId } : "skip");
  const projects = useQuery(api.portfolio.getProjects, type === "projects" ? { userId } : "skip");
  
  // For now, let's focus on the Certs/Projects UI. 
  // You can extend this for Tests/Skills similarly.

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0b1021] border-slate-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold capitalize flex justify-between items-center">
            {type} History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          
          {/* --- CERTIFICATES VIEW --- */}
          {type === "certificates" && (
            <div className="space-y-4">
              {isOwner && <AddCertificateForm onClose={() => {}} />} 
              
              {certificates?.length === 0 ? (
                <p className="text-slate-500 text-center">No certificates added yet.</p>
              ) : (
                certificates?.map((cert) => (
                  <div key={cert._id} className="p-4 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-blue-400">{cert.name}</h3>
                        <p className="text-sm text-slate-400">Issued by {cert.issuer} • {cert.issueDate}</p>
                      </div>
                      <a href={cert.certificateLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600/20 hover:text-blue-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- PROJECTS VIEW --- */}
          {type === "projects" && (
            <div className="space-y-4">
              {isOwner && <AddProjectForm />}
              
              {projects?.length === 0 ? (
                <p className="text-slate-500 text-center">No projects showcase yet.</p>
              ) : (
                projects?.map((project) => (
                  <div key={project._id} className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-purple-400">{project.title}</h3>
                      <div className="flex gap-2">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" className="text-slate-400 hover:text-white"><Github className="w-5 h-5" /></a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" className="text-slate-400 hover:text-blue-400"><ExternalLink className="w-5 h-5" /></a>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.split(",").map((tech, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- SUB-COMPONENTS FOR ADDING DATA (Only visible to Owner) ---

function AddCertificateForm({ onClose }: { onClose: () => void }) {
  const [isExpanding, setIsExpanding] = useState(false);
  const addCert = useMutation(api.portfolio.addCertificate);
  const [formData, setFormData] = useState({ name: "", issuer: "", issueDate: "", certificateLink: "" });

  if (!isExpanding) {
    return (
      <button onClick={() => setIsExpanding(true)} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-colors flex justify-center gap-2 items-center">
        <Plus className="w-4 h-4" /> Add Certificate
      </button>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCert(formData);
    setFormData({ name: "", issuer: "", issueDate: "", certificateLink: "" }); // Reset
    setIsExpanding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-600">
      <input placeholder="Certificate Name" required className="w-full bg-slate-900 p-2 rounded border border-slate-700" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Issuer (e.g. Coursera)" required className="w-full bg-slate-900 p-2 rounded border border-slate-700" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} />
        <input type="date" required className="w-full bg-slate-900 p-2 rounded border border-slate-700 text-slate-400" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} />
      </div>
      <input placeholder="Link to Credential" required className="w-full bg-slate-900 p-2 rounded border border-slate-700" value={formData.certificateLink} onChange={e => setFormData({...formData, certificateLink: e.target.value})} />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setIsExpanding(false)} className="text-sm text-slate-400 hover:text-white">Cancel</button>
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-500">Save</button>
      </div>
    </form>
  );
}

function AddProjectForm() {
  const [isExpanding, setIsExpanding] = useState(false);
  const addProj = useMutation(api.portfolio.addProject);
  const [formData, setFormData] = useState({ title: "", description: "", techStack: "", githubLink: "", liveLink: "" });

  if (!isExpanding) {
    return (
      <button onClick={() => setIsExpanding(true)} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:border-purple-500 hover:text-purple-400 transition-colors flex justify-center gap-2 items-center">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProj(formData);
    setFormData({ title: "", description: "", techStack: "", githubLink: "", liveLink: "" });
    setIsExpanding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-600">
      <input placeholder="Project Title" required className="w-full bg-slate-900 p-2 rounded border border-slate-700" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      <textarea placeholder="Description" required className="w-full bg-slate-900 p-2 rounded border border-slate-700" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      <input placeholder="Tech Stack (comma separated)" required className="w-full bg-slate-900 p-2 rounded border border-slate-700" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="GitHub URL" className="w-full bg-slate-900 p-2 rounded border border-slate-700" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} />
        <input placeholder="Live Demo URL" className="w-full bg-slate-900 p-2 rounded border border-slate-700" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setIsExpanding(false)} className="text-sm text-slate-400 hover:text-white">Cancel</button>
        <button type="submit" className="bg-purple-600 px-4 py-2 rounded text-sm hover:bg-purple-500">Save</button>
      </div>
    </form>
  );
}
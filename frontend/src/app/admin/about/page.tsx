"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Save,
  X,
  User,
  Users
} from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { 
    ssr: false,
    loading: () => <div className="h-48 w-full bg-gray-900 animate-pulse rounded-lg" />
});
import "react-quill-new/dist/quill.snow.css";

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<"founder" | "team">("founder");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Founder Statesssss
  const [founderData, setFounderData] = useState({
    name: "",
    role: "",
    bio: "",
    image_url: ""
  });
  const [founderImage, setFounderImage] = useState<File | null>(null);
  const founderImageInputRef = useRef<HTMLInputElement>(null);

  // Team State
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [memberFormData, setMemberFormData] = useState({
    name: "",
    role: "",
    bio: "",
    emoji: "🎭",
    gradient: "from-orange-500 to-pink-600",
    display_order: 0
  });
  const [memberImage, setMemberImage] = useState<File | null>(null);
  const memberImageInputRef = useRef<HTMLInputElement>(null);

  const gradients = [
    { name: "Orange-Pink", value: "from-orange-500 to-pink-600" },
    { name: "Purple-Blue", value: "from-purple-500 to-blue-600" },
    { name: "Pink-Rose", value: "from-pink-500 to-rose-600" },
    { name: "Cyan-Teal", value: "from-cyan-500 to-teal-600" },
    { name: "Indigo-Purple", value: "from-indigo-500 to-purple-600" },
    { name: "Amber-Orange", value: "from-amber-400 to-orange-600" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showTeamModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showTeamModal]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [founderRes, teamRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/about/founder`),
        fetch(`${API_BASE_URL}/api/about/team`)
      ]);

      const founder = await founderRes.json();
      if (!founder.error) {
        setFounderData(founder);
      }

      const team = await teamRes.json();
      if (Array.isArray(team)) {
        setTeamMembers(team);
      } else {
        console.warn("Expected team to be an array, but got:", team);
        setTeamMembers([]);
      }
    } catch (error) {
      console.error("Failed to fetch About data:", error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFounderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", founderData.name);
      formData.append("role", founderData.role);
      formData.append("bio", founderData.bio);
      if (founderImage) {
        formData.append("image", founderImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/about/founder`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setFounderData(result.data);
        setFounderImage(null);
        setMessage({ type: "success", text: "Founder details updated successfully!" });
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update founder details." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", memberFormData.name);
      formData.append("role", memberFormData.role);
      formData.append("bio", memberFormData.bio);
      formData.append("emoji", memberFormData.emoji);
      formData.append("gradient", memberFormData.gradient);
      formData.append("display_order", memberFormData.display_order.toString());
      if (memberImage) {
        formData.append("image", memberImage);
      }

      const url = editingMember 
        ? `${API_BASE_URL}/api/admin/about/team/${editingMember.id}`
        : `${API_BASE_URL}/api/admin/about/team`;
      
      const method = editingMember ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
        setShowTeamModal(false);
        setEditingMember(null);
        setMemberFormData({
          name: "",
          role: "",
          bio: "",
          emoji: "🎭",
          gradient: "from-orange-500 to-pink-600",
          display_order: 0
        });
        setMemberImage(null);
        setMessage({ type: "success", text: `Team member ${editingMember ? "updated" : "added"} successfully!` });
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save team member." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/about/team/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();
      if (result.success) {
        setTeamMembers(teamMembers.filter(m => m.id !== id));
        setMessage({ type: "success", text: "Team member deleted." });
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Manage About Us</h1>
            </div>
            {message && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm animate-in fade-in slide-in-from-top-2 ${
                message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-xl w-fit mb-8 border border-gray-800">
          <button
            onClick={() => setActiveTab("founder")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "founder" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            Our Founder
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "team" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            The Team
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "founder" ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Founder Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleFounderSubmit} className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={founderData.name}
                      onChange={(e) => setFounderData({ ...founderData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="Founder Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Role/Title</label>
                    <input
                      type="text"
                      required
                      value={founderData.role}
                      onChange={(e) => setFounderData({ ...founderData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="e.g. Founder, The Artist Factory"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Biography (Rich Text)</label>
                    <div className="prose-dark" data-lenis-prevent>
                      <ReactQuill
                        theme="snow"
                        value={founderData.bio}
                        onChange={(val) => setFounderData({ ...founderData, bio: val })}
                        modules={quillModules}
                        className="bg-[#0a0a0b] border-gray-700 rounded-xl overflow-hidden min-h-[300px]"
                      />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Founder Details
                  </button>
                </div>
              </form>
            </div>

            {/* Founder Image */}
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Founder Photo</h3>
                <div 
                  onClick={() => founderImageInputRef.current?.click()}
                  className="relative aspect-square w-full rounded-xl bg-gray-900 border-2 border-dashed border-gray-700 hover:border-orange-500 transition-all cursor-pointer overflow-hidden group"
                >
                  {founderImage ? (
                    <img src={URL.createObjectURL(founderImage)} className="w-full h-full object-cover" />
                  ) : founderData.image_url ? (
                    <Image src={founderData.image_url} alt="Founder" fill sizes="(max-width: 1024px) 100vw, 400px" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <Upload className="w-10 h-10 mb-2 group-hover:text-orange-500 transition-colors" />
                      <span className="text-xs group-hover:text-gray-300 transition-colors">Click to upload</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Change Image</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={founderImageInputRef} 
                  onChange={(e) => setFounderImage(e.target.files?.[0] || null)}
                  className="hidden" 
                  accept="image/*" 
                />
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  Recommended size: 800x1200px or similar portrait ratio. High quality JPG or PNG.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Team Members ({teamMembers.length})</h2>
              <button
                onClick={() => {
                  setEditingMember(null);
                  setMemberFormData({
                    name: "",
                    role: "",
                    bio: "",
                    emoji: "🎭",
                    gradient: "from-orange-500 to-pink-600",
                    display_order: teamMembers.length + 1
                  });
                  setMemberImage(null);
                  setShowTeamModal(true);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(teamMembers) && teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="group relative bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                      {member.image_url ? (
                        <Image src={member.image_url} alt="Team member" width={64} height={64} sizes="64px" className="w-full h-full object-cover rounded-full" />
                      ) : member.emoji}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingMember(member);
                          setMemberFormData({
                            name: member.name,
                            role: member.role,
                            bio: member.bio || "",
                            emoji: member.emoji || "🎭",
                            gradient: member.gradient || "from-orange-500 to-pink-600",
                            display_order: member.display_order || 0
                          });
                          setMemberImage(null);
                          setShowTeamModal(true);
                        }}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-orange-400 hover:bg-gray-700 rounded-lg transition-all"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleDeleteMember(member.id)}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg">{member.name}</h3>
                  <p className={`text-sm font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-r ${member.gradient}`}>
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-3">{member.bio}</p>
                </div>
              ))}
            </div>

            {teamMembers.length === 0 && (
              <div className="text-center py-20 bg-[#1a1a1a] rounded-3xl border border-gray-800/50">
                <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No team members added yet.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Team Member Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
              <h2 className="text-xl font-bold text-white">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button 
                onClick={() => setShowTeamModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 custom-scrollbar overscroll-contain" data-lenis-prevent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={memberFormData.name}
                    onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Designation / Role</label>
                  <input
                    type="text"
                    required
                    value={memberFormData.role}
                    onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Short Bio</label>
                <textarea
                  rows={3}
                  value={memberFormData.bio}
                  onChange={(e) => setMemberFormData({ ...memberFormData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  placeholder="Tell us about this person..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Emoji Profile (Icon)</label>
                  <input
                    type="text"
                    value={memberFormData.emoji}
                    onChange={(e) => setMemberFormData({ ...memberFormData, emoji: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. 🎭"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={memberFormData.display_order}
                    onChange={(e) => setMemberFormData({ ...memberFormData, display_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Brand Gradient</label>
                <div className="grid grid-cols-3 gap-3">
                  {gradients.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setMemberFormData({ ...memberFormData, gradient: g.value })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        memberFormData.gradient === g.value ? "border-orange-500 bg-orange-500/10" : "border-gray-800 bg-[#0a0a0b] hover:border-gray-600"
                      }`}
                    >
                      <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${g.value}`} />
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Profile Photo (Optional)</label>
                <div 
                  onClick={() => memberImageInputRef.current?.click()}
                  className="relative h-32 w-32 rounded-xl bg-gray-900 border-2 border-dashed border-gray-700 hover:border-orange-500 transition-all cursor-pointer overflow-hidden group"
                >
                  {memberImage ? (
                    <img src={URL.createObjectURL(memberImage)} className="w-full h-full object-cover" />
                  ) : editingMember?.image_url ? (
                    <img src={editingMember.image_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <Plus className="w-8 h-8 group-hover:text-orange-500 transition-colors" />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={memberImageInputRef} 
                  onChange={(e) => setMemberImage(e.target.files?.[0] || null)}
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-6 py-2.5 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingMember ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0b; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .prose-dark .ql-toolbar {
          border-color: #374151 !important;
          background: #1a1a1a;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
        .prose-dark .ql-container {
          border-color: #374151 !important;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          font-family: inherit;
        }
        .prose-dark .ql-editor {
          min-height: 250px;
          font-size: 1rem;
          color: #d1d5db;
        }
        .prose-dark .ql-stroke { stroke: #9ca3af !important; }
        .prose-dark .ql-fill { fill: #9ca3af !important; }
        .prose-dark .ql-picker { color: #9ca3af !important; }
      `}</style>
    </div>
  );
}

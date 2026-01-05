import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Code,
  LogOut,
  Calendar,
  Terminal,
  Copy,
  Check,
  Edit3,
  X,
  Save,
  MapPin,
  Search,
  ChevronRight,
  Play,
  Maximize2,
  ExternalLink,
  Hash,
  FileCode,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/codes/";

// --- SUB-COMPONENTS ---

/**
 * 1. PREMIUM EDIT PROFILE DRAWER
 * Replaces the "mid" modal with a high-end Slide-over Panel
 */
const EditProfileDrawer = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    location: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave(formData);
    setSaving(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Drawer Header with Cover Image Concept */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>
            <div className="absolute -bottom-10 left-8">
              <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg">
                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-gray-400">
                  {formData.username.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-8 pt-14 pb-8 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Edit Profile
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Update your personal details and public info.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-blue-600 text-gray-900 font-medium placeholder-gray-300 focus:outline-none transition-colors"
                  placeholder="john_doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bio / Tagline
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder-gray-400 resize-none transition-all"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-white transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * 2. CODE DETAIL VIEW MODAL
 * The "Tap to see" experience
 */

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
const CodeDetailModal = ({ code, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !code) return null;

  const handleOpenCompiler = () => {
    navigate(`/compiler?codeId=${code._id}`);
  };

  const handleCopy = () => {
    const textToCopy = code.sourceCode || code.snippet || code.code || "";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Simple Backdrop - slightly darker for focus */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container - Clean White Professional Look */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0d1117] rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Minimalist */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0d1117] rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
              <FileCode size={18} className="text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {code.title || "Untitled Snippet"}
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                {code.language?.toUpperCase() || "TEXT"} • {new Date(code.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md transition-all"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy Code"}</span>
            </button>

            <button
              onClick={handleOpenCompiler}
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 text-xs font-semibold rounded-md transition-all"
            >
              <Terminal size={14} />
              <span>Open Compiler</span>
            </button>
            
            <button 
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Code Content - High Contrast */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-[#0d1117] p-0">
          <div className="p-6">
           
             <SyntaxHighlighter
              language={code.language || "javascript"}
              style={vscDarkPlus} // Toggle based on your theme state
              showLineNumbers={true}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                background: "transparent",
                border: 0,
              }}
            >
              {code.code ||
                code.sourceCode ||
                code.snippet ||
                "// No code available."}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Footer - Metadata */}
        <div className="px-6 py-3 bg-white dark:bg-[#0d1117] border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex justify-between rounded-b-lg">
           <span>Read-only view</span>
           <span className="font-mono">ID: {code._id?.slice(-6)}</span>
        </div>

      </div>
    </div>
  );
};

/**
 * 3. CODE LIST ITEM (Row Style)
 * Replaces grids with a clean list
 */
const CodeListItem = ({ code, onClick }) => {
  return (
    <div
      onClick={() => onClick(code)}
      className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all first:rounded-t-xl last:rounded-b-xl last:border-0"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
            code.language === "Python"
              ? "bg-blue-100 text-blue-600"
              : code.language === "JavaScript"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {code.language ? (
            code.language.charAt(0).toUpperCase()
          ) : (
            <Hash size={18} />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {code.title || "Untitled Snippet"}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="font-mono">{code.language || "Text"}</span>
            <span>•</span>
            <span>{new Date(code.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
        <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
          View Code <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const ProfileComponent = () => {
  console.log("PROFILE COMPONENT RENDERED");

  const [user, setUser] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null); // Controls the View Modal

  // Init
  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log(parsed);
      setUser({
        ...parsed,
        bio: parsed.bio || "Full Stack Developer",
        location: parsed.location || "Remote",
      });
    } else {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const fetchCodes = async () => {
      if (!user) return;
      try {
        const response = await axios.get(API_URL, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setCodes(response.data.codes || []);
      } catch (err) {
        setCodes([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCodes();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleUpdateProfile = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (!user )
    return <div className="p-10 text-center text-gray-500">Please log in.</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900 pb-20">
      {/* HEADER: Clean & Minimal */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user.username}
              </h1>
              <p className="text-xs text-gray-500 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit3 size={14} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Title & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Repository</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage your saved snippets and code blocks.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white border border-gray-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>

        {/* LIST VIEW (No Grids) */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-white rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : codes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Empty Library</h3>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {codes.map((code) => (
              <CodeListItem
                key={code._id}
                code={code}
                onClick={setSelectedCode}
              />
            ))}
          </div>
        )}
      </div>

      {/* SLIDE-OVER DRAWER for Edit Profile */}
      <EditProfileDrawer
        user={user}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdateProfile}
      />

      {/* CODE VIEW MODAL */}
      <CodeDetailModal
        code={selectedCode}
        isOpen={!!selectedCode}
        onClose={() => setSelectedCode(null)}
      />
    </div>
  );
};

export default ProfileComponent;

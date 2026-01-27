import React, { useState } from "react";
import {
  MapPin,
  Briefcase,
  School,
  Github,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Eye,
  CheckCircle2,
  MessageSquare,
  Star,
  Zap,
  Edit3,
  FileCode,
  ChevronRight,
  Terminal,
  Clock,
  Calendar,
  Bookmark,
  Code,
} from "lucide-react";
import { useMemo } from "react";

//Components

const UserSidebar = ({ user, onEdit }) => {
  // Fallback if user data isn't loaded yet
  if (!user) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500 fade-in">
      {/* --- MAIN PROFILE CARD --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">
        {/* Decorative Top Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>

        <div className="p-6">
          {/* Header: Avatar & Names */}
          <div className="flex items-start gap-5">
            <div className="relative">
              {/* Avatar Container with Gradient Ring */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-[2px] shadow-inner">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center overflow-hidden">
                  {/* If user has image, put <img> here, else use initials */}
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>

              {/* Online Status Indicator */}
              <div className="absolute -bottom-1.5 -right-1.5 bg-white p-1 rounded-full">
                <div className="w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm animate-pulse"></div>
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-xl font-bold text-slate-900 truncate">
                {user.username || "Anonymous"}
              </h2>
              <p className="text-sm font-medium text-slate-500 truncate">
                @{user.username?.toLowerCase() || "user"}
              </p>

              {/* Rank / Level Badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                <Zap size={12} className="text-blue-600 fill-blue-600" />
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                  Level 5
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="w-full mt-6 py-2.5 flex items-center justify-center gap-2 rounded-xl bg-slate-50 text-slate-700 text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent transition-all duration-200 group/btn"
          >
            <Edit3
              size={14}
              className="group-hover/btn:scale-110 transition-transform"
            />
            Edit Profile
          </button>

          {/* User Details List */}
          <div className="mt-6 space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-slate-600 group/item hover:text-slate-900 transition-colors">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-400 group-hover/item:text-blue-500 group-hover/item:bg-blue-50 transition-colors">
                <MapPin size={16} />
              </div>
              <span className="truncate">
                {user.location || "Remote, Earth"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600 group/item hover:text-slate-900 transition-colors">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-400 group-hover/item:text-blue-500 group-hover/item:bg-blue-50 transition-colors">
                <School size={16} />
              </div>
              <span className="truncate">
                {user.school || "University of Code"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600 group/item hover:text-slate-900 transition-colors">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-400 group-hover/item:text-blue-500 group-hover/item:bg-blue-50 transition-colors">
                <Briefcase size={16} />
              </div>
              <span className="truncate">{user.company || "Open to work"}</span>
            </div>

            {/* Bio Quote */}
            {user.bio && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 italic leading-relaxed">
                  "{user.bio}"
                </p>
              </div>
            )}
          </div>

          {/* Social Links Row */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3 text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">
              <Github size={18} />
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="#" className="hover:text-sky-500 transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              <LinkIcon size={18} />
            </a>
          </div>
        </div>

        {/* Footer: Community Stats Grid */}
        <div className="bg-slate-50/80 border-t border-slate-200 p-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Eye size={16} className="text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Views
              </span>
              <span className="text-sm font-bold text-slate-700">12.4K</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Solved
              </span>
              <span className="text-sm font-bold text-slate-700">45</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare size={16} className="text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Discuss
              </span>
              <span className="text-sm font-bold text-slate-700">12</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star size={16} className="text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Reputation
              </span>
              <span className="text-sm font-bold text-slate-700">201</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SKILLS CARD --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          Skills & Languages
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "JavaScript",
            "React",
            "Python",
            "Node.js",
            "SQL",
            "Tailwind",
            "System Design",
            "AWS",
          ].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 cursor-default transition-all duration-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const SolvedProblemsCard = ({ codes = [] }) => {
  // --- MOCK CALCULATION LOGIC ---
  // In a real app, you might get these stats directly from the backend.
  // Here we derive them or use defaults to look good even with empty data.

  const stats = useMemo(() => {
    const total = codes.length || 0;
    // Mocking distribution for demo (replace with real logic if codes have difficulty field)
    const easy = Math.ceil(total * 0.5);
    const medium = Math.floor(total * 0.35);
    const hard = Math.max(0, total - easy - medium);

    return {
      total,
      easy,
      medium,
      hard,
      // Totals available on the platform (mock data)
      totalEasy: 640,
      totalMedium: 1250,
      totalHard: 480,
    };
  }, [codes]);

  // --- SVG MATH ---
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Calculate percentage for the circle stroke
  // If 0 solved, show a tiny sliver so it doesn't look broken
  const percentage = stats.total > 0 ? (stats.total / 500) * 100 : 2;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
        Solved Problems
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* --- LEFT: DONUT CHART --- */}
        <div className="relative group cursor-default">
          {/* The Chart SVG */}
          <div className="w-32 h-32 transform -rotate-90">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              {/* Background Circle (Track) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#F1F5F9" // slate-100
                strokeWidth="6"
              />
              {/* Foreground Circle (Progress) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#ffa116" // LeetCode Orange (Brand Color)
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-800 group-hover:scale-110 transition-transform duration-300">
              {stats.total}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Solved
            </span>
          </div>
        </div>

        {/* --- RIGHT: STATS LEGEND --- */}
        <div className="flex-1 w-full space-y-5">
          {/* EASY ROW */}
          <div className="group">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-sm font-medium text-slate-600 group-hover:text-emerald-500 transition-colors">
                Easy
              </span>
              <div className="text-sm font-bold text-slate-800">
                {stats.easy}
                <span className="text-xs text-slate-400 font-medium ml-1">
                  / {stats.totalEasy}
                </span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-all duration-1000"
                style={{ width: `${(stats.easy / stats.totalEasy) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* MEDIUM ROW */}
          <div className="group">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-sm font-medium text-slate-600 group-hover:text-amber-500 transition-colors">
                Medium
              </span>
              <div className="text-sm font-bold text-slate-800">
                {stats.medium}
                <span className="text-xs text-slate-400 font-medium ml-1">
                  / {stats.totalMedium}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-all duration-1000"
                style={{
                  width: `${(stats.medium / stats.totalMedium) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* HARD ROW */}
          <div className="group">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-sm font-medium text-slate-600 group-hover:text-rose-500 transition-colors">
                Hard
              </span>
              <div className="text-sm font-bold text-slate-800">
                {stats.hard}
                <span className="text-xs text-slate-400 font-medium ml-1">
                  / {stats.totalHard}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all duration-1000"
                style={{ width: `${(stats.hard / stats.totalHard) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlueHeatmap = () => {
  // --- CONFIGURATION & MOCK DATA ---
  const WEEKS = 52;
  const DAYS = 7; // 0 = Sunday, 6 = Saturday
  const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Define the Blue Color Scale (Tailwind classes)
  const COLOR_SCALE = {
    0: "bg-slate-100 border-slate-200", // No activity
    1: "bg-blue-200 border-blue-300", // Low
    2: "bg-blue-400 border-blue-500", // Medium
    3: "bg-blue-600 border-blue-700", // High
    4: "bg-indigo-700 border-indigo-800", // Max
  };

  // Function to generate deterministic mock intensity (0-4) based on grid position
  // This makes the pattern look semi-realistic without needing real data yet.
  const getMockIntensity = (weekIndex, dayIndex) => {
    // Create a wave-like pattern combined with some "randomness" based on indices
    const base = Math.sin(weekIndex / 2.5) * Math.cos(dayIndex / 1.5);
    const noise = (weekIndex * dayIndex) % 7;
    const result = Math.abs(base * noise);

    if (result > 3.5) return 4;
    if (result > 2.5) return 3;
    if (result > 1.5) return 2;
    if (result > 0.5) return 1;
    return 0;
  };

  // Memoize the grid data generation so it doesn't re-run needlessly
  const heatmapGrid = useMemo(() => {
    return Array.from({ length: WEEKS }).map((_, weekIdx) => {
      return Array.from({ length: DAYS }).map((_, dayIdx) => {
        const intensity = getMockIntensity(weekIdx, dayIdx);
        return {
          weekIdx,
          dayIdx,
          intensity,
          // Simple mock tooltip text
          tooltip: `${
            intensity > 0 ? intensity * 2 + Math.floor(Math.random() * 3) : 0
          } submissions`,
        };
      });
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
      {/* --- HEADER & LEGEND --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Submission Activity
          </h3>
          <p className="text-sm font-bold text-slate-800 mt-1">
            365 Submissions in the last year
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Less</span>
          {/* Render the scale squares */}
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-[3px] border ${COLOR_SCALE[level]}`}
            ></div>
          ))}
          <span>More</span>
        </div>
      </div>

      {/* --- THE HEATMAP GRID --- */}
      <div className="relative">
        {/* Container with horizontal scroll for small screens */}
        <div className="overflow-x-auto pb-2 custom-scrollbar font-mono">
          <div className="flex gap-[3px] min-w-max">
            {/* Iterate through Weeks (Columns) */}
            {heatmapGrid.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {/* Iterate through Days (Rows) */}
                {week.map((day, dIdx) => (
                  <div
                    key={`${wIdx}-${dIdx}`}
                    title={day.tooltip} // Native browser tooltip
                    className={`w-3 h-3 rounded-[3px] border transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:scale-110 hover:z-10 ${
                      COLOR_SCALE[day.intensity]
                    }`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* --- MONTH LABELS (Footer) --- */}
        {/* A simple distribution of month labels roughly spaced out */}
        <div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider pointer-events-none">
          {MONTH_LABELS.map((month, idx) =>
            // Only show some months to avoid overcrowding, based on index
            idx % 2 === 0 || idx === MONTH_LABELS.length - 1 ? (
              <span key={month}>{month}</span>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
};

const SubmissionsList = ({
  savedCodes = [],
  solvedProblems = [],
  onSelect,
}) => {
  // State to manage the active view
  const [activeTab, setActiveTab] = useState("saved"); // 'saved' or 'solved'

  // Helper to determine which data to show
  const currentList = activeTab === "saved" ? savedCodes : solvedProblems;
  const isSaved = activeTab === "saved";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[450px] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
      {/* --- TABBED HEADER --- */}
      <div className="flex items-center border-b border-slate-100">
        {/* Tab 1: Saved Codes */}
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all relative ${
            isSaved
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Code size={18} />
          Saved Codes
          {isSaved && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full mx-6"></div>
          )}
        </button>

        {/* Tab 2: Solved Problems */}
        <button
          onClick={() => setActiveTab("solved")}
          className={`flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all relative ${
            !isSaved
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <CheckCircle2 size={18} />
          Solved Questions
          {!isSaved && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full mx-6"></div>
          )}
        </button>
      </div>

      {/* --- LIST CONTENT --- */}
      <div className="flex-1 overflow-hidden">
        {currentList.length === 0 ? (
          // Empty State (Dynamic based on tab)
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              {isSaved ? (
                <Terminal size={32} className="text-slate-300" />
              ) : (
                <CheckCircle2 size={32} className="text-slate-300" />
              )}
            </div>
            <p className="font-medium text-slate-500">
              {isSaved ? "No saved codes found." : "No problems solved yet."}
            </p>
            <p className="text-sm mt-1 text-slate-400">
              {isSaved
                ? "Start a new project to save snippets."
                : "Head to the arena and start solving!"}
            </p>
          </div>
        ) : (
          // Data List
          <div className="divide-y divide-slate-50">
            {currentList.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => onSelect && onSelect(item)}
                className="group px-6 py-4 hover:bg-slate-50/80 cursor-pointer transition-all duration-200 flex items-center justify-between border-l-4 border-transparent hover:border-blue-500"
              >
                {/* Left Side: Title & Info */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {item.title ||
                      (isSaved ? "Untitled Snippet" : "Unknown Problem")}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {/* Only show time if space permits */}
                    <span className="hidden sm:flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Right Side: Badges */}
                <div className="flex items-center gap-4">
                  {/* Language Badge */}
                  <span className="hidden sm:inline-block font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-wider">
                    {item.language || "TEXT"}
                  </span>

                  {/* Context Badge: Show "Accepted" for Solved, or "Private/Public" for Saved */}
                  {isSaved ? (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1">
                      <Bookmark size={10} /> Saved
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold shadow-sm flex items-center gap-1">
                      <CheckCircle2 size={10} /> Accepted
                    </span>
                  )}

                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- FOOTER --- */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl text-center">
        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide transition-colors">
          View All {isSaved ? "Repositories" : "Submissions"}
        </button>
      </div>
    </div>
  );
};
//Dummy Data

const dummyUser = {
  username: "CodeMaster",
  bio: "Full Stack Engineer obsessed with clean UI and scalable backends.",
  location: "San Francisco, CA",
  school: "Stanford University",
  company: "Google",
};

const dummyCodes = new Array(7).fill({});

// --- PLACEHOLDER COMPONENTS (We will build these one by one next) ---

// --- MAIN LAYOUT COMPONENT ---

const ProfileLayout = () => {
  return (
    <div>
      {false ? (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
          {/* 2. Main Content Grid */}
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 mt-4 md:mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN (User Info) - Spans 4 of 12 columns */}
              <div className="lg:col-span-4 space-y-6">
                <UserSidebar
                  user={dummyUser}
                  onEdit={() => console.log("Edit Clicked")}
                />{" "}
                {/* You can add a 'SkillsSkeleton' here later if you want separate cards */}
              </div>

              {/* RIGHT COLUMN (Stats & Content) - Spans 8 of 12 columns */}
              <div className="lg:col-span-8 space-y-6">
                {/* Top Row: Solved Problems Stats */}
                <SolvedProblemsCard codes={dummyCodes} />
                {/* Middle Row: Submission Heatmap */}
                <BlueHeatmap />
                {/* Bottom Row: List of Submissions/Codes */}
                <SubmissionsList
                  savedCodes={dummyCodes} // Pass your saved snippets here
                  solvedProblems={dummyCodes} // Pass your solved problems here
                  onSelect={(item) => console.log("Clicked:", item)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="flex min-h-[60vh] items-center justify-center">
          <div class="rounded-2xl border border-white/10 bg-white/5 px-10 py-8 text-center backdrop-blur-md shadow-xl">
            <h1 class="text-3xl font-semibold tracking-tight text-black">
              🚧 Under Construction
            </h1>
            <p class="mt-3 text-sm text-black/70">
              This page is currently being built. Check back soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileLayout;

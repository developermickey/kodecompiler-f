import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Code,
  Trophy,
  Zap,
  BookOpen,
  ArrowRight,
  Activity,
} from "lucide-react";
import { fetchUserProgress } from "../../redux/slices/userprogressSlice";
import { fetchGlobalLeaderboard } from "../../redux/slices/challengesGlobalLeaderboardSlice";

const Welcome = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) navigate("/login");
    dispatch(fetchUserProgress());
    dispatch(fetchGlobalLeaderboard());
    
  }, [user, navigate]);

  if (!user) return null;

  const {solvedCount} = useSelector((state)=>state.userProgress);
  const {myRank} = useSelector((state)=>state.globalLeaderboard)

  // Configuration for your 4 specific actions
  // Note: I converted colors to Blue/White/Slate to match your theme request
  const actions = [
    {
      id: "problems",
      title: "Practice Problems",
      subtitle: "500+ Questions",
      icon: Code,
      path: "/problems",
      desc: "Sharpen your skills with our curated algorithm library.",
      cols: "md:col-span-2", // Large Card
    },
    {
      id: "contests",
      title: "Weekly Contests",
      subtitle: "Compete Live",
      icon: Trophy,
      path: "/weekly-challenges",
      desc: "Battle globally.",
      cols: "md:col-span-1", // Standard Card
    },
    {
      id: "compiler",
      title: "Quick Compiler",
      subtitle: "Instant Editor",
      icon: Zap,
      path: "/editor",
      desc: "Prototype fast.",
      cols: "md:col-span-1", // Standard Card
    },
    {
      id: "interview",
      title: "Interview Prep",
      subtitle: "Get Ready",
      icon: BookOpen,
      path: "/interview-experiences",
      desc: "Read real experiences from top tier companies.",
      cols: "md:col-span-2", // Large Card
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white p-6 md:p-12 font-sans text-slate-900">
      {/* --- GREETING SECTION --- */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Hello, <span className="text-[#0652e9]">{user.username}</span>
          </h1>
          <p className="mt-2 text-xl text-slate-500 font-medium">
            Your command center is ready. What's the focus today?
          </p>
        </div>

        {/* Subtle User Stats - Kept minimal */}
        <div className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
          <Activity className="w-5 h-5 text-[#0652e9]" />
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Solved
            </p>
            <p className="text-lg font-bold leading-none">
              {solvedCount || 0}
            </p>
          </div>
          <div className="w-px h-8 bg-gray-200 mx-2"></div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Rank
            </p>
            <p className="text-lg font-bold leading-none">
              #{myRank || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* --- THE SPICY GRID (Your 4 Actions Reimagined) --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <div
            key={action.id}
            onClick={() => navigate(action.path)}
            className={`
              ${action.cols}
              group relative overflow-hidden rounded-3xl cursor-pointer
              bg-white border border-gray-100 shadow-lg shadow-gray-100/50
              hover:shadow-2xl hover:shadow-blue-500/20 hover:border-[#0652e9]/30
              transition-all duration-500 hover:-translate-y-1
            `}
          >
            {/* The "Blue Flash" Hover Background */}
            <div className="absolute inset-0 bg-[#0652e9] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"></div>

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              {/* Top Row: Icon & Arrow */}
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
                  <action.icon className="w-7 h-7 text-[#0652e9] group-hover:text-white transition-colors duration-500" />
                </div>

                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-white/30 group-hover:rotate-[-45deg] transition-all duration-500">
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>

              {/* Bottom Row: Text Content */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-white transition-colors duration-500 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm font-bold uppercase tracking-wider text-[#0652e9] group-hover:text-blue-200 transition-colors duration-500 mb-3">
                  {action.subtitle}
                </p>
                <p className="text-slate-500 text-sm group-hover:text-blue-100 transition-colors duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-500 delay-75">
                  {action.desc}
                </p>
              </div>
            </div>

            {/* Decorative Background Pattern (Visible on hover) */}
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <action.icon className="w-32 h-32 text-white transform rotate-12 translate-x-12 -translate-y-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Code,
  Trophy,
  Target,
  Award,
  TrendingUp,
  ArrowRight,
  Terminal,
  Zap,
  Clock,
} from "lucide-react";
import QuickActions from "./QuickActions";
import { useDispatch } from "react-redux";

const Welcome = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  // Real Data Mapping
  const stats = [
    {
      label: "Solved",
      value: user.problemsSolved || 0,
      icon: Code,
      color: "text-blue-200",
      bg: "bg-white/10",
    },
    {
      label: "Contests",
      value: user.contestsWon || 0,
      icon: Trophy,
      color: "text-yellow-200",
      bg: "bg-white/10",
    },
    {
      label: "Streak",
      value: user.streak || 0,
      icon: Target,
      color: "text-green-200",
      bg: "bg-white/10",
    },
    {
      label: "Rank",
      value: user.rank || "N/A",
      icon: Award,
      color: "text-purple-200",
      bg: "bg-white/10",
    },
  ];

  const recommendations = user.recommended || [];
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* --- 1. HERO BANNER (Developer Aesthetic) --- */}
      <div className="relative bg-[#0652e9] pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract Code Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 L100 0" stroke="white" strokeWidth="0.5" />
            <path d="M20 100 L100 20" stroke="white" strokeWidth="0.5" />
            <path d="M0 80 L80 0" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 text-white">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-sm font-mono mb-2">
              <Terminal className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Hello, {user.username}
            </h1>
            <p className="text-lg text-blue-100 max-w-xl leading-relaxed">
              Your compiler is ready. You have{" "}
              <span className="font-bold text-white">
                3 pending recommendations
              </span>{" "}
              and your streak is active.
            </p>
          </div>

          {/* Quick Stats Row (Integrated into Banner) */}
          <div className="flex gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="hidden md:block text-center px-4 py-2 rounded-lg bg-blue-800/30 border border-blue-400/30 backdrop-blur-sm"
              >
                <p className="text-xs text-blue-200 uppercase tracking-wider font-bold">
                  {stat.label}
                </p>
                <p className="text-xl font-bold font-mono">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 2. MAIN DASHBOARD CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Actions & Recs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 p-1">
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-500 fill-current" />
                  Quick Actions
                </h2>
                <QuickActions />
              </div>
            </div>

            {/* Recommendations (Styled as "Problem Cards") */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#0652e9]" /> Recommended
                  Problems
                </h2>
                <button className="text-sm font-semibold text-[#0652e9] hover:underline">
                  View All
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {recommendations.length > 0 ? (
                  recommendations.map((problem, index) => (
                    <a
                      key={index}
                      href={`/problem/${problem.slug}`}
                      className="group relative bg-[#1e1e1e] rounded-xl p-5 border border-gray-800 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 overflow-hidden"
                    >
                      {/* Decorative Code Line */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0652e9] to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded border
                          ${problem.difficulty === "Easy" ? "bg-green-500/10 text-green-400 border-green-500/20" : ""}
                          ${problem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : ""}
                          ${problem.difficulty === "Hard" ? "bg-red-500/10 text-red-400 border-red-500/20" : ""}
                        `}
                        >
                          {problem.difficulty}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>

                      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                        {problem.title}
                      </h3>
                      <p className="text-gray-400 text-xs font-mono mb-4">
                        Category: {problem.category}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>~15 mins</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                    No recommendations yet. Start solving to get personalized
                    picks!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Mobile Stats & Status */}
          <div className="space-y-6">
            {/* Mobile Stats (Visible only on small screens) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:hidden">
              <h3 className="font-bold text-gray-900 mb-4">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-xs text-gray-500 uppercase">
                      {stat.label}
                    </p>
                    <p className="font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress Card */}
            <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

              <div className="relative z-10">
                <h3 className="font-bold text-gray-900 mb-1">Weekly Goal</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Keep your streak alive!
                </p>

                <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-extrabold text-[#0652e9]">
                    3
                    <span className="text-lg text-gray-400 font-medium">
                      /5
                    </span>
                  </span>
                  <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div className="bg-[#0652e9] h-2 rounded-full w-[60%] shadow-[0_0_10px_rgba(6,82,233,0.5)]"></div>
                </div>

                <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
                  View Leaderboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pro Tip / Info */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Did you know?</h4>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    Solving "Hard" problems gives you 2x more ranking points
                    than Medium ones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

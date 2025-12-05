import { useSelector } from "react-redux";
import {
  Code,
  Trophy,
  Zap,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  User,
  Mail,
} from "lucide-react";

import QuickActions from "./QuickActions";

const Welcome = () => {
  const user = useSelector((state) => state.auth.user);

  // Redirect if not logged in
  if (!user) {
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = "/login";
    return null;
  }

  // Your REAL DATA from API (these will later come dynamically from backend)
  const stats = [
    { icon: Code, label: "Problems Solved", value: user.problemsSolved || 0, color: "bg-blue-100 text-blue-600" },
    { icon: Trophy, label: "Contests Won", value: user.contestsWon || 0, color: "bg-yellow-100 text-yellow-600" },
    { icon: Target, label: "Current Streak", value: `${user.streak || 0} days`, color: "bg-green-100 text-green-600" },
    { icon: Award, label: "Rank", value: user.rank || "N/A", color: "bg-purple-100 text-purple-600" },
  ];

//   const recentActivity = user.activity || [];

  const recommendations = user.recommended || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-gradient-to-r from-[#0652e9] to-[#0547d1] rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Welcome back, {user.username}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Ready to continue your coding journey?
              </p>
            </div>

            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-[#0652e9]" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#0652e9] transition-all"
            >
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Action Section */}
          <QuickActions />

        {/* Recommended Problems */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
            <TrendingUp className="w-5 h-5 text-[#0652e9]" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.length > 0 ? (
              recommendations.map((problem, index) => (
                <a
                  key={index}
                  href={`/problem/${problem.slug}`}
                  className="p-4 border rounded-lg hover:border-[#0652e9] hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{problem.category}</span>
                  </div>
                  <p className="font-medium text-gray-900">{problem.title}</p>
                </a>
              ))
            ) : (
              <p>No recommendations available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Welcome;

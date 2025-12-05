import { Code, Trophy, Zap, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm my-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Practice Problems */}
        <NavLink
          to="/problems"
          className="flex flex-col p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl 
          hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center 
            group-hover:scale-110 transition-transform">
            <Code size={26} />
          </div>
          <p className="mt-4 font-semibold text-gray-900">Practice Problems</p>
          <p className="text-sm text-gray-600">500+ questions</p>
        </NavLink>

        {/* Weekly Contests */}
        <NavLink
          to="/contests"
          className="flex flex-col p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl 
          hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 bg-yellow-500 text-white rounded-lg flex items-center justify-center 
            group-hover:scale-110 transition-transform">
            <Trophy size={26} />
          </div>
          <p className="mt-4 font-semibold text-gray-900">Weekly Contests</p>
          <p className="text-sm text-gray-600">Compete now</p>
        </NavLink>

        {/* Quick Compiler */}
        <NavLink
          to="/editor"
          className="flex flex-col p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl 
          hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center 
            group-hover:scale-110 transition-transform">
            <Zap size={26} />
          </div>
          <p className="mt-4 font-semibold text-gray-900">Quick Compiler</p>
          <p className="text-sm text-gray-600">Test your code</p>
        </NavLink>

        {/* Interview Prep */}
        <NavLink
          to="/interview"
          className="flex flex-col p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl 
          hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center 
            group-hover:scale-110 transition-transform">
            <BookOpen size={26} />
          </div>
          <p className="mt-4 font-semibold text-gray-900">Interview Prep</p>
          <p className="text-sm text-gray-600">Get ready</p>
        </NavLink>

      </div>
    </div>
  );
};

export default QuickActions;

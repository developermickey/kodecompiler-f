import { 
  ArrowRight, Code, Award, Book, Briefcase, 
  LayoutDashboard, Flame, Bell, Search, MoreVertical, 
  TrendingUp, PlayCircle 
} from "lucide-react";
import { NavLink } from "react-router-dom";

const PlatformSection = () => {
  const features = [
    {
      icon: Code,
      title: "Code Compiler",
      description: "Practice coding in 10+ languages with our powerful online compiler",
    },
    {
      icon: Book,
      title: "Interview Preparation",
      description: "Access 500+ real interview questions from top tech companies",
    },
    {
      icon: Award,
      title: "Weekly Contests",
      description: "Compete with developers worldwide and improve your ranking",
    },
    {
      icon: Briefcase,
      title: "Land Your Dream Job",
      description: "Get hired by top companies with proven coding skills",
    },
  ];

  const stats = [
    { number: "100K+", label: "Active Students" },
    { number: "500+", label: "Coding Problems" },
    { number: "10+", label: "Languages" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full mb-6 text-sm font-medium">
            KODECOMPILER PLATFORM
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Where Developers Build Skills
            <br />
            <span className="text-[#0652e9]">That Get Them Hired</span>
          </h2>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">

          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              A complete ecosystem for your <br />
              <span className="bg-gradient-to-r from-[#0652e9] to-blue-500 bg-clip-text text-transparent">technical growth.</span>
            </h3>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Stop switching between tabs. We combine learning, practicing, and 
              interview preparation into one seamless dashboard. Track your progress, 
              maintain your streak, and showcase your profile to recruiters.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-[#0652e9] stroke-[2.5]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <NavLink
              to="/learn-more"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1"
            >
              Explore Platform
              <ArrowRight className="w-5 h-5" />
            </NavLink>
          </div>

          {/* Right: CSS Dashboard Visualization */}
          <div className="order-1 lg:order-2 relative perspective-1000">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full blur-3xl opacity-60 transform translate-x-10 translate-y-10"></div>
            
            {/* Main Dashboard Card */}
            <div className="relative bg-[#0f172a] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              
              {/* Navbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#1e293b]/50 backdrop-blur-md">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 </div>
                 <div className="flex items-center gap-4 text-gray-400">
                    <Search className="w-4 h-4 hover:text-white cursor-pointer" />
                    <Bell className="w-4 h-4 hover:text-white cursor-pointer" />
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border border-white/20"></div>
                 </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="w-16 bg-[#1e293b]/30 border-r border-gray-800 py-6 flex flex-col items-center gap-6">
                   <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><LayoutDashboard className="w-5 h-5" /></div>
                   <div className="p-2 text-gray-500 hover:text-white transition-colors"><Code className="w-5 h-5" /></div>
                   <div className="p-2 text-gray-500 hover:text-white transition-colors"><Book className="w-5 h-5" /></div>
                   <div className="p-2 text-gray-500 hover:text-white transition-colors"><Award className="w-5 h-5" /></div>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 p-6 space-y-6">
                   
                   {/* Welcome & Streak */}
                   <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-bold text-lg">Welcome back, Alex! 👋</h4>
                        <p className="text-gray-400 text-xs">Keep up the momentum.</p>
                      </div>
                      <div className="flex items-center gap-2 bg-[#1e293b] px-3 py-1.5 rounded-full border border-gray-700">
                         <Flame className="w-4 h-4 text-orange-500 fill-current animate-pulse" />
                         <span className="text-white font-bold text-sm">12 Day Streak</span>
                      </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800">
                         <p className="text-gray-500 text-xs mb-1">Problems Solved</p>
                         <p className="text-white font-bold text-xl">142</p>
                         <div className="w-full bg-gray-700 h-1 rounded-full mt-3 overflow-hidden">
                            <div className="bg-blue-500 w-[70%] h-full rounded-full"></div>
                         </div>
                      </div>
                      <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800">
                         <p className="text-gray-500 text-xs mb-1">Global Rank</p>
                         <div className="flex justify-between items-end">
                            <p className="text-white font-bold text-xl">#4,203</p>
                            <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
                         </div>
                         <p className="text-green-500 text-[10px] mt-1">Top 5% this week</p>
                      </div>
                   </div>

                   {/* Active Course Card */}
                   <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800 flex items-center gap-4 group cursor-pointer hover:border-blue-500/50 transition-colors">
                      <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400">
                         <Code className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <h5 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">Data Structures Masterclass</h5>
                         <p className="text-gray-500 text-xs mb-2">Module 4: Binary Trees</p>
                         <div className="w-full bg-gray-800 h-1.5 rounded-full">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-[65%] h-full rounded-full"></div>
                         </div>
                      </div>
                      <PlayCircle className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                   </div>

                   {/* Activity Heatmap (CSS Grid) */}
                   <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-gray-800">
                      <p className="text-gray-500 text-xs mb-3 font-semibold">Activity Graph</p>
                      <div className="flex gap-1 justify-between opacity-80">
                         {Array.from({ length: 16 }).map((_, i) => (
                           <div key={i} className="flex flex-col gap-1">
                              {[1,2,3,4].map((j) => (
                                 <div 
                                    key={j} 
                                    className={`w-3 h-3 rounded-[2px] ${
                                       Math.random() > 0.6 
                                          ? 'bg-green-500' 
                                          : Math.random() > 0.3 
                                             ? 'bg-green-900' 
                                             : 'bg-gray-800'
                                    }`} 
                                 />
                              ))}
                           </div>
                         ))}
                      </div>
                   </div>

                </div>
              </div>
            </div>

            {/* Floating Badge */}
            {/* <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce duration-[4000ms]">
               <div className="bg-green-100 p-2 rounded-full">
                  <Award className="w-6 h-6 text-green-600" />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Badge Unlocked</p>
                  <p className="text-sm font-bold text-gray-900">Algorithm Master</p>
               </div>
            </div> */}

          </div>
        </div>

        {/* Stats Section (Bottom) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold text-[#0652e9] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium uppercase tracking-wide text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PlatformSection;
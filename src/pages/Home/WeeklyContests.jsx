import { ArrowRight, CheckCircle, Trophy, Timer, Zap, TrendingUp, MoreHorizontal } from "lucide-react";

const WeeklyContents = () => {
  const features = [
    "Compete Globally in Real Time",
    "Fresh Coding Problems Every Week",
    "Real Interview-Level Difficulty",
    "Detailed Performance Insights",
  ];

  const contestants = [
    { rank: 1, name: "Sarah Jen.", score: "4/4", time: "00:45:12", points: 1200, initial: "S" },
    { rank: 2, name: "David K.", score: "4/4", time: "00:48:30", points: 1150, initial: "D" },
    { rank: 3, name: "Alex Ross", score: "3/4", time: "00:52:10", points: 980, initial: "A" },
    { rank: 4, name: "Maria G.", score: "3/4", time: "01:05:00", points: 850, initial: "M" },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="order-2 lg:order-1 relative z-10">
            <span className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full mb-6 text-sm font-semibold tracking-wide">
              <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
              Weekly Contests
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Prove your skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0652e9] to-blue-500">
                Top the Leaderboard.
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join thousands of developers every Sunday. Solve fresh algorithm challenges 
              under time pressure, earn badges, and see where you stand globally.
            </p>

            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="mt-1 p-0.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <CheckCircle className="w-4 h-4 text-[#0652e9]" />
                  </div>
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>

            <a
              href="/contests"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1"
            >
              Join Next Contest
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* RIGHT CONTENT: LEADERBOARD VISUALIZATION */}
          <div className="order-1 lg:order-2 relative perspective-1000">
            
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0652e9]/10 rounded-full blur-3xl" />

            {/* Main Leaderboard Card */}
            <div className="relative bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
              
              {/* Header */}
              <div className="bg-[#252526] p-6 flex justify-between items-center border-b border-[#333]">
                <div>
                   <h3 className="text-white font-bold text-lg flex items-center gap-2">
                     Weekly Contest #402
                     <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/30 animate-pulse">LIVE</span>
                   </h3>
                   <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                      <Zap className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>14,203 Participants</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-500 font-mono uppercase">Time Remaining</p>
                   <p className="text-white font-mono font-bold text-lg tracking-wider">00:24:12</p>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#1e1e1e] border-b border-[#333] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                 <div className="col-span-1">Rank</div>
                 <div className="col-span-5">User</div>
                 <div className="col-span-3 text-center">Solved</div>
                 <div className="col-span-3 text-right">Score</div>
              </div>

              {/* Rows */}
              <div className="p-2 space-y-1">
                 {contestants.map((user, i) => (
                    <div 
                      key={i} 
                      className={`grid grid-cols-12 gap-4 px-4 py-3 items-center rounded-lg transition-colors
                        ${i === 0 ? 'bg-[#2d2d2d] border border-yellow-500/20' : 'hover:bg-[#252526]'}
                      `}
                    >
                       <div className="col-span-1">
                          {i === 0 ? (
                            <Trophy className="w-5 h-5 text-yellow-400 fill-current drop-shadow-lg" />
                          ) : i === 1 ? (
                            <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-[10px] text-gray-900 font-bold">2</div>
                          ) : i === 2 ? (
                             <div className="w-5 h-5 rounded-full bg-orange-700 flex items-center justify-center text-[10px] text-orange-200 font-bold">3</div>
                          ) : (
                             <span className="text-gray-500 font-mono text-sm ml-1">{user.rank}</span>
                          )}
                       </div>
                       
                       <div className="col-span-5 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                             ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}
                          `}>
                             {user.initial}
                          </div>
                          <div>
                             <p className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-gray-300'}`}>{user.name}</p>
                             <p className="text-[10px] text-gray-500">India</p>
                          </div>
                       </div>

                       <div className="col-span-3 text-center">
                          <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded font-mono border border-green-500/20">
                            {user.score}
                          </span>
                       </div>

                       <div className="col-span-3 text-right">
                          <p className="text-white font-bold text-sm">{user.points}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{user.time}</p>
                       </div>
                    </div>
                 ))}
                 
                 {/* Fake "Load More" dots */}
                 <div className="flex justify-center py-2">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                 </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-[#252526] border-t border-[#333] flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-400">Top 50 get verified badges</span>
                 </div>
                 <button className="text-xs font-bold text-white bg-[#0652e9] px-3 py-1.5 rounded hover:bg-blue-600 transition-colors">
                    View Full Leaderboard
                 </button>
              </div>

            </div>

            {/* Floating Timer Badge (Countdown) */}
            <div className="absolute -right-4 top-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-float hidden md:block z-20">
               <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-100 p-1.5 rounded-lg">
                    <Timer className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Next Contest</span>
               </div>
               <div className="flex gap-2 text-center">
                  <div className="bg-gray-100 rounded p-1 min-w-[32px]">
                     <span className="block text-lg font-bold text-gray-900 leading-none">02</span>
                     <span className="text-[9px] text-gray-500 font-bold">D</span>
                  </div>
                  <span className="text-gray-400 font-bold mt-1">:</span>
                  <div className="bg-gray-100 rounded p-1 min-w-[32px]">
                     <span className="block text-lg font-bold text-gray-900 leading-none">14</span>
                     <span className="text-[9px] text-gray-500 font-bold">H</span>
                  </div>
                  <span className="text-gray-400 font-bold mt-1">:</span>
                  <div className="bg-gray-100 rounded p-1 min-w-[32px]">
                     <span className="block text-lg font-bold text-gray-900 leading-none">35</span>
                     <span className="text-[9px] text-gray-500 font-bold">M</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyContents;
import { Activity, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchnormalchallenges,
  fetchpastchallenges,
  fetchweeklychallenges,
  fetchChallengesCalendar,
} from "../../redux/slices/challengesSlice";
import { fetchuserchallengeprogress } from "../../redux/slices/userchallengesprogressSlice";
import { fetchGlobalLeaderboard } from "../../redux/slices/challengesGlobalLeaderboardSlice";
import Loader from "../../components/Loader";
import React from "react";
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Trophy,
  Award,
  CheckCircle,
  Users,
  User,
  Crown,
  Medal,
  Calendar,
  Clock,
  TrendingUp,
  Timer,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Loader2
} from "lucide-react";
import {
  formatDistanceToNow,
  isPast,
  isFuture,
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isWithinInterval,
} from "date-fns"; // ==========================================
// 1. DECOY COMPONENTS (Placeholders)
// ==========================================

const ContestHero = ({ active, upcoming }) => {
  const now = new Date();

  // 1. Logic: Filter for what is actually happening now or next
  const activeContest = active?.find(c => 
    isWithinInterval(now, {
      start: new Date(c.start_date),
      end: new Date(c.end_date)
    })
  );

  const upcomingContest = !activeContest && upcoming?.find(c => 
    isFuture(new Date(c.start_date))
  );

  const contest = activeContest || upcomingContest;

  const handleAction = (id) => {
    if (activeContest) {
      window.location.href = `/challenge/${id}`;
    } else {
      console.log("Registering:", id);
    }
  };

  // --- EMPTY STATE: System Standby ---
  if (!contest) {

    return (
    
      <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex items-center gap-5">
           <div className="p-3.5 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
           
              <Activity className="w-6 h-6" />
           </div>
           <div>
             <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">System Standby</h3>
             <p className="text-sm text-slate-500">All scheduled operations have concluded. Check the logs for updates.</p>
           </div>
        </div>
        <button 
          onClick={() => window.location.href = '/problems'}
          className="text-xs font-bold text-[#0652e9] bg-blue-50 px-4 py-2 rounded-lg hover:bg-[#0652e9] hover:text-white transition-all"
        >
          Browse Problem Archive
        </button>
      </div>
    );
  }

  const isLive = !!activeContest;
  const targetDate = isLive ? new Date(contest.end_date) : new Date(contest.start_date);
  
  // Progress Calculation
  const totalQ = contest.questions?.length || 1;
  const solvedQ = contest.my_progress?.questions_solved?.length || 0;
  const progressPercent = (solvedQ / totalQ) * 100;

  return (
    <div className="relative bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 mb-10 overflow-hidden group">
      
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${isLive ? "bg-red-500 shadow-[0_2px_10px_rgba(239,68,68,0.3)]" : "bg-[#0652e9]"}`}></div>

      <div className="p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* LEFT: Core Info */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black bg-red-50 text-red-600 border border-red-100 uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Live Session
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 text-[#0652e9] border border-blue-100 uppercase tracking-widest">
                <CalendarIcon className="w-3 h-3" /> Scheduled
              </span>
            )}
            <span className="text-xs font-mono font-bold text-slate-400">
              {format(new Date(contest.start_date), "MMM d, HH:mm")} UTC
            </span>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-[#0652e9] transition-colors">
              {contest.title}
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
              {contest.description || "Deploy your skills in this ranked algorithmic challenge. Climb the ladder and earn your spot."}
            </p>
          </div>
          
          {/* Metadata Grid */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
             <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${isLive ? "bg-red-50" : "bg-blue-50"}`}>
                   <Timer className={`w-4 h-4 ${isLive ? "text-red-500" : "text-[#0652e9]"}`} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isLive ? "Ends" : "Starts"} In</span>
                   <span className={`text-sm font-bold font-mono ${isLive ? "text-red-600" : "text-slate-700"}`}>
                     {formatDistanceToNow(targetDate)}
                   </span>
                </div>
             </div>

             {contest.total_participants > 0 && (
               <div className="flex items-center gap-2.5 pl-6 border-l border-slate-100">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Participants</span>
                     <span className="text-sm font-bold text-slate-700 font-mono">
                       {contest.total_participants.toLocaleString()}
                     </span>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* RIGHT: Status & CTA */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-5">
           {isLive && solvedQ > 0 && (
             <div className="w-full sm:w-64">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Progress</span>
                 <span className="text-sm font-black text-[#0652e9] font-mono">{Math.round(progressPercent)}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                 <div 
                   className="h-full bg-[#0652e9] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(6,82,233,0.4)]" 
                   style={{ width: `${progressPercent}%` }}
                 ></div>
               </div>
             </div>
           )}

           <button
             onClick={() => handleAction(contest._id)}
             className={`
               group/btn relative w-full lg:w-auto px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden
               ${isLive 
                 ? "bg-[#0652e9] text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95" 
                 : "bg-white text-slate-900 border-2 border-slate-100 hover:border-[#0652e9] hover:text-[#0652e9] hover:-translate-y-1 active:scale-95"
               }
             `}
           >
             <span className="relative z-10 flex items-center gap-2">
               {isLive ? <Zap className="w-4 h-4 fill-white" /> : <Target className="w-4 h-4" />}
               {isLive ? "Initialize Session" : "Request Entry"}
             </span>
             {/* Subtle button glare effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
           </button>
        </div>
      </div>
    </div>
  );
};


const UserStatsCard = ({ streak }) => {
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  const weeksActive = streak?.weeks_participated?.length || 0;
  
  // Minimalist date formatting
  const lastPlayed = streak?.last_participation
    ? format(new Date(streak.last_participation), "MMM d")
    : "-";

  const isActive = currentStreak > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6">
      
      {/* 1. MAIN STAT (Current Streak) */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Current Streak
          </h3>
          <div className="flex items-baseline gap-1">
             <span className={`text-5xl font-bold tracking-tight ${isActive ? "text-slate-900" : "text-gray-300"}`}>
               {currentStreak}
             </span>
             <span className="text-sm font-medium text-gray-400">days</span>
          </div>
        </div>
        
        {/* Minimal Icon Indicator */}
        <div className={`
           w-10 h-10 rounded-full flex items-center justify-center transition-colors
           ${isActive ? "bg-orange-50 text-orange-500" : "bg-gray-50 text-gray-300"}
        `}>
           <Flame className={`w-5 h-5 ${isActive ? "fill-orange-500" : ""}`} />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100"></div>

      {/* 2. SECONDARY STATS (Grid) */}
      <div className="grid grid-cols-3 gap-4">
        
        {/* Max Streak */}
        <div className="flex flex-col">
           <div className="flex items-center gap-1.5 mb-1 text-gray-400">
              <Trophy className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Max</span>
           </div>
           <span className="text-lg font-bold text-slate-900">{longestStreak}</span>
        </div>

        {/* Active Weeks */}
        <div className="flex flex-col border-l border-gray-100 pl-4">
           <div className="flex items-center gap-1.5 mb-1 text-gray-400">
              <CalendarIcon className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Weeks</span>
           </div>
           <span className="text-lg font-bold text-slate-900">{weeksActive}</span>
        </div>

        {/* Last Active */}
        <div className="flex flex-col border-l border-gray-100 pl-4">
           <div className="flex items-center gap-1.5 mb-1 text-gray-400">
              <Activity className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Last</span>
           </div>
           <span className="text-lg font-bold text-slate-900">{lastPlayed}</span>
        </div>

      </div>
    </div>
  );
};


const MiniCalendar = ({ calendarData = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- 1. Calendar Generation ---
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // --- 2. Data Helpers ---
  const getEventsForDay = (day) => {
    return calendarData.filter((event) =>
      isSameDay(new Date(event.start_date), day)
    );
  };

  const upcomingEvents = calendarData
    .filter((event) => isFuture(new Date(event.start_date)))
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(0, 3);

  // --- 3. Handlers ---
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-300">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#0652e9]" />
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-slate-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-slate-600 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-3 text-center">
          {weekDays.map((day, i) => (
            <div key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {calendarDays.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const hasEvent = dayEvents.length > 0;
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            return (
              <div key={idx} className="relative flex flex-col items-center group/day">
                <div className={`
                   w-8 h-8 flex items-center justify-center text-xs rounded-lg transition-all cursor-default
                   ${!isCurrentMonth ? "text-gray-200" : "text-gray-600"}
                   ${isTodayDate 
                      ? "bg-[#0652e9] text-white font-bold shadow-md shadow-blue-200" 
                      : hasEvent 
                        ? "bg-blue-50 text-[#0652e9] font-bold" 
                        : "hover:bg-gray-50"}
                `}>
                  {format(day, "d")}
                  
                  {/* Event Marker */}
                  {hasEvent && !isTodayDate && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#0652e9]"></div>
                  )}
                  {hasEvent && isTodayDate && (
                     <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white"></div>
                  )}
                </div>

                {/* Tooltip */}
                {hasEvent && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover/day:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
                    <div className="font-bold mb-1 border-b border-gray-700 pb-1 text-gray-300">
                      {format(day, "MMM d")}
                    </div>
                    {dayEvents.map((e) => (
                      <div key={e._id} className="truncate py-0.5">
                        • {e.title}
                      </div>
                    ))}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Upcoming List Footer */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Clock className="w-3 h-3" /> Next Events
          </h4>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex gap-3 group cursor-pointer hover:bg-gray-50/80 p-2 rounded-xl -mx-2 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white border border-gray-100 text-slate-700 rounded-lg flex flex-col items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:text-[#0652e9] transition-colors">
                    <span className="text-[9px] font-bold uppercase leading-none mb-0.5 opacity-60">
                      {format(new Date(event.start_date), "MMM")}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {format(new Date(event.start_date), "d")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <div className="text-sm font-bold text-slate-800 truncate group-hover:text-[#0652e9] transition-colors">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {format(new Date(event.start_date), "h:mm a")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400 py-2 italic">
              No upcoming events scheduled
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TopRankersList = ({ leaderboard = [], myRank }) => {
  // Take only the top 5 for the sidebar widget
  const topRankers = leaderboard.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#0652e9]" />
          Top Performers
        </h3>
        {/* Optional: You can re-add the 'View All' link if needed, 
            but in a dashboard widget, cleaner is often better. */}
      </div>

      {/* List */}
      <div className="flex flex-col">
        {topRankers.length > 0 ? (
          topRankers.map((user, index) => {
             const isTop3 = index < 3;
             return (
              <div 
                key={user._id || index} 
                className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0 cursor-default"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`
                     w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold
                     ${index === 0 ? "bg-yellow-100 text-yellow-600" : 
                       index === 1 ? "bg-gray-100 text-gray-600" : 
                       index === 2 ? "bg-orange-100 text-orange-600" : "bg-white text-gray-400 border border-gray-100"}
                  `}>
                    {index === 0 ? <Crown className="w-3.5 h-3.5" /> : 
                     index === 1 ? <Medal className="w-3.5 h-3.5" /> : 
                     index === 2 ? <Medal className="w-3.5 h-3.5" /> : 
                     `#${index + 1}`}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm group-hover:border-blue-100 group-hover:text-[#0652e9] transition-all">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 leading-none group-hover:text-[#0652e9] transition-colors">
                        {user.username || "Anonymous"}
                      </span>
                      {/* Optional: Add "Solved" count if you want more data density 
                      <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                        {user.total_challenges_completed || 0} solved
                      </span>
                      */}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-xs font-mono font-bold text-gray-400 group-hover:text-[#0652e9] transition-colors">
                <span className="flex items-center gap-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 fill-orange-600" />
                     {user?.current_streak || 0}
                  </div>
                  
                </span>              
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-gray-400">
             No rankings available yet.
          </div>
        )}
      </div>

      {/* My Rank Footer */}
      {myRank && myRank > 5 && (
        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
           <span className="text-xs font-medium text-gray-500">Your current rank</span>
           <span className="text-sm font-bold text-[#0652e9]">#{myRank}</span>
        </div>
      )}
    </div>
  );
};


const ContestTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "weekly",
      label: "Weekly Contests",
      icon: Trophy,
      badge: "LIVE",
    },
    {
      id: "normal",
      label: "All Challenges",
      icon: Target,
    },
    {
      id: "past",
      label: "Past Archive",
      icon: Clock,
    },
    {
      id: "leaderboard",
      label: "Global Ranking",
      icon: Award,
    },
  ];

  return (
    <div className="flex p-1.5 bg-white border border-gray-200 rounded-2xl mb-8 shadow-sm overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap outline-none select-none
              ${
                isActive
                  ? "bg-[#0652e9] text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500"
                  : "text-gray-500 hover:bg-gray-50 hover:text-slate-900"
              }
            `}
          >
            <Icon
              className={`w-4 h-4 transition-transform duration-300 ${
                isActive ? "text-white scale-110" : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
            <span>{tab.label}</span>

            {/* Badge Logic */}
            {tab.badge && (
              <span
                className={`
                  ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide
                  ${
                    isActive
                      ? "bg-white text-[#0652e9]"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }
                `}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const ContestCard = ({ contest }) => {
  const startDate = new Date(contest.start_date);
  const endDate = new Date(contest.end_date);
  
  // Logic
  const isLive = isPast(startDate) && isFuture(endDate);
  const isUpcoming = isFuture(startDate);
  const isEnded = isPast(endDate);

  // Progress
  const totalQuestions = contest.questions?.length || 0;
  const questionsSolved = contest.my_progress?.questions_solved?.length || 0;
  const progressPercent = totalQuestions > 0 ? (questionsSolved / totalQuestions) * 100 : 0;
  const isCompleted = questionsSolved === totalQuestions && totalQuestions > 0;

  const handleClick = () => {
    if (isUpcoming) {
      console.log("Register logic");
    } else {
      window.location.href = `/challenge/${contest._id}`;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-white border border-gray-200 rounded-2xl p-6 mb-4 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start gap-6 overflow-hidden"
    >
      {/* Active Indicator Bar */}
      {isLive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 animate-pulse"></div>
      )}
      
      {/* Icon / Date Box */}
      <div className={`
         flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-colors
         ${isLive ? "bg-red-50 border-red-100" : isCompleted ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100"}
      `}>
         {isLive ? (
           <>
             <span className="text-[10px] font-bold text-red-500 uppercase">Ends</span>
             <span className="text-xl font-bold text-red-600">{format(endDate, "d")}</span>
           </>
         ) : (
           <>
             <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-blue-500">{format(startDate, "MMM")}</span>
             <span className="text-xl font-bold text-slate-800 group-hover:text-[#0652e9]">{format(startDate, "d")}</span>
           </>
         )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-[#0652e9] transition-colors">
            {contest.title}
          </h3>
          {isLive && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-wide border border-red-200">
              Live
            </span>
          )}
          {isUpcoming && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wide border border-blue-100">
              Upcoming
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {isLive ? (
              <span className="text-red-500 font-bold">Ends in {formatDistanceToNow(endDate)}</span>
            ) : isUpcoming ? (
              <span>Starts in {formatDistanceToNow(startDate)}</span>
            ) : (
              <span>Ended {formatDistanceToNow(endDate)} ago</span>
            )}
          </span>
          
          {contest.total_participants > 0 && (
             <>
               <span className="text-gray-300">|</span>
               <span className="flex items-center gap-1.5">
                 <Users className="w-3.5 h-3.5" />
                 {contest.total_participants} Participants
               </span>
             </>
          )}
        </div>

        {/* Progress Bar */}
        {!isUpcoming && (questionsSolved > 0 || isLive) && (
          <div className="mt-4 flex items-center gap-3 max-w-sm">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-[#0652e9]"}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-gray-400">
               {questionsSolved}/{totalQuestions}
            </span>
          </div>
        )}
      </div>

      {/* Action Button (Visible on Hover/Mobile) */}
      <div className="w-full sm:w-auto self-center sm:opacity-0 sm:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <button className={`
          w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all
          ${isLive 
             ? "bg-[#0652e9] text-white shadow-md hover:bg-blue-700" 
             : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-[#0652e9]"}
        `}>
          {isLive ? "Enter" : isUpcoming ? "Register" : "Practice"}
          {isLive && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
};
// ==========================================
// 2. PARENT COMPONENT: ContestList
// ==========================================
const ContestList = ({ data, type }) => {
  // --- Empty State: System Message ---
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-dashed border-gray-200 rounded-2xl text-center group hover:border-blue-200 transition-colors duration-300">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Trophy className="w-8 h-8 text-gray-300 group-hover:text-[#0652e9] transition-colors" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
          No {type} Data
        </h3>
        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
          {type === "Upcoming"
            ? "No events are currently scheduled in the calendar."
            : "The archives for this category are currently empty."}
        </p>
      </div>
    );
  }

  // --- Header & List ---
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Section Header */}
      <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
           <div className="w-1 h-4 bg-[#0652e9] rounded-full"></div>
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
             {type === "Weekly" ? "Active Cycles" : type === "Past" ? "Archived Logs" : "Challenge List"}
           </h3>
        </div>
        
        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#0652e9] border border-blue-100">
          {data.length} RECORDS
        </span>
      </div>

      {/* The Cards */}
      <div className="space-y-4">
        {data.map((contest) => (
          <ContestCard key={contest._id} contest={contest} />
        ))}
      </div>
      
    </div>
  );
};

const GlobalLeaderboardTable = ({ data, currentUser }) => {

  // Helper: Rank Visuals
  const renderRankBadge = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-sm" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400 fill-slate-400 drop-shadow-sm" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400 fill-orange-400 drop-shadow-sm" />;
    return <span className="font-mono font-bold text-slate-400">#{rank}</span>;
  };

  // --- Empty State ---
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <Trophy className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Leaderboard Empty</h3>
        <p className="text-slate-500 text-sm">Be the first to claim a spot on the grid.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest backdrop-blur-sm">
              <th className="px-6 py-4 w-24 text-center">Rank</th>
              <th className="px-6 py-4">Participant</th>
              <th className="px-6 py-4 text-center">Streak</th>
              <th className="px-6 py-4 text-center">Solved</th>
             
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-50">
            {data.slice(0, 100).map((user, index) => {
              const rank = index + 1;
              const isMe = currentUser && user.user_id === currentUser._id;
              
              return (
                <tr 
                  key={user._id || index} 
                  className={`
                    group transition-all duration-200 hover:bg-blue-50/40
                    ${isMe ? "bg-blue-50/60 hover:bg-blue-50/80 shadow-[inset_3px_0_0_#0652e9]" : ""}
                  `}
                >
                  {/* Rank */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      {renderRankBadge(rank)}
                    </div>
                  </td>

                  {/* User Profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-colors
                        ${isMe 
                           ? "bg-blue-100 text-[#0652e9] border-blue-200" 
                           : "bg-white text-gray-500 border-gray-100 group-hover:border-blue-100 group-hover:text-slate-700"}
                      `}>
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>

                      {/* Name & Meta */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isMe ? "text-[#0652e9]" : "text-slate-700 group-hover:text-slate-900"}`}>
                            {user.username || "Anonymous"}
                          </span>
                          {isMe && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#0652e9] text-white tracking-wide">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 font-medium">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.last_participation ? "bg-green-400" : "bg-gray-300"}`}></div>
                          {user.last_participation ? formatDistanceToNow(new Date(user.last_participation), { addSuffix: true }) : "Inactive"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 fill-orange-600" />
                      {user.current_streak || 0}
                    </div>
                  </td>

                  {/* Solved Count */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-300 text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5 fill-green-100" />
                      {user.total_challenges_completed || 0}
                    </div>
                  </td>

                  
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <span>Top 100 Global Developers</span>
        <span className="flex items-center gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
           Live Updates
        </span>
      </div>
    </div>
  );
};
// ==========================================
// 2. MAIN LAYOUT COMPONENT
// ==========================================
const WeeklyChallenges = () => {
  const [activeTab, setActiveTab] = useState("weekly");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // --- Data Synchronization ---
  useEffect(() => {
    dispatch(fetchweeklychallenges());
    dispatch(fetchpastchallenges({ skip: 0, limit: 10 }));
    dispatch(fetchnormalchallenges());
    dispatch(fetchGlobalLeaderboard());
    dispatch(fetchChallengesCalendar());
    if (user) dispatch(fetchuserchallengeprogress());
  }, [dispatch, user]);

  // --- State Selectors ---
  const { weeklycontests, loading } = useSelector((state) => state.weeklyChallenges);
  const { streak } = useSelector((state) => state.userChallengesprogress);
  const { pastchallenges } = useSelector((state) => state.pastChallenges);
  const { normalContests } = useSelector((state) => state.normalChallenges);
  const { leaderboard, myRank } = useSelector((state) => state.globalLeaderboard);
  const { calender_upcoming } = useSelector((state) => state.challengesCalendar);

  // --- 1. SYSTEM LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <Loader/>
      </div>
    );
  }

  // --- 2. MAIN LAYOUT ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-[#0652e9] selection:text-white pb-24">
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
          <ContestHero upcoming={calender_upcoming} active={weeklycontests} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Interface (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Sticky Navigation Tabs */}
            <div className="sticky top-4 z-30 bg-[#F8FAFC]/80 backdrop-blur-md py-2 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
              <ContestTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Dynamic Feed */}
            <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
              {activeTab === "weekly" && (
                <ContestList data={weeklycontests} type="Weekly" />
              )}
              {activeTab === "normal" && (
                <ContestList data={normalContests} type="Normal" />
              )}
              {activeTab === "past" && (
                <ContestList data={pastchallenges} type="Past" />
              )}
              {activeTab === "leaderboard" && (
                <GlobalLeaderboardTable data={leaderboard} currentUser={user} />
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: HUD Sidebar (4 cols) */}
          {/* Sticky position ensures stats are always visible during deep scrolling */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
            
            <UserStatsCard streak={streak} />
            
            <MiniCalendar calendarData={calender_upcoming} />
            
            <TopRankersList leaderboard={leaderboard} myRank={myRank} />

            {/* System Footer */}
            <div className="pt-8 border-t border-slate-200 text-center">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   Systems Operational
                 </span>
               </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};
export default WeeklyChallenges;

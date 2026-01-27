import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchnormalchallenges,
  fetchpastchallenges,
  fetchweeklychallenges,
  fetchChallengesCalendar,
} from "../../redux/slices/challengesSlice";
import { fetchuserchallengeprogress } from "../../redux/slices/userchallengesprogressSlice";
import { fetchGlobalLeaderboard } from "../../redux/slices/challengesGlobalLeaderboardSlice";
import { Loader } from "lucide-react";
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
} from "date-fns"; // ==========================================
// 1. DECOY COMPONENTS (Placeholders)
// ==========================================

const ContestHero = ({ active, upcoming }) => {
  // 1. Determine which contest to feature (Priority: Active > Upcoming > None)
  const activeContest = active && active.length > 0 ? active[0] : null;
  const upcomingContest =
    !activeContest && upcoming && upcoming.length > 0 ? upcoming[0] : null;
  const contest = activeContest || upcomingContest;

  // 2. Helper to handle navigation
  const handleAction = (id) => {
    if (activeContest) {
      window.location.href = `/challenge/${id}`;
    } else {
      console.log("Registering for contest:", id);
      // Add dispatch(registerForContest(id)) here
    }
  };

  // 3. Render Empty State if no data
  if (!contest) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold mb-2">Sharpen Your Skills</h2>
            <p className="text-gray-300 max-w-md">
              No contests are currently scheduled. Explore our problem archive
              to keep your streak alive!
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Browse Problems
          </button>
        </div>
      </div>
    );
  }

  // 4. Determine display variables based on state
  const isLive = !!activeContest;
  const badgeText = isLive ? "LIVE CONTEST" : "UPCOMING CONTEST";
  const badgeStyle = isLive
    ? "bg-red-500/10 text-red-600 border-red-500/20"
    : "bg-blue-500/10 text-blue-600 border-blue-500/20";

  const dateLabel = isLive ? "Ends in" : "Starts in";
  const targetDate = isLive
    ? new Date(contest.end_date)
    : new Date(contest.start_date);

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 mb-8 group">
      {/* Decorative Background Elements */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${isLive ? "from-red-50 to-orange-50" : "from-blue-50 to-indigo-50"} rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-4">
          {/* Badge & Meta */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-xs font-bold tracking-wider rounded-full border ${badgeStyle} flex items-center gap-1.5`}
            >
              {isLive ? (
                <Zap className="w-3 h-3 fill-current" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              {badgeText}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(contest.start_date), "MMM d, yyyy")}
            </span>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight mb-1">
              {contest.title}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base line-clamp-2 max-w-xl">
              {contest.description ||
                "Join developers worldwide in this challenge. Solve algorithmic problems and climb the leaderboard."}
            </p>
          </div>

          {/* Timer / Status */}
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <div
              className={`p-2 rounded-lg ${isLive ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}
            >
              <Timer className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                {dateLabel}
              </span>
              <span className="text-sm font-mono font-semibold">
                {formatDistanceToNow(targetDate, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action (Desktop) */}
        <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => handleAction(contest._id)}
            className={`
              w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2
              ${
                isLive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-red-600 hover:to-orange-700"
                  : "bg-gray-900 hover:bg-black shadow-gray-200"
              }
            `}
          >
            {isLive ? (
              <>
                <Zap className="w-5 h-5 fill-white" />
                Enter Contest
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Register Now
              </>
            )}
            <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
          </button>

          {/* Participant Count (Optional aesthetic) */}
          {contest.total_participants > 0 && (
            <div className="mt-3 text-center md:text-right text-xs text-gray-400 font-medium">
              <span className="text-gray-700 font-bold">
                {contest.total_participants.toLocaleString()}
              </span>{" "}
              registered
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar (Only visible if Live and user has progress) */}
      {isLive && contest.my_progress && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all duration-1000"
            style={{
              width: `${((contest.my_progress.questions_solved?.length || 0) / (contest.questions?.length || 1)) * 100}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

const UserStatsCard = ({ streak }) => {
  // 1. Safe access to data with defaults
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  const weeksActive = streak?.weeks_participated?.length || 0;
  const lastPlayed = streak?.last_participation
    ? format(new Date(streak.last_participation), "MMM d, yyyy")
    : "Never";

  // 2. Determine "Heat" level for the flame visual
  const isActive = currentStreak > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header / Title */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          My Progress
        </h3>
      </div>

      <div className="p-5">
        {/* Primary Stat: Current Streak */}
        <div className="flex items-center justify-between mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100 relative overflow-hidden group">
          {/* Animated Background Effect */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400 rounded-full blur-2xl opacity-10 -mr-4 -mt-4 group-hover:opacity-20 transition-opacity"></div>

          <div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              Current Streak
            </div>
            <div className="text-3xl font-black text-gray-900 leading-none">
              {currentStreak}{" "}
              <span className="text-sm font-medium text-gray-500">days</span>
            </div>
          </div>

          <div
            className={`
            w-12 h-12 rounded-full flex items-center justify-center shadow-sm
            ${isActive ? "bg-gradient-to-br from-orange-400 to-red-500 text-white" : "bg-gray-200 text-gray-400"}
          `}
          >
            <Flame
              className={`w-6 h-6 ${isActive ? "animate-pulse" : ""}`}
              fill={isActive ? "currentColor" : "none"}
            />
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Longest Streak */}
          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-semibold text-gray-500">
                Max Streak
              </span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              {longestStreak}
            </div>
          </div>

          {/* Weeks Active */}
          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-500">
                Active Weeks
              </span>
            </div>
            <div className="text-lg font-bold text-gray-800">{weeksActive}</div>
          </div>

          {/* Last Played (Full Width) */}
          <div className="col-span-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-gray-500">
                Last Participation
              </span>
            </div>
            <div className="text-sm font-bold text-gray-800">{lastPlayed}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniCalendar = ({ calendarData = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- 1. Calendar Generation Logic ---
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // --- 2. Data Helpers ---
  // Check if a specific day has a contest
  const getEventsForDay = (day) => {
    return calendarData.filter((event) =>
      isSameDay(new Date(event.start_date), day),
    );
  };

  // Get next 3 upcoming events for the list below
  const upcomingEvents = calendarData
    .filter((event) => isFuture(new Date(event.start_date)))
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(0, 3);

  // --- 3. Handlers ---
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-purple-500" />
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-200 rounded text-gray-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-200 rounded text-gray-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className="text-center text-xs font-semibold text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-2">
          {calendarDays.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const hasEvent = dayEvents.length > 0;
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            return (
              <div
                key={idx}
                className="relative flex flex-col items-center group"
              >
                <div
                  className={`
                    w-8 h-8 flex items-center justify-center text-xs rounded-full transition-all cursor-default
                    ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                    ${isTodayDate ? "bg-purple-100 text-purple-700 font-bold" : ""}
                    ${hasEvent && isCurrentMonth && !isTodayDate ? "bg-gray-100 font-semibold text-gray-900" : ""}
                  `}
                >
                  {format(day, "d")}
                </div>

                {/* Event Dot Marker */}
                {hasEvent && (
                  <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-purple-500"></div>
                )}

                {/* Tooltip on Hover */}
                {hasEvent && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 text-white text-xs rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
                    <div className="font-semibold mb-1">
                      {format(day, "MMM d")}
                    </div>
                    {dayEvents.map((e) => (
                      <div key={e._id} className="truncate">
                        • {e.title}
                      </div>
                    ))}
                    {/* Tiny arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Upcoming List Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Upcoming
          </h4>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex flex-col items-center justify-center border border-purple-100">
                    <span className="text-[10px] font-bold uppercase leading-none mb-0.5">
                      {format(new Date(event.start_date), "MMM")}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {format(new Date(event.start_date), "d")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {format(new Date(event.start_date), "h:mm a")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400 py-2">
              No upcoming events
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

  // Helper to render rank icons
  const renderRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case 1:
        return <Medal className="w-4 h-4 text-gray-400 fill-gray-400" />;
      case 2:
        return <Medal className="w-4 h-4 text-orange-400 fill-orange-400" />;
      default:
        return <span className="text-xs font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          Top Rankers
        </h3>
        {/* Optional: Link to full leaderboard tab */}
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center">
          View All
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {topRankers.length > 0 ? (
          topRankers.map((user, index) => (
            <div 
              key={user._id || index} 
              className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                {/* Rank Icon/Number */}
                <div className="w-6 flex justify-center">
                  {renderRankIcon(index)}
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:scale-105 transition-transform">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 leading-none">
                      {user.username || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium mt-1">
                      {user.total_challenges_completed || 0} solved
                    </span>
                  </div>
                </div>
              </div>

              {/* Score Pill */}
              <div className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-[10px] font-bold group-hover:bg-white group-hover:shadow-sm transition-all">
                {user.total_points || 0} pts
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-xs text-gray-400">No rankings yet</p>
          </div>
        )}
      </div>

      {/* My Rank Footer */}
      {myRank && myRank > 5 && (
        <div className="bg-blue-50/50 px-5 py-3 border-t border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-blue-600">#{myRank}</span>
            <span className="text-sm font-medium text-gray-700">You</span>
          </div>
          <ArrowRight className="w-3 h-3 text-blue-400" />
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
      badge: "NEW",
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
    <div className="border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4 sm:px-0 sm:bg-transparent">
      <nav
        className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 outline-none
                ${
                  isActive
                    ? "border-blue text-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`
                  mr-2 h-4 w-4 transition-colors
                  ${isActive ? "text-blue" : "text-gray-400 group-hover:text-gray-500"}
                `}
              />
              <span>{tab.label}</span>

              {/* Optional Badge */}
              {tab.badge && (
                <span
                  className={`
                  ml-2 py-0.5 px-2 rounded-full text-[10px] font-bold
                  ${
                    isActive
                      ? "bg-blue text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }
                `}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
const ContestCard = ({ contest }) => {
  // --- Logic Helpers ---
  const now = new Date();
  const startDate = new Date(contest.start_date);
  const endDate = new Date(contest.end_date);

  const isLive = isPast(startDate) && isFuture(endDate);
  const isUpcoming = isFuture(startDate);
  const isEnded = isPast(endDate);

  const totalQuestions = contest.questions?.length || 0;
  const questionsSolved = contest.my_progress?.questions_solved?.length || 0;
  const progressPercent =
    totalQuestions > 0 ? (questionsSolved / totalQuestions) * 100 : 0;
  const isCompleted = questionsSolved === totalQuestions && totalQuestions > 0;

  // --- Handlers ---
  const handleClick = () => {
    if (isUpcoming) {
      console.log("Register logic here");
    } else {
      window.location.href = `/challenge/${contest._id}`;
    }
  };

  return (
    <div className="group bg-white border border-blue-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* Icon Column */}
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
          isLive
            ? "bg-red-50 text-red-600"
            : isCompleted
              ? "bg-green-50 text-green-600"
              : "bg-blue-100 text-blue-500"
        }`}
      >
        {isLive ? (
          <Trophy className="w-6 h-6" />
        ) : isCompleted ? (
          <CheckCircle className="w-6 h-6" />
        ) : (
          <Target className="w-6 h-6" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-blue-900 truncate group-hover:text-blue-600 transition-colors">
            {contest.title}
          </h3>
          {isLive && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-wide animate-pulse">
              Live
            </span>
          )}
          {isUpcoming && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 uppercase tracking-wide">
              Upcoming
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-blue-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {format(startDate, "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" />
            {isLive ? (
              <span className="text-red-600 font-medium">
                Ends in {formatDistanceToNow(endDate)}
              </span>
            ) : isUpcoming ? (
              <span>Starts in {formatDistanceToNow(startDate)}</span>
            ) : (
              <span>Ended</span>
            )}
          </span>
          {contest.total_participants > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {contest.total_participants}
            </span>
          )}
        </div>

        {/* Progress Bar (Only if started and has activity) */}
        {!isUpcoming && (questionsSolved > 0 || isLive) && (
          <div className="mt-3 max-w-xs">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-blue-600">Progress</span>
              <span className="font-medium text-blue-900">
                {questionsSolved} / {totalQuestions}
              </span>
            </div>
            <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-blue-600"}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
        <button
          onClick={handleClick}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border ${
            isLive
              ? "bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-sm"
              : isUpcoming
                ? "bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-white hover:border-blue-300"
          }`}
        >
          {isLive ? "Enter Contest" : isUpcoming ? "Register" : "Practice"}
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
  // Empty State Logic
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          No {type} Contests Found
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          {type === "Upcoming"
            ? "Stay tuned! New challenges are being scheduled."
            : "Check back later or try browsing our past archives."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header (Optional) */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {type === "Weekly"
            ? "Weekly Challenges"
            : type === "Past"
              ? "Past Archive"
              : "All Contests"}
        </h3>
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {data.length} Total
        </span>
      </div>

      {/* List */}
      {data.map((contest) => (
        <ContestCard key={contest._id} contest={contest} />
      ))}
    </div>
  );
};

const GlobalLeaderboardTable = ({ data, currentUser }) => {

  // Helper to render rank icons/styles
  const renderRankBadge = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400 fill-orange-400" />;
    return <span className="font-mono font-bold text-gray-500">#{rank}</span>;
  };

  // Empty State
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Leaderboard Empty</h3>
        <p className="text-gray-500">Be the first to participate and claim your spot!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 w-20 text-center">Rank</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4 text-center">Streak</th>
              <th className="px-6 py-4 text-center">Solved</th>
              <th className="px-6 py-4 text-center">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.slice(0, 100).map((user, index) => {
              const rank = index + 1;
              const isMe = currentUser && user.user_id === currentUser._id;
              
              return (
                <tr 
                  key={user._id || index} 
                  className={`
                    group transition-colors hover:bg-gray-50
                    ${isMe ? "bg-blue-50/50 hover:bg-blue-50" : ""}
                  `}
                >
                  {/* Rank Column */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {renderRankBadge(rank)}
                    </div>
                  </td>

                  {/* User Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-gray-900 ${isMe ? "text-blue-700" : ""}`}>
                            {user.username || "Anonymous"}
                          </span>
                          {isMe && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 border border-blue-200">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Last active {user.last_participation ? formatDistanceToNow(new Date(user.last_participation), { addSuffix: true }) : "Unknown"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Streak Column */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      {user.current_streak || 0}
                    </div>
                  </td>

                  {/* Solved Column */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {user.total_challenges_completed || 0}
                    </div>
                  </td>

                  {/* Score Column */}
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono font-bold text-gray-900 text-sm">
                      {user.total_points || 0}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
        <span>Showing top 100 participants</span>
        <span>Updated automatically after every contest</span>
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

  // --- Data Fetching Preserved ---
  useEffect(() => {
    dispatch(fetchweeklychallenges());
    dispatch(fetchpastchallenges({ skip: 0, limit: 10 }));
    dispatch(fetchnormalchallenges());
    dispatch(fetchGlobalLeaderboard());
    dispatch(fetchChallengesCalendar());
    if (user) dispatch(fetchuserchallengeprogress());
  }, [dispatch, user]);

  // --- Selectors ---
  const { weeklycontests, loading } = useSelector(
    (state) => state.weeklyChallenges,
  );
  const { streak } = useSelector((state) => state.userChallengesprogress);
  const { pastchallenges } = useSelector((state) => state.pastChallenges);
  const { normalContests } = useSelector((state) => state.normalChallenges);
  const { leaderboard, myRank } = useSelector(
    (state) => state.globalLeaderboard,
  );
  const { calender_upcoming } = useSelector(
    (state) => state.challengesCalendar,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-gray-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8 font-sans text-gray-900">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. HERO SECTION (Full Width) */}
        {/* Shows the most relevant "Action" right now (Join active contest, or Next contest timer) */}
        <section className="mb-8">
          <ContestHero upcoming={calender_upcoming} active={weeklycontests} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 2. MAIN CONTENT COLUMN (Left - 8 Columns) */}
          <div className="lg:col-span-8">
            {/* Filter/Navigation Tabs */}
            <ContestTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content Area */}
            <div className="min-h-[500px]">
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
                <GlobalLeaderboardTable data={leaderboard} />
              )}
            </div>
          </div>

          {/* 3. SIDEBAR COLUMN (Right - 4 Columns) */}
          {/* Sticks to top when scrolling on large screens */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Progress / Streak */}
            <UserStatsCard streak={streak} />

            {/* Mini Calendar / Upcoming Events */}
            <MiniCalendar calendarData={calender_upcoming} />

            {/* Mini Leaderboard (Top 5 preview) */}
            <TopRankersList leaderboard={leaderboard} myRank={myRank} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChallenges;

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Info, Trophy, User, Calendar, Flame, Medal,Eye, CheckCircle, Clock, Target, TrendingUp, Award, Users, Zap, ChevronRight, Star, Play, AlertCircle, Timer, HelpCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchnormalchallenges, fetchpastchallenges, fetchweeklychallenges, fetchChallengesCalendar } from "../../redux/slices/challengesSlice"
import { fetchuserchallengeprogress } from "../../redux/slices/userchallengesprogressSlice"
import { fetchGlobalLeaderboard } from '../../redux/slices/challengesGlobalLeaderboardSlice';

const WeeklyChallenges = () => {
  const [activeTab, setActiveTab] = useState('weekly');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchweeklychallenges());
    dispatch(fetchpastchallenges({ skip: 0, limit: 10 }));
    dispatch(fetchnormalchallenges());
    dispatch(fetchGlobalLeaderboard())
    dispatch(fetchChallengesCalendar())
    if (user)
      dispatch(fetchuserchallengeprogress());
  }, [dispatch, user]);

  const { weeklycontests, loading, error } = useSelector((state) => state.weeklyChallenges);
  const { streak, progress, progressloading } = useSelector((state) => state.userChallengesprogress);
  const { pastchallenges, total, skip, limit } = useSelector((state) => state.pastChallenges);
  const { normalContests, normalContestsLoading, normalContestsError } = useSelector((state) => state.normalChallenges);
  const {leaderboard , myRank, totalUsers,leaderboardLoading, leaderboardError} = useSelector((state)=> state.globalLeaderboard);
  const {calender_current,calender_upcoming,calender_past,calender_loading,calender_error} = useSelector((state) => state.challengesCalendar);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffHours = Math.floor((end - start) / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d ${diffHours % 24}h`;
  };

  // Calculate contest status
  

  // Get status info
  const getStatusInfo = (status) => {
    //const status = getContestStatus(startDate, endDate);
    switch (status) {
      case 'upcoming':
        return { 
          text: 'UPCOMING', 
          color: 'bg-purple-100 text-purple-800',
          badgeColor: 'bg-purple-500'
        };
      case 'active':
        return { 
          text: 'LIVE NOW', 
          color: 'bg-red-100 text-red-800',
          badgeColor: 'bg-red-500 animate-pulse'
        };
      case 'completed':
        return { 
          text: 'COMPLETED', 
          color: 'bg-green-100 text-green-800',
          badgeColor: 'bg-green-500'
        };
      default:
        return { 
          text: 'UPCOMING', 
          color: 'bg-gray-100 text-gray-800',
          badgeColor: 'bg-gray-500'
        };
    }
  };

  // Calculate total points
  const calculateTotalPoints = (questions) => {
    if (!questions || !Array.isArray(questions)) return 0;
    return questions.reduce((acc, cur) => acc + (cur.points || 0), 0);
  };

  const tabs = [
    { id: 'weekly', icon: Trophy, label: 'Weekly Contests', badge: weeklycontests?.length > 0 ? 'LIVE' : null, color: 'red' },
    { id: 'normal', icon: Target, label: 'Contests', badge: normalContests?.length > 0 ? `LIVE` : null, color: 'blue' },
    { id: 'calendar', icon: Calendar, label: 'Upcoming', badge: calender_upcoming?.length > 0 ? calender_upcoming?.length : null, color: 'purple' },
    { id: 'past', icon: Clock, label: 'Past Contests', badge:"COMPLETED" , color: 'green' },
    { id: 'leaderboard', icon: Award, label: 'Global Leaderboard', badge: null, color: 'yellow' },
  ];

  const fetchcontestdetails = (id) => { 
  if (user) {
    window.location.href = `/challenge/${id}`; 
  } else {
    window.location.href = `/login`;
  }
};


  // Function to handle registration
  const handleRegister = (contestId) => {
    console.log('Registering for contest:', contestId);
    // Add your registration logic here
    // dispatch(registerForContest(contestId));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {(loading || normalContestsLoading) && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#0652e9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading contests...</p>
            </div>
          </div>
        )}

        {/* Error States */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error.detail || 'Failed to load contests'}</p>
            </div>
          </div>
        )}

        {normalContestsError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">Failed to load normal contests</p>
            </div>
          </div>
        )}

        {!progressloading && (
          <>
            {/* Enhanced Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center space-x-3 mb-4 bg-gradient-to-r from-[#0652e9] to-[#0547d1] rounded-full px-6 py-3 shadow-lg">
                <Trophy className="w-8 h-8 text-yellow-300" />
                <span className="text-white font-bold text-lg">Compete & Win</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#0652e9] via-purple-600 to-[#0652e9] bg-clip-text text-transparent">
                  Coding Contests
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Challenge yourself, compete with developers worldwide, and climb the leaderboard! 🚀
              </p>
            </div>

            {/* Enhanced Stats Cards */}
            {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
                    <Flame className="w-7 h-7 text-white" />
                  </div>
                  <Star className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-sm font-medium text-orange-600 mb-1">Current Streak</div>
                <div className="text-4xl font-bold text-orange-900 mb-1">{streak.current_streak}</div>
                <div className="text-xs text-orange-600 font-medium">🔥 Keep it going!</div>
              </div>

              <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
                    <Medal className="w-7 h-7 text-white" />
                  </div>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-sm font-medium text-yellow-600 mb-1">Longest Streak</div>
                <div className="text-4xl font-bold text-yellow-900 mb-1">{streak.longest_streak}</div>
                <div className="text-xs text-yellow-600 font-medium">🏆 Personal best</div>
              </div>

              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-sm font-medium text-blue-600 mb-1">Weeks Participated</div>
                <div className="text-4xl font-bold text-blue-900 mb-1">{streak.weeks_participated}</div>
                <div className="text-xs text-blue-600 font-medium">📅 Total weeks</div>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <Award className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-sm font-medium text-green-600 mb-1">Last Participation</div>
                {streak?.last_participation !== undefined && (
                  <div className="text-4xl font-bold text-green-900 mb-1">{formatDate(streak.last_participation)}</div>
                )}
                <div className="text-xs text-green-600 font-medium">Missing you from this date</div>
              </div>
            </div> */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  {/* Current Streak Card */}
  <div className="group bg-white rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div className="text-orange-400 bg-orange-50 px-2 py-1 rounded-lg">
          <Star className="w-4 h-4" />
        </div>
      </div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
        Current Streak
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {streak.current_streak} days
      </div>
      <div className="text-xs text-orange-600 font-medium flex items-center">
        <Flame className="w-3 h-3 mr-1" />
        Keep it going!
      </div>
    </div>
  </div>

  {/* Longest Streak Card */}
  <div className="group bg-white rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
          <Medal className="w-5 h-5 text-white" />
        </div>
        <div className="text-yellow-400 bg-yellow-50 px-2 py-1 rounded-lg">
          <Trophy className="w-4 h-4" />
        </div>
      </div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
        Longest Streak
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {streak.longest_streak} days
      </div>
      <div className="text-xs text-yellow-600 font-medium flex items-center">
        <Trophy className="w-3 h-3 mr-1" />
        Personal best
      </div>
    </div>
  </div>

  {/* Weeks Participated Card */}
  <div className="group bg-white rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div className="text-blue-400 bg-blue-50 px-2 py-1 rounded-lg">
          <Zap className="w-4 h-4" />
        </div>
      </div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
        Weeks Participated
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {streak.weeks_participated}
      </div>
      <div className="text-xs text-blue-600 font-medium flex items-center">
        <Calendar className="w-3 h-3 mr-1" />
        Total weeks
      </div>
    </div>
  </div>

  {/* Last Participation Card */}
  <div className="group bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div className="text-green-400 bg-green-50 px-2 py-1 rounded-lg">
          <Award className="w-4 h-4" />
        </div>
      </div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
        Last Participation
      </div>
      {streak?.last_participation ? (<>
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {new Date(streak.last_participation).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </div>
        <div className="text-xs text-green-600 font-medium">
        
        Last Contest Played
      </div>
      </>
        
      ) : (
        <div className="text-lg font-bold text-gray-400 mb-2">Not yet</div>
      )}
      
    </div>
  </div>
</div>

            {/* Enhanced Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-fit px-6 py-4 flex items-center justify-center space-x-2 font-semibold transition-all relative ${
                      activeTab === tab.id
                        ? 'text-[#0652e9] bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                    {tab.badge && (
                      <span className={`px-2 py-0.5 text-white text-xs font-bold rounded-full ${
                        tab.color === 'red' ? 'bg-red-500 animate-pulse' :
                        tab.color === 'green' ? 'bg-green-500' : 
                        tab.color === 'blue' ? 'bg-blue-500 animate-pulse' : 
                        tab.color === 'purple' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0652e9]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Contests Tab */}
           {/* Weekly Contests Tab */}
{activeTab === 'weekly' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {weeklycontests?.map((contest) => {
      const totalPoints = calculateTotalPoints(contest.questions);
      const isCompleted = contest.my_progress?.questions_solved?.length >= contest.questions?.length;
      
      return (
        <div
          key={contest._id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden flex flex-col h-full group"
        >
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-100  tracking-wider h-[90px]">Weekly Contest</span>
                  <h3 className="text-white font-bold text-s leading-tight">{contest.title}</h3>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-white">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 flex-grow">
            {/* Time Info */}
            <div className="mb-4">
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>Ends: {formatDate(contest.end_date)}</span>
              </div>
              {contest.duration && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Timer className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{formatDuration(contest.start_date, contest.end_date)}</span>
                </div>
              )}
            </div>

            {/* Progress Bar - Only show if user has progress */}
            {(contest.my_progress?.questions_solved?.length >= 0) && (
              <div className="mb-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Your Progress</span>
                  <span className="font-bold text-blue-600">
                    {contest.my_progress?.questions_solved?.length || 0}/{contest.questions?.length || 0}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${contest.questions?.length ?
                        ((contest.my_progress?.questions_solved?.length || 0) / contest.questions.length) * 100
                        : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{contest.questions?.length || 0}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Problems</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{contest.total_participants || 0}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Participants</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{totalPoints}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Points</div>
              </div>
            </div>

           
          </div>

          {/* Action Button */}
          <div className="px-5 pb-5 pt-2">
            <button
              onClick={() => fetchcontestdetails(contest._id)}
              className={`
                w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 
                flex items-center justify-center space-x-2 group-hover:shadow-md
                ${isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                }
              `}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed • View Details</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Join Contest Now</span>
                </>
              )}
            </button>
            
            {/* Quick Stats Footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              {contest.my_progress?.questions_solved?.length >= 0 && (
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  <span>{contest.my_progress.questions_solved.length} solved</span>
                </div>
              )}
              
            </div>
          </div>
        </div>
      );
    })}
    
    {/* Empty State */}
    {(!weeklycontests || weeklycontests.length === 0) && (
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Weekly Contests Available</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Weekly contests are updated every Monday. Check back soon for the next challenge!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveTab('normal')}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Other Contests
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

            {/* Normal Contests Tab - Same layout as Weekly */}
            {activeTab === 'normal' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {normalContests?.map((contest) => {
      const statusInfo = getStatusInfo(contest.status);
      const totalPoints = calculateTotalPoints(contest.questions);
      const userProgress = contest.my_progress?.questions_solved?.length || 0;
      const totalQuestions = contest.questions?.length || 0;
      const isUserCompleted = userProgress >= totalQuestions && totalQuestions > 0;
      
      return (
        <div
          key={contest._id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 overflow-hidden flex flex-col h-full group"
        >
          {/* Card Header with Gradient */}
         <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 h-[90px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-teal-100 tracking-wider">Contest</span>
                  <h3 className="text-white font-bold text-SM leading-tight">{contest.title}</h3>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-white">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 flex-grow">
            {/* Time Info */}
            <div className="mb-4">
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>Ends: {formatDate(contest.end_date)}</span>
              </div>
            </div>

            {/* Progress Bar - Only show if user has progress */}
            {userProgress >= 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Your Progress</span>
                  <span className="font-bold text-blue-600">
                    {userProgress}/{totalQuestions} solved
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalQuestions ? (userProgress / totalQuestions) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{totalQuestions}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Problems</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{contest.total_participants || 0}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Participants</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{totalPoints}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Points</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="px-5 pb-5 pt-2">
            <button
              onClick={() => fetchcontestdetails(contest._id)}
              className={`
                w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 
                flex items-center justify-center space-x-2 group-hover:shadow-md
                ${isUserCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-teal-600 hover:to-cyan-700'
                }
              `}
            >
              {isUserCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed • View Details</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Join Contest Now</span>
                </>
              )}
            </button>
            
            {/* Quick Stats Footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              {userProgress >= 0 && (
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  <span>{userProgress} solved</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })}
    
    {/* Empty State for Normal Contests */}
    {(!normalContests || normalContests.length === 0) && (
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Contests Available</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Check back soon for new challenges!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveTab('weekly')}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Weekly Contests
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

            {/* Upcoming Contests Tab (Calendar) */}
           {activeTab === 'calendar' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {calender_upcoming?.map((contest) => {
      const totalPoints = calculateTotalPoints(contest.questions);
      
      return (
        <div
          key={contest._id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 overflow-hidden flex flex-col h-full group"
        >
          {/* Card Header with Purple Gradient */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-700 px-5 py-4 h-[90px]">
            <div className="flex items-center justify-between"> 
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-purple-100  tracking-wider">Upcoming Contest</span>
                  <h3 className="text-white font-bold text-s leading-tight ">{contest.title}</h3>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs font-bold text-white">UPCOMING</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 flex-grow">
            {/* Time Information */}
            <div className="mb-4">
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>Starts: {formatDate(contest.start_date)}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>Ends: {formatDate(contest.end_date)}</span>
              </div>
            </div>

        
           

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              
              
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{contest.total_participants || 0}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Registered</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Timer className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{formatDuration(contest.start_date, contest.end_date)}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Duration</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="px-5 pb-5 pt-2">
            <button
              onClick={() => handleRegister(contest._id)}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 
                flex items-center justify-center space-x-2 group-hover:shadow-md
                bg-gradient-to-r from-purple-700 to-purple-800 text-white 
                from-purple-700 to-purple-800 hover:shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Register Now</span>
            </button>
            
            {/* Countdown Footer */}
            <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1 text-purple-500" />
              <span>Starts in {formatDistanceToNow(new Date(contest.start_date), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      );
    })}
    
    {/* Empty State for Upcoming Contests */}
    {(!calender_upcoming || calender_upcoming.length === 0) && (
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Contests</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">New contests will be announced soon. Stay tuned for exciting challenges!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveTab('weekly')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#0652e9] to-blue-600 text-white font-medium rounded-lg hover:from-[#0652e9] hover:to-blue-700 transition-colors"
            >
              <span className="flex items-center justify-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>View Weekly Contests</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('normal')}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
            >
              <span className="flex items-center justify-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Browse Active Contests</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

            {/* Past Challenges Tab - Also same layout */}
            {activeTab === 'past' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {pastchallenges?.map((contest) => {
      const totalPoints = calculateTotalPoints(contest.questions);
      const userProgress = contest.my_progress?.questions_solved?.length || 0;
      const totalQuestions = contest.questions?.length || 0;
      
      return (
        <div
          key={contest._id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 overflow-hidden flex flex-col h-full group"
        >
          {/* Card Header with Green Gradient */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-4 h-[90px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-green-100  tracking-wider">Past Contest</span>
                  <h3 className="text-white font-bold  text-s leading-tight">{contest.title}</h3>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                  <span className="text-xs font-bold text-white">COMPLETED</span>
                </div>
                </div>
              
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 flex-grow">
            {/* Time Information */}
            <div className="mb-4">
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>Ended: {formatDate(contest.end_date)}</span>
              </div>
            </div>

            {/* Progress Bar - Only show if user has progress */}
            {userProgress > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Your Progress</span>
                  <span className="font-bold text-green-600">
                    {userProgress}/{totalQuestions} solved
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalQuestions ? (userProgress / totalQuestions) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Stats Grid - Only 3 items as requested */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{totalQuestions}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Problems</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{contest.total_participants || 0}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Participants</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{totalPoints}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Points</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="px-5 pb-5 pt-2">
            <button
              onClick={() => fetchcontestdetails(contest._id)}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 
                flex items-center justify-center space-x-2 group-hover:shadow-md
                bg-gray-600 text-white hover:bg-gray-700 hover:shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            
            {/* Performance Info */}
            {contest.my_progress?.score && (
              <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                <Award className="w-3 h-3 mr-1 text-yellow-500" />
                <span>Your Score: {contest.my_progress.score} points</span>
              </div>
            )}
          </div>
        </div>
      );
    })}
    
    {/* Empty State for Past Contests */}
    {(!pastchallenges || pastchallenges.length === 0) && (
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Past Contests Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Participate in current contests to build your competition history!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveTab('weekly')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#0652e9] to-blue-600 text-white font-medium rounded-lg hover:from-[#0652e9] hover:to-blue-700 transition-colors"
            >
              <span className="flex items-center justify-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>View Weekly Contests</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('normal')}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
            >
              <span className="flex items-center justify-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Browse Active Contests</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}



            {activeTab === 'leaderboard' && (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

    {/* ===== HEADER ===== */}
    <div className="px-6 py-6 bg-gradient-to-r from-blue-700 to-blue-800 rounded-t-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Global Leaderboard
            </h2>
            <p className="text-sm text-blue-100/90 mt-1">
              Top performers across all contests • Updated daily
            </p>
          </div>
        </div>

        {/* My Rank */}
        {myRank && (
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/30">
            <User className="w-4 h-4 text-white" />
            <div className="text-white">
              {user? <>
              <span className="text-sm font-medium text-white/90">Your Rank</span>
              <div className="text-xl font-bold text-yellow-300">#{myRank}</div></>:<span className="text-sm font-medium text-white/90">Login to Know Your Rank</span>}
             
              
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ===== TABLE CONTAINER ===== */}
    <div className="overflow-x-auto">
      {/* ===== TABLE HEADER ===== */}
      <div className="min-w-[800px]">
        <div className="grid grid-cols-12 px-6 py-4 text-xs font-semibold text-gray-600 border-b bg-gray-50/80">
          <div className="col-span-1 text-center font-medium uppercase tracking-wide">Rank</div>
          <div className="col-span-5 font-medium uppercase tracking-wide">User</div>
          <div className="col-span-2 text-center font-medium uppercase tracking-wide">Current Streak</div>
          <div className="col-span-2 text-center font-medium uppercase tracking-wide">Solved</div>
          <div className="col-span-2 text-center font-medium uppercase tracking-wide">Weeks Active</div>
        </div>

        {/* ===== SCROLLABLE LIST ===== */}
        <div className="max-h-[580px] overflow-y-auto divide-y divide-gray-100">
          {leaderboard?.slice(0, 100).map((userItem, index) => {
            const rank = userItem.rank ?? index + 1;
            const isMe = user && userItem.user_id === user._id;
            const rankClass = rank <= 3 ? 'font-black' : 'font-bold';

            return (
              <div
                key={userItem._id}
                className={`grid grid-cols-12 items-center px-6 py-4 transition-all duration-200 min-w-[800px]
                  ${isMe
                    ? 'bg-gradient-to-r from-blue-50/80 to-blue-50/40 border-l-4 border-[#0652e9] shadow-sm'
                    : 'hover:bg-gray-50/70'}
                  ${rank <= 3 ? 'bg-gradient-to-r from-gray-50/60 to-transparent' : ''}
                `}
              >
                {/* Rank */}
                <div className="col-span-1 text-center">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full
                    ${rank === 1 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700' : ''}
                    ${rank === 2 ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600' : ''}
                    ${rank === 3 ? 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700' : ''}
                    ${rank > 3 ? 'bg-gray-100 text-gray-700' : ''}
                  `}>
                    <span className={`${rankClass} ${rank <= 3 ? 'text-lg' : ''}`}>
                      {rank}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 
                      flex items-center justify-center font-semibold text-gray-700 border border-gray-200">
                      {userItem.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 truncate">
                        {userItem.username}
                      </span>
                      {isMe && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r 
                          from-green-700 to-green-800 text-white shadow-sm">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Active {formatDistanceToNow(new Date(userItem.last_participation), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {/* Current Streak */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-50 to-orange-50 
                    rounded-full border border-red-100">
                   
                    <span className="font-bold text-gray-800">{userItem.current_streak}</span>
                  </div>
                </div>

                {/* Solved */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 
                    rounded-full border border-green-100">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-800">{userItem.total_challenges_completed}</span>
                  </div>
                </div>

                {/* Weeks Active */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 
                    rounded-full border border-blue-100">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-800">{userItem.weeks_participated?.length || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* ===== EMPTY STATE ===== */}
    {(!leaderboard || leaderboard.length === 0) && (
      <div className="p-16 text-center border-t">
        <div className="inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-6 
          border border-gray-200">
          <Trophy className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Leaderboard Coming Soon
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Be the first to participate in contests and climb the ranks. Your journey starts here!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setActiveTab('weekly')}
            className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r 
              from-purple-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg 
              transition-all duration-200 hover:scale-[1.02]"
          >
            <Trophy className="w-5 h-5" />
            <span>Explore Active Contests</span>
          </button>
          <button
            onClick={() => {/* Add tutorial/hint action */}}
            className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gray-100 
              text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 
              border border-gray-200"
          >
            <HelpCircle className="w-5 h-5" />
            <span>How It Works</span>
          </button>
        </div>
      </div>
    )}

    {/* ===== FOOTER ===== */}
    {leaderboard && leaderboard.length > 0 && (
      <div className="px-6 py-4 border-t bg-gray-50/50 text-xs text-gray-500 flex flex-col 
        sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3 h-3" />
          <span>Showing top 100 performers • Rankings update after each contest</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Last 7 days active
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Consistent participation
          </span>
        </div>
      </div>
    )}
  </div>
)}

            {/* Empty States for Other Tabs */}
            {activeTab !== 'weekly' && activeTab !== 'past' && activeTab !== 'normal' && activeTab !== 'leaderboard' && activeTab !== 'calendar' && (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
                <p className="text-gray-600">This section is under development</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyChallenges;
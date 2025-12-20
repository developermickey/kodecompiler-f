import { useEffect, useState } from 'react';
import { Trophy, Calendar, Flame, Medal, CheckCircle, Clock, Target, TrendingUp, Award, Users, Zap, ChevronRight, Star, Play, AlertCircle, Timer } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchnormalchallenges, fetchpastchallenges, fetchweeklychallenges } from "../../redux/slices/challengesSlice"
import { fetchuserchallengeprogress } from "../../redux/slices/userchallengesprogressSlice"

const WeeklyChallenges = () => {
  const [activeTab, setActiveTab] = useState('weekly');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchweeklychallenges());
    dispatch(fetchpastchallenges({ skip: 0, limit: 10 }));
    dispatch(fetchnormalchallenges());
    if (user)
      dispatch(fetchuserchallengeprogress());
  }, [dispatch, user]);

  const { weeklycontests, loading, error } = useSelector((state) => state.weeklyChallenges);
  const { streak, progress, progressloading } = useSelector((state) => state.userChallengesprogress);
  const { pastchallenges, total, skip, limit } = useSelector((state) => state.pastChallenges);
  const { normalContests, normalContestsLoading, normalContestsError } = useSelector((state) => state.normalChallenges);

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
    { id: 'calendar', icon: Calendar, label: 'Upcoming', badge: "", color: 'purple' },
    { id: 'past', icon: Clock, label: 'Past Contests', badge:"COMPLTED" , color: 'green' },
    { id: 'leaderboard', icon: Award, label: 'Global Leaderboard', badge: null, color: 'yellow' },
  ];

  const fetchcontestdetails = (id) => {
    console.log(id);
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
                <div className="text-sm font-medium text-green-600 mb-1">This Week</div>
                {progress?.total_solved !== undefined && (
                  <div className="text-4xl font-bold text-green-900 mb-1">{progress.total_solved}</div>
                )}
                <div className="text-xs text-green-600 font-medium">✅ Problems solved</div>
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
                        tab.color === 'blue' ? 'bg-blue-500 animate-pulse' : 'bg-purple-500'
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
            {activeTab === 'weekly' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  {weeklycontests?.map((contest) => {
                    const statusInfo = getStatusInfo(contest.status);
                    const totalPoints = calculateTotalPoints(contest.questions);
                    
                    return (
                      <div
                        key={contest._id}
                        className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-[#0652e9] transition-all duration-300 group"
                      >
                        {/* Contest Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#0652e9] to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                              <Trophy className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{contest.title}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 ${statusInfo.color} text-xs font-bold rounded-full`}>
                                  {statusInfo.text}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {formatDate(contest.start_date)} - {formatDate(contest.end_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar - Only show if user has progress */}
                        {(contest.my_progress?.questions_solved?.length > 0) && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="font-semibold text-gray-700">Your Progress</span>
                              <span className="font-bold text-[#0652e9]">
                                {contest.my_progress?.questions_solved?.length || 0}/{contest.questions?.length || 0} solved
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#0652e9] to-purple-600 rounded-full transition-all duration-500"
                                style={{
                                  width: `${contest.questions?.length ?
                                    ((contest.my_progress?.questions_solved?.length || 0) / contest.questions.length) * 100
                                    : 0}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Contest Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Target className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Problems</div>
                              <div className="font-bold text-gray-900">{contest.questions?.length || 0}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Participants</div>
                              <div className="font-bold text-gray-900">{contest.total_participants || 0}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Star className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Points</div>
                              <div className="font-bold text-gray-900">{totalPoints}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Timer className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Duration</div>
                              <div className="font-bold text-gray-900">{formatDuration(contest.start_date, contest.end_date)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          className={`w-full py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center space-x-2 ${
                            statusInfo.text === 'LIVE NOW'
                              ? 'bg-gradient-to-r from-[#0652e9] to-purple-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                              : statusInfo.text === 'UPCOMING'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => fetchcontestdetails(contest._id)}
                        >
                          {statusInfo.text === 'LIVE NOW' ? (
                            <>
                             
                              <span>{contest.my_progress.questions_solved < contest.questions.length ?"Join Contest Now":"Completed"}</span>
                              <ChevronRight className="w-5 h-5" />
                            </>
                          ) : statusInfo.text === 'UPCOMING' ? (
                            <>
                              <Calendar className="w-5 h-5" />
                              <span>Set Reminder</span>
                              <ChevronRight className="w-5 h-5" />
                            </>
                          ) : (
                            <>
                              <Calendar className="w-5 h-5" />
                              <span>View Details</span>
                              <ChevronRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Normal Contests Tab - Same layout as Weekly */}
            {activeTab === 'normal' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  {normalContests?.map((contest) => {
                    const statusInfo =  getStatusInfo(contest.status);
                    const totalPoints = calculateTotalPoints(contest.questions);
                    
                    return (
                      <div
                        key={contest._id}
                        className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-[#0284c7] transition-all duration-300 group"
                      >
                        {/* Contest Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div className="flex items-center space-x-4">
                            {/* Changed gradient to blue to cyan for normal contests */}
                            <div className="w-14 h-14 bg-gradient-to-br from-[#0284c7] to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                              <Target className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{contest.title}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 ${statusInfo.color} text-xs font-bold rounded-full`}>
                                  {statusInfo.text}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {formatDate(contest.start_date)} - {formatDate(contest.end_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar - Only show if user has progress */}
                        {(contest.my_progress?.questions_solved?.length > 0) && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="font-semibold text-gray-700">Your Progress</span>
                              <span className="font-bold text-[#0284c7]">
                                {contest.my_progress?.questions_solved?.length || 0}/{contest.questions?.length || 0} solved
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#0284c7] to-cyan-600 rounded-full transition-all duration-500"
                                style={{
                                  width: `${contest.questions?.length ?
                                    ((contest.my_progress?.questions_solved?.length || 0) / contest.questions.length) * 100
                                    : 0}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Contest Stats - Same fields as weekly */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Target className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Problems</div>
                              <div className="font-bold text-gray-900">{contest.questions?.length || 0}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Participants</div>
                              <div className="font-bold text-gray-900">{contest.total_participants || 0}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Star className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Points</div>
                              <div className="font-bold text-gray-900">{totalPoints}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Timer className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Duration</div>
                              <div className="font-bold text-gray-900">{formatDuration(contest.start_date, contest.end_date)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button - Using different gradient for normal contests */}
                        <button
                          className={`w-full py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center space-x-2 ${
                            statusInfo.text === 'LIVE NOW'
                              ? 'bg-gradient-to-r from-[#0284c7] to-cyan-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                              : statusInfo.text === 'UPCOMING'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => fetchcontestdetails(contest._id)}
                        >
                          {statusInfo.text === 'LIVE NOW' ? (
                            <>
                              
                              <span>{contest.my_progress.questions_solved < contest.questions.length ?"Join Contest Now":"Completed"}</span>
                              <ChevronRight className="w-5 h-5" />
                            </>
                          ) : statusInfo.text === 'UPCOMING' ? (
                            <>
                              <Calendar className="w-5 h-5" />
                              <span>Set Reminder</span>
                              <ChevronRight className="w-5 h-5" />
                            </>
                          ) : (
                            <>
                              <Calendar className="w-5 h-5" />
                              <span>View Details</span>
                              <ChevronRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}

                  {/* Empty State for Normal Contests */}
                  {(!normalContests || normalContests.length === 0) && (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Contests Available</h3>
                      <p className="text-gray-600 mb-6">Check back later for new contests!</p>
                      <button
                        onClick={() => setActiveTab('weekly')}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0284c7] to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                      >
                        <Target className="w-5 h-5" />
                        <span>View Weekly Contests</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Past Challenges Tab - Also same layout */}
            {activeTab === 'past' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  {pastchallenges?.map((contest) => {
                    const statusInfo = getStatusInfo(contest.status);
                    const totalPoints = calculateTotalPoints(contest.questions);
                    
                    return (
                      <div
                        key={contest._id}
                        className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-emerald-500 transition-all duration-300 group"
                      >
                        {/* Contest Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div className="flex items-center space-x-4">
                            {/* Changed gradient to green for past contests */}
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                              <Trophy className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{contest.title}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 ${statusInfo.color} text-xs font-bold rounded-full`}>
                                  {statusInfo.text}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {formatDate(contest.start_date)} - {formatDate(contest.end_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar - Only show if user has progress */}
                        {(contest.my_progress?.questions_solved?.length > 0) && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="font-semibold text-gray-700">Your Progress</span>
                              <span className="font-bold text-emerald-600">
                                {contest.my_progress?.questions_solved?.length || 0}/{contest.questions?.length || 0} solved
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500"
                                style={{
                                  width: `${contest.questions?.length ?
                                    ((contest.my_progress?.questions_solved?.length || 0) / contest.questions.length) * 100
                                    : 0}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Contest Stats - Same fields */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Target className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Problems</div>
                              <div className="font-bold text-gray-900">{contest.questions?.length || 0}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Participants</div>
                              <div className="font-bold text-gray-900">{contest.total_participants || 0}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Star className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Points</div>
                              <div className="font-bold text-gray-900">{totalPoints}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Timer className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Duration</div>
                              <div className="font-bold text-gray-900">{formatDuration(contest.start_date, contest.end_date)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button - Green gradient for past contests */}
                        <button
                          className={`w-full py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center space-x-2 ${
                            statusInfo.text === 'LIVE NOW'
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                              : statusInfo.text === 'UPCOMING'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => fetchcontestdetails(contest._id)}
                        >
        
                            <>
                              <Calendar className="w-5 h-5" />
                              <span>View Details</span>
                              <ChevronRight className="w-5 h-5" />
                            </>
                          
                        </button>
                      </div>
                    );
                  })}

                  {/* Empty State for Past Contests */}
                  {(!pastchallenges || pastchallenges.length === 0) && (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Past Contests Yet</h3>
                      <p className="text-gray-600 mb-6">Participate in current contests to build your history!</p>
                      <button
                        onClick={() => setActiveTab('weekly')}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0652e9] to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                      >
                        <Trophy className="w-5 h-5" />
                        <span>View Active Contests</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty States for Other Tabs */}
            {activeTab !== 'weekly' && activeTab !== 'past' && activeTab !== 'normal' && (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'calendar' && <Calendar className="w-10 h-10 text-gray-400" />}
                  {activeTab === 'leaderboard' && <TrendingUp className="w-10 h-10 text-gray-400" />}
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
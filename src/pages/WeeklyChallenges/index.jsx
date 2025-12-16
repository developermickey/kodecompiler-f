import { useState } from 'react';
import { Trophy, Calendar, Flame, Medal, CheckCircle, Clock, Target, TrendingUp, Award, Users, Zap, ChevronRight, Star, Play, AlertCircle } from 'lucide-react';

const WeeklyChallenges = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  
  // Mock data for demo
  const isLoading = false;
  const error = null;
  const stats = {
    currentStreak: 5,
    longestStreak: 12,
    weeksParticipated: 20,
    thisWeekProgress: { solved: 3, total: 5 }
  };

  const weeklyContests = [
    {
      id: 1,
      title: 'Weekly Contest 125',
      status: 'live',
      startTime: '2024-01-15 10:00',
      endTime: '2024-01-15 12:00',
      timeLeft: '1h 23m',
      participants: 1234,
      problems: 5,
      difficulty: 'Mixed',
      solved: 3,
      points: 450,
      maxPoints: 500
    },
    {
      id: 2,
      title: 'Weekly Contest 124',
      status: 'upcoming',
      startTime: '2024-01-22 10:00',
      endTime: '2024-01-22 12:00',
      startsIn: '2 days',
      participants: 0,
      problems: 5,
      difficulty: 'Mixed',
      solved: 0,
      points: 0,
      maxPoints: 500
    },
  ];

  const leaderboard = [
    { rank: 1, username: 'CodeMaster', score: 450, solved: 5, time: '45:23', avatar: '🥇' },
    { rank: 2, username: 'AlgoExpert', score: 440, solved: 5, time: '48:15', avatar: '🥈' },
    { rank: 3, username: 'DevPro', score: 420, solved: 4, time: '52:30', avatar: '🥉' },
    { rank: 4, username: 'CodeNinja', score: 410, solved: 4, time: '55:12', avatar: '👨‍💻' },
    { rank: 5, username: 'ByteMaster', score: 400, solved: 4, time: '58:45', avatar: '👩‍💻' },
  ];

  const tabs = [
    { id: 'weekly', icon: Trophy, label: 'Weekly Contests', badge: 'LIVE', color: 'red' },
    { id: 'normal', icon: Target, label: 'Contests', badge: null, color: 'blue' },
    { id: 'calendar', icon: Calendar, label: 'Upcoming', badge: '3', color: 'purple' },
    { id: 'past', icon: Clock, label: 'Past Contests', badge: null, color: 'gray' },
    { id: 'leaderboard', icon: Award, label: 'Global Leaderboard', badge: null, color: 'yellow' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#0652e9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading contests...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error.detail || 'Failed to load contests'}</p>
            </div>
          </div>
        )}

        {!isLoading && (
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
                <div className="text-4xl font-bold text-orange-900 mb-1">{stats.currentStreak}</div>
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
                <div className="text-4xl font-bold text-yellow-900 mb-1">{stats.longestStreak}</div>
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
                <div className="text-4xl font-bold text-blue-900 mb-1">{stats.weeksParticipated}</div>
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
                <div className="text-4xl font-bold text-green-900 mb-1">
                  {stats.thisWeekProgress.solved}/{stats.thisWeekProgress.total}
                </div>
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
                        tab.color === 'red' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
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

            {/* Tab Content */}
            {activeTab === 'weekly' && (
              <div className="space-y-8">
                {/* Enhanced Contests List */}
                <div className="space-y-6">
                  {weeklyContests.map((contest) => (
                    <div
                      key={contest.id}
                      className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-[#0652e9] transition-all duration-300 group"
                    >
                      {/* Contest Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#0652e9] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Trophy className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{contest.title}</h3>
                            <div className="flex items-center space-x-2">
                              {contest.status === 'live' ? (
                                <>
                                  <span className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    <span>LIVE NOW</span>
                                  </span>
                                  <span className="text-sm text-red-600 font-semibold">⏱ {contest.timeLeft} left</span>
                                </>
                              ) : (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                  🕐 Starts in {contest.startsIn}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-semibold text-gray-700">Your Progress</span>
                          <span className="font-bold text-[#0652e9]">{contest.solved}/{contest.problems} solved</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#0652e9] to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${(contest.solved / contest.problems) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Contest Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs">Problems</div>
                            <div className="font-bold text-gray-900">{contest.problems}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs">Participants</div>
                            <div className="font-bold text-gray-900">{contest.participants}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Star className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs">Points</div>
                            <div className="font-bold text-gray-900">{contest.points}/{contest.maxPoints}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs">Difficulty</div>
                            <div className="font-bold text-gray-900">{contest.difficulty}</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
                          contest.status === 'live'
                            ? 'bg-gradient-to-r from-[#0652e9] to-purple-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {contest.status === 'live' ? (
                          <>
                            <Play className="w-5 h-5" fill="white" />
                            <span>Join Contest Now</span>
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
                  ))}
                </div>

                {/* Enhanced Leaderboard */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Weekly Leaderboard</h2>
                        <p className="text-sm text-gray-600">Top performers this week</p>
                      </div>
                    </div>
                    <button className="text-[#0652e9] font-semibold text-sm hover:underline">View All →</button>
                  </div>

                  <div className="space-y-3">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md ${
                          entry.rank <= 3
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-[#0652e9]'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ${
                            entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                            entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                            entry.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {entry.rank <= 3 ? entry.avatar : entry.rank}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{entry.username}</div>
                            <div className="text-sm text-gray-600">Solved: {entry.solved} problems</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#0652e9]">{entry.score}</div>
                          <div className="text-xs text-gray-600">⏱ {entry.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Empty States for Other Tabs */}
            {activeTab !== 'weekly' && (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'normal' && <Target className="w-10 h-10 text-gray-400" />}
                  {activeTab === 'calendar' && <Calendar className="w-10 h-10 text-gray-400" />}
                  {activeTab === 'past' && <Clock className="w-10 h-10 text-gray-400" />}
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
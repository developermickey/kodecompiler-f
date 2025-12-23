import React, { useState, useEffect, useMemo } from 'react';
import { Search, CheckCircle, BarChart3, X, Loader, Building2, Briefcase, ArrowLeft, TrendingUp, Target, Award, Sparkles, Zap, Trophy } from 'lucide-react';
import { useSelector } from "react-redux";
import { fetchProblems } from "../../redux/slices/problemSlice";
import { fetchUserProgress } from "../../redux/slices/userprogressSlice";
import { useDispatch } from "react-redux";

const Arena = () => {

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCompanyMode, setShowCompanyMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [companySearchQuery, setCompanySearchQuery] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    dispatch(fetchProblems());
    if (user) 
      dispatch(fetchUserProgress());
  }, [dispatch, user]);

  const { list: problems, stats, loading } = useSelector(
    (state) => state.problems
  );

  const {
    solvedProblemIds,
    solvedCount
  } = useSelector((state) => state.userProgress);


  const categories = useMemo(
    () => [...new Set(problems.map(p => p.category))],
    [problems]
  );
  
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           problem.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [problems, searchQuery, selectedDifficulty, selectedCategory]);

  // Company filtered problems
  const companyFilteredProblems = useMemo(() =>
  {
    const query = companySearchQuery.toLowerCase().trim();

    if (!query) return problems;

    return problems.filter(problem =>
      Array.isArray(problem.companies) &&
      problem.companies.some(company =>
        company.toLowerCase().includes(query)
      )
    );
  }, [problems, companySearchQuery]);

  // Handler Functions
  const handleSolve = (problemId) => {
    if (!user) {
      window.location.href = "/login";
      return null;
    }
    window.location.href = `/problem/${problemId}`;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
  };

  const handleCompanySearch = (e) => {
    setCompanySearchQuery(e.target.value);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const resetCompanyFilters = () => {
    setCompanySearchQuery('');
    setSelectedCompany('all');
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Hard': return 'text-rose-600 bg-rose-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const solvedCompanyProblems = companyFilteredProblems.filter(problem =>
    solvedProblemIds.includes(problem.problem_id)
  );

  const companySolvedPercentage =
    companyFilteredProblems.length === 0
      ? 0
      : ((solvedCompanyProblems.length / companyFilteredProblems.length) * 100).toFixed(2);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  // Company Mode View
  if (showCompanyMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
        {/* Professional Header with Gradient */}
        <div className="bg-gradient-to-r from-[#0652e9] via-indigo-600 to-purple-600 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Back Button */}
            <button
              onClick={() => setShowCompanyMode(false)}
              className="mb-6 sm:mb-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors group text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to All Problems</span>
            </button>

            {/* Main Header Content */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-lg rounded-3xl mb-4 sm:mb-6 shadow-xl">
                <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight px-2">
                Company Interview Problems
              </h1>
              <p className="text-base sm:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed px-4">
                Your ultimate companion for interview preparation.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{companyFilteredProblems.length}</div>
                    <div className="text-indigo-100 text-xs sm:text-sm font-medium">Total Problems</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {companySolvedPercentage}%
                    </div>
                    <div className="text-indigo-100 text-xs sm:text-sm font-medium">
                      Preparation Done
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {solvedCompanyProblems.length}
                    </div>
                    <div className="text-indigo-100 text-xs sm:text-sm font-medium">
                      Problems Solved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave Separator */}
          <div className="relative h-8 sm:h-12">
            <svg className="absolute bottom-0 w-full h-8 sm:h-12" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 48h1440V0c-180 48-360 48-540 24S540 0 360 24 0 48 0 48z" fill="rgb(248, 250, 252)"/>
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Featured Companies Banner */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6 border border-slate-100">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">Featured Companies</h2>
                <p className="text-slate-600 text-xs sm:text-sm">Search problems by leading companies</p>
              </div>
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#0652e9]" />
            </div>
            
            {/* Company Tags */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Tesla', 'Uber'].map((company) => (
                <button
                  key={company}
                  onClick={() => setCompanySearchQuery(company)}
                  className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-[#0652e9] hover:to-indigo-600 text-slate-700 hover:text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 border border-slate-200 hover:border-transparent hover:shadow-lg hover:scale-105 transform text-sm sm:text-base"
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 sm:mb-6 border border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search company problems..."
                  value={companySearchQuery}
                  onChange={handleCompanySearch}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
            
              {(companySearchQuery || selectedCompany !== 'all') && (
                <button 
                  onClick={resetCompanyFilters}
                  className="px-4 py-2.5 sm:px-4 sm:py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-sm sm:text-base"
                  title="Clear filters"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 inline-block" />
                  <span className="ml-2 sm:hidden">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-slate-600 text-sm sm:text-base">
              Showing <span className="font-semibold text-[#0652e9]">{companyFilteredProblems.length}</span> problems
              {selectedCompany !== 'all' && <span> from <span className="font-semibold text-[#0652e9]">{selectedCompany}</span></span>}
            </div>
            {companySearchQuery && (
              <div className="text-xs sm:text-sm text-slate-500">
                Search: <span className="font-semibold text-[#0652e9]">"{companySearchQuery}"</span>
              </div>
            )}
          </div>

          {/* Problems List */}
          {companyFilteredProblems.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 sm:p-12 shadow-lg text-center border border-slate-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">No problems found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm sm:text-base">Try searching for a different company</p>
              <button 
                onClick={resetCompanyFilters}
                className="px-6 py-3 bg-[#0652e9] text-white rounded-xl hover:bg-[#0547d1] transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {companyFilteredProblems != null && companyFilteredProblems.map((problem) => (
                <div key={problem.problem_id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" onClick={() => handleSolve(problem.problem_id)}>
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-slate-400 font-medium text-sm">#{problem.problem_id}</span>
                        <h3 className="cursor-pointer text-lg sm:text-xl font-bold text-slate-800 group-hover:text-[#0652e9] transition-colors line-clamp-1">
                          {problem.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        {solvedProblemIds.includes(problem.problem_id) && (
                          <div className="flex items-center gap-1 text-emerald-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Solved</span>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm sm:text-base mb-3 line-clamp-2">{problem.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {problem.tags != null && problem.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                        {problem.tags && problem.tags.length > 2 && (
                          <span className="px-2 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-xs font-medium">
                            +{problem.tags.length - 2}
                          </span>
                        )}
                        <span className="text-slate-500 text-xs sm:text-sm flex items-center gap-1">
                          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                          Acceptance: {problem.total_submissions > 0 ? `${Number(((problem.accepted_submissions/problem.total_submissions)*100).toFixed(2))}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSolve(problem.problem_id);
                      }}
                      className="cursor-pointer w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-2 bg-[#0652e9] text-white text-sm sm:text-lg font-semibold rounded-xl hover:bg-[#0547d1] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105 transform mt-2 sm:mt-0"
                    >
                      {solvedProblemIds.includes(problem.problem_id) ? 'Resolve' : 'Solve'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal Mode View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0652e9] via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-4 sm:mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/5 rounded-full -mr-16 -mt-16 sm:-mr-32 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/5 rounded-full -ml-12 -mb-12 sm:-ml-24 sm:-mb-24"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Master Your Skills</h2>
              </div>
              <p className="text-indigo-100 text-sm sm:text-lg max-w-2xl">
                Challenge yourself with {stats.total} curated problems.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Trophy className="w-5 h-5 sm:w-8 sm:h-8 text-amber-300" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{solvedCount||0}</div>
                    <div className="text-indigo-100 text-xs sm:text-sm">Solved</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Zap className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-300" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{Math.round((solvedCount / stats.total) * 100) || 0}%</div>
                    <div className="text-indigo-100 text-xs sm:text-sm">Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200 group cursor-pointer col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0652e9]" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-[#0652e9] mb-1 sm:mb-2">{stats.total}</div>
            <div className="text-slate-600 text-xs sm:text-sm font-medium">Total Problems</div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{stats.easy}</div>
                <div className="text-emerald-50 text-xs sm:text-sm font-medium">Easy</div>
              </div>
              <div className="text-3xl sm:text-5xl text-emerald-100 transition-transform duration-300 group-hover:scale-110">
                🧩
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{stats.medium}</div>
                <div className="text-amber-50 text-xs sm:text-sm font-medium">Medium</div>
              </div>
              <div className="text-3xl sm:text-5xl text-amber-100 transition-transform duration-300 group-hover:scale-110">
                🛠️
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{stats.hard}</div>
                <div className="text-rose-50 text-xs sm:text-sm font-medium">Hard</div>
              </div>
              <div className="text-3xl sm:text-5xl text-rose-100 transition-transform duration-300 group-hover:scale-110">
                🧠
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#0652e9] to-indigo-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{solvedCount||0}</div>
                <div className="text-indigo-50 text-xs sm:text-sm font-medium">Solved</div>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 text-indigo-100 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg mb-4 sm:mb-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4">
              <select 
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                className="px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 font-medium text-slate-700 text-sm sm:text-base"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select 
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 font-medium text-slate-700 text-sm sm:text-base"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={() => setShowCompanyMode(true)}
                className="cursor-pointer px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#0652e9] to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-[#0547d1] hover:to-indigo-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105 transform text-sm sm:text-base col-span-2 sm:col-span-1"
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Companies
              </button>
              {(searchQuery || selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2.5 sm:py-3 bg-slate-50 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-sm sm:text-base"
                  title="Clear filters"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 inline-block" />
                  <span className="ml-2 sm:hidden">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count with Active Filters */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-slate-600 text-sm sm:text-base">
            Showing <span className="font-semibold text-[#0652e9]">{filteredProblems.length}</span> of {problems.length} problems
          </div>
          {(selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-slate-500">Active filters:</span>
              {selectedDifficulty !== 'all' && (
                <span className="px-2 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-xs font-medium">
                  {selectedDifficulty}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-xs font-medium">
                  {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Problems List */}
        {filteredProblems.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-12 shadow-lg text-center border border-slate-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">No problems found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm sm:text-base">Try adjusting your search</p>
            <button 
              onClick={resetFilters}
              className="px-6 py-3 bg-[#0652e9] text-white rounded-xl hover:bg-[#0547d1] transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredProblems.map((problem) => (
              <div key={problem.problem_id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:border-[#0652e9]/30 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-slate-400 font-medium text-sm">#{problem.problem_id}</span>
                      <h3 className="cursor-pointer text-lg sm:text-xl font-bold text-slate-800 group-hover:text-[#0652e9] transition-colors line-clamp-1">
                        {problem.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      {solvedProblemIds.includes(problem.problem_id) && (
                        <div className="flex items-center gap-1 text-emerald-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Solved</span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm sm:text-base mb-3 line-clamp-2">{problem.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {problem.tags && problem.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors">
                          {tag}
                        </span>
                      ))}
                      {problem.tags && problem.tags.length > 2 && (
                        <span className="px-2 py-1 bg-indigo-50 text-[#0652e9] rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors">
                          +{problem.tags.length - 2}
                        </span>
                      )}
                      <span className="text-slate-500 text-xs sm:text-sm flex items-center gap-1">
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Acceptance: {problem.total_submissions > 0 ? `${ Number(((problem.accepted_submissions/problem.total_submissions)*100).toFixed(2))}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSolve(problem.problem_id)}
                    className="cursor-pointer w-full sm:w-auto px-4 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-[#0652e9] to-indigo-600 text-white text-sm sm:text-lg font-semibold rounded-lg sm:rounded-xl hover:from-[#0547d1] hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105 transform mt-2 sm:mt-0"
                  >
                    {solvedProblemIds.includes(problem.problem_id) ? 'Resolve' : 'Solve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Arena;
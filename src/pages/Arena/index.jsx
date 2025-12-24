import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  CheckCircle,
  BarChart3,
  X,
  Loader,
  Building2,
  Briefcase,
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  Zap,
  Trophy,
  Feather, // Add this
  Layers, // Add this
  Flame,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblems } from "../../redux/slices/problemSlice";
import { fetchUserProgress } from "../../redux/slices/userprogressSlice";

const Arena = () => {
  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCompanyMode, setShowCompanyMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [companySearchQuery, setCompanySearchQuery] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchProblems());
    if (user) dispatch(fetchUserProgress());
  }, [dispatch, user]);

  const {
    list: problems,
    stats,
    loading,
  } = useSelector((state) => state.problems);

  const { solvedProblemIds, solvedCount } = useSelector(
    (state) => state.userProgress
  );

  const categories = useMemo(
    () => [...new Set(problems.map((p) => p.category))],
    [problems]
  );

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        problem.difficulty === selectedDifficulty;
      const matchesCategory =
        selectedCategory === "all" || problem.category === selectedCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [problems, searchQuery, selectedDifficulty, selectedCategory]);

  // Company filtered problems
  const companyFilteredProblems = useMemo(() => {
    const query = companySearchQuery.toLowerCase().trim();

    if (!query) return problems;

    return problems.filter(
      (problem) =>
        Array.isArray(problem.companies) &&
        problem.companies.some((company) =>
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
    setSearchQuery("");
    setSelectedDifficulty("all");
    setSelectedCategory("all");
  };

  const handleCompanySearch = (e) => {
    setCompanySearchQuery(e.target.value);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const resetCompanyFilters = () => {
    setCompanySearchQuery("");
    setSelectedCompany("all");
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-600 bg-emerald-50";
      case "Medium":
        return "text-amber-600 bg-amber-50";
      case "Hard":
        return "text-rose-600 bg-rose-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const solvedCompanyProblems = companyFilteredProblems.filter((problem) =>
    solvedProblemIds.includes(problem.problem_id)
  );

  const companySolvedPercentage =
    companyFilteredProblems.length === 0
      ? 0
      : (
          (solvedCompanyProblems.length / companyFilteredProblems.length) *
          100
        ).toFixed(2);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Loading problems...</p>
        </div>
      </div>
    );
  }

  // Company Mode View
  if (showCompanyMode) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Professional Header with Gradient - Scaled Down */}
        <div className="bg-[#0652e9] shadow-xl">
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
            {/* Back Button */}
            <button
              onClick={() => setShowCompanyMode(false)}
              className="mb-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors group text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to All Problems</span>
            </button>

            {/* Main Header Content */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-lg rounded-2xl mb-3 shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                Company Interview Problems
              </h1>
              <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
                Your ultimate companion for interview preparation.
              </p>
            </div>

            {/* Stats Cards - Scaled Down */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {companyFilteredProblems.length}
                    </div>
                    <div className="text-indigo-100 text-xs font-medium">
                      Total
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {companySolvedPercentage}%
                    </div>
                    <div className="text-indigo-100 text-xs font-medium">
                      Done
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {solvedCompanyProblems.length}
                    </div>
                    <div className="text-indigo-100 text-xs font-medium">
                      Solved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Scaled Down */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Featured Companies Banner */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  Featured Companies
                </h2>
                <p className="text-slate-500 text-xs">
                  Search problems by leading companies
                </p>
              </div>
              <Building2 className="w-5 h-5 text-[#0652e9]" />
            </div>

            {/* Company Tags - Compact */}
            <div className="flex flex-wrap gap-2">
              {[
                "Google",
                "Amazon",
                "Microsoft",
                "Meta",
                "Apple",
                "Netflix",
                "Tesla",
                "Uber",
              ].map((company) => (
                <button
                  key={company}
                  onClick={() => setCompanySearchQuery(company)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-[#0652e9] hover:text-white text-slate-600 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-slate-200 hover:border-transparent hover:shadow-md transform hover:scale-105"
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          {/* Search Section - Compact */}
          <div className="bg-white rounded-xl p-3 shadow-sm mb-4 border border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search company problems..."
                  value={companySearchQuery}
                  onChange={handleCompanySearch}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 focus:border-transparent transition-all text-sm"
                />
              </div>

              {(companySearchQuery || selectedCompany !== "all") && (
                <button
                  onClick={resetCompanyFilters}
                  className="px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 text-xs sm:text-sm font-medium flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3 flex items-center justify-between text-xs sm:text-sm text-slate-600">
            <div>
              Showing{" "}
              <span className="font-semibold text-[#0652e9]">
                {companyFilteredProblems.length}
              </span>{" "}
              problems
            </div>
          </div>

          {/* Problems List - Scaled Down */}
          {companyFilteredProblems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center border border-slate-100">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                No problems found
              </h3>
              <button
                onClick={resetCompanyFilters}
                className="mt-4 px-4 py-2 bg-[#0652e9] text-white rounded-lg hover:bg-[#0547d1] transition-colors shadow-md text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {companyFilteredProblems != null &&
                companyFilteredProblems.map((problem) => (
                  <div
                    key={problem.problem_id}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-slate-100 group"
                  >
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      onClick={() => handleSolve(problem.problem_id)}
                    >
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-slate-400 font-medium text-xs">
                            #{problem.problem_id}
                          </span>
                          <h3 className="cursor-pointer text-base sm:text-lg font-bold text-slate-800 group-hover:text-[#0652e9] transition-colors line-clamp-1">
                            {problem.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                          {solvedProblemIds.includes(problem.problem_id) && (
                            <div className="flex items-center gap-1 text-emerald-600 text-xs">
                              <CheckCircle className="w-3 h-3" />
                              <span className="font-medium">Solved</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {problem.tags != null &&
                            problem.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-indigo-50 text-[#0652e9] rounded text-[10px] font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSolve(problem.problem_id);
                        }}
                        className="cursor-pointer w-full sm:w-auto px-4 py-1.5 bg-[#0652e9] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#0547d1] transition-all shadow-sm hover:shadow-md mt-2 sm:mt-0"
                      >
                        {solvedProblemIds.includes(problem.problem_id)
                          ? "Resolve"
                          : "Solve"}
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
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Banner - Scaled Down */}
        {/* Welcome Banner */}
        <div className="bg-[#0652e9] rounded-2xl p-5 sm:p-6 mb-4 shadow-lg relative overflow-hidden">
          {/* Decorative circles */}

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Master Your Skills
                </h2>
              </div>
              <p className="text-indigo-100 text-xs sm:text-sm max-w-lg font-medium">
                Challenge yourself with {stats.total} curated problems.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <div>
                    <div className="text-lg font-bold text-white leading-none">
                      {solvedCount || 0}
                    </div>
                    <div className="text-indigo-100 text-[10px] font-medium">
                      Solved
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-300" />
                  <div>
                    <div className="text-lg font-bold text-white leading-none">
                      {Math.round((solvedCount / stats.total) * 100) || 0}%
                    </div>
                    <div className="text-indigo-100 text-[10px] font-medium">
                      Progress
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Resized & Re-colored (White -> Light Color Gradient) */}
        {/* Stats Cards - White to Visible Pastel Gradient */}
        {/* Stats Cards - Icons instead of Emojis */}
        {/* Stats Cards - Custom CSS Signals */}
{/* Stats Cards - Clean, De-cluttered, Signal Bars */}
<div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
  {/* Total Card - Replaced Icon with Layers */}
  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 col-span-2 lg:col-span-1 flex flex-col justify-center relative overflow-hidden group">
    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
      <Layers className="w-12 h-12 text-[#0652e9]" />
    </div>
    <div className="relative z-10">
      <div className="text-3xl font-bold text-slate-800 mb-1">
        {stats.total}
      </div>
      <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
        Total
      </div>
    </div>
  </div>

  {/* Easy Card - Signal Bars (1/3) */}
  <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
    <div>
      <div className="text-2xl font-bold text-emerald-700 mb-1">
        {stats.easy}
      </div>
      <div className="text-emerald-600/80 text-xs font-bold uppercase tracking-wider">
        Easy
      </div>
    </div>
    {/* Bars: 1 Active, 2 Inactive */}
    <div className="flex gap-1 items-end h-8">
      <div className="w-2 h-4 rounded-[2px] bg-emerald-500"></div>
      <div className="w-2 h-6 rounded-[2px] bg-emerald-200/50"></div>
      <div className="w-2 h-8 rounded-[2px] bg-emerald-200/50"></div>
    </div>
  </div>

  {/* Medium Card - Signal Bars (2/3) */}
  <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl p-4 shadow-sm border border-amber-100 flex items-center justify-between group hover:border-amber-200 transition-all">
    <div>
      <div className="text-2xl font-bold text-amber-700 mb-1">
        {stats.medium}
      </div>
      <div className="text-amber-600/80 text-xs font-bold uppercase tracking-wider">
        Medium
      </div>
    </div>
    {/* Bars: 2 Active, 1 Inactive */}
    <div className="flex gap-1 items-end h-8">
      <div className="w-2 h-4 rounded-[2px] bg-amber-500"></div>
      <div className="w-2 h-6 rounded-[2px] bg-amber-500"></div>
      <div className="w-2 h-8 rounded-[2px] bg-amber-200/50"></div>
    </div>
  </div>

  {/* Hard Card - Signal Bars (3/3) */}
  <div className="bg-gradient-to-br from-white to-rose-50 rounded-xl p-4 shadow-sm border border-rose-100 flex items-center justify-between group hover:border-rose-200 transition-all">
    <div>
      <div className="text-2xl font-bold text-rose-700 mb-1">
        {stats.hard}
      </div>
      <div className="text-rose-600/80 text-xs font-bold uppercase tracking-wider">
        Hard
      </div>
    </div>
    {/* Bars: 3 Active */}
    <div className="flex gap-1 items-end h-8">
      <div className="w-2 h-4 rounded-[2px] bg-rose-500"></div>
      <div className="w-2 h-6 rounded-[2px] bg-rose-500"></div>
      <div className="w-2 h-8 rounded-[2px] bg-rose-500"></div>
    </div>
  </div>

  {/* Solved Card - Clean Minimalist */}
  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl p-4 shadow-sm border border-indigo-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
    <div>
      <div className="text-2xl font-bold text-indigo-700 mb-1">
        {solvedCount || 0}
      </div>
      <div className="text-indigo-600/80 text-xs font-bold uppercase tracking-wider">
        Solved
      </div>
    </div>
    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
      <CheckCircle className="w-5 h-5 text-indigo-600" />
    </div>
  </div>
</div>
        {/* Search and Filters - Scaled Down */}
        <div className="bg-white rounded-xl p-3 shadow-sm mb-4 border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                className="px-3 py-2 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 font-medium text-slate-700 text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-3 py-2 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 font-medium text-slate-700 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCompanyMode(true)}
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#0652e9] to-indigo-600 text-white rounded-lg hover:from-[#0547d1] hover:to-indigo-700 transition-all flex items-center justify-center gap-1.5 font-medium shadow-sm hover:shadow hover:scale-105 transform text-sm col-span-2 sm:col-span-1"
              >
                <Building2 className="w-4 h-4" />
                Companies
              </button>
              {(searchQuery ||
                selectedDifficulty !== "all" ||
                selectedCategory !== "all") && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 text-sm flex items-center justify-center"
                  title="Clear filters"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count with Active Filters */}
        <div className="mb-3 flex items-center justify-between text-xs sm:text-sm text-slate-600">
          <div>
            Showing{" "}
            <span className="font-semibold text-[#0652e9]">
              {filteredProblems.length}
            </span>{" "}
            of {problems.length} problems
          </div>
          {(selectedDifficulty !== "all" || selectedCategory !== "all") && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden sm:inline">Filters:</span>
              {selectedDifficulty !== "all" && (
                <span className="px-2 py-0.5 bg-indigo-50 text-[#0652e9] rounded text-xs font-medium">
                  {selectedDifficulty}
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="px-2 py-0.5 bg-indigo-50 text-[#0652e9] rounded text-xs font-medium">
                  {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Problems List - Scaled Down */}
    {filteredProblems.length === 0 ? (
  <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">No problems found</h3>
    <button
      onClick={resetFilters}
      className="text-[#0652e9] font-medium hover:underline"
    >
      Clear search filters
    </button>
  </div>
) : (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
      <div className="col-span-1 text-center">Status</div>
      <div className="col-span-8">Problem</div>
      <div className="col-span-2">Difficulty</div>
      <div className="col-span-1 text-right">Acc.</div>
    </div>

    {/* List Body */}
    <div className="divide-y divide-slate-100">
      {filteredProblems.map((problem) => {
        const isSolved = solvedProblemIds.includes(problem.problem_id);
        const difficultyColor = 
          problem.difficulty === "Easy" ? "bg-emerald-500" :
          problem.difficulty === "Medium" ? "bg-amber-500" :
          "bg-rose-500";
        
        const difficultyText = 
          problem.difficulty === "Easy" ? "text-emerald-700" :
          problem.difficulty === "Medium" ? "text-amber-700" :
          "text-rose-700";

        const difficultyBg = 
          problem.difficulty === "Easy" ? "bg-emerald-50" :
          problem.difficulty === "Medium" ? "bg-amber-50" :
          "bg-rose-50";

        return (
          <div
            key={problem.problem_id}
            onClick={() => handleSolve(problem.problem_id)}
            className={`
              group grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer 
              transition-all duration-200 border-l-4 border-l-transparent
              ${isSolved 
                ? "bg-slate-50/30 hover:bg-slate-50 border-l-emerald-500" 
                : "hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:border-l-[#0652e9] hover:-translate-y-0.5"
              }
            `}
          >
            {/* 1. Status Column */}
            <div className="col-span-1 flex justify-center">
              {isSolved ? (
                <div className="bg-emerald-100 rounded-full p-1">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-slate-200 rounded-full group-hover:border-[#0652e9] transition-colors" />
              )}
            </div>

            {/* 2. Main Content: Title & Tags */}
            <div className="col-span-8">
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-mono text-slate-400 text-sm font-medium">
                  {String(problem.problem_id).padStart(3, '0')}
                </span>
                <h3 className={`text-base font-bold truncate transition-colors ${isSolved ? 'text-slate-600' : 'text-slate-900 group-hover:text-[#0652e9]'}`}>
                  {problem.title}
                </h3>
              </div>
              
              {/* Visible Tags */}
              <div className="flex flex-wrap gap-2">
                {problem.tags && problem.tags.slice(0, 4).map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 group-hover:border-slate-300 transition-colors uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
                {problem.tags && problem.tags.length > 4 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 text-slate-400 border border-slate-100">
                    +{problem.tags.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* 3. Difficulty Column */}
            <div className="col-span-2">
              <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-transparent ${isSolved ? 'opacity-70' : ''} ${difficultyBg} bg-opacity-50`}>
                <div className="flex items-end gap-[2px] h-3.5 w-3.5">
                  <div className={`w-1 rounded-[1px] ${difficultyColor} h-1.5`}></div>
                  <div className={`w-1 rounded-[1px] ${problem.difficulty !== 'Easy' ? difficultyColor : 'bg-slate-300/50'} h-2.5`}></div>
                  <div className={`w-1 rounded-[1px] ${problem.difficulty === 'Hard' ? difficultyColor : 'bg-slate-300/50'} h-3.5`}></div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${difficultyText}`}>
                  {problem.difficulty}
                </span>
              </div>
            </div>

            {/* 4. Acceptance Rate */}
            <div className="col-span-1 text-right">
              <span className="font-mono text-slate-500 text-sm font-medium">
                {problem.total_submissions > 0
                  ? `${((problem.accepted_submissions / problem.total_submissions) * 100).toFixed(0)}%`
                  : "-"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default Arena;

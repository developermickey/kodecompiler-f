
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  CheckCircle,
  X,
  Loader,
  Building2,
  Briefcase,
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Layers,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblems } from "../../redux/slices/problemSlice";
import { fetchUserProgress } from "../../redux/slices/userprogressSlice";
import { useNavigate } from "react-router-dom";

const Arena = () => {
  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCompanyMode, setShowCompanyMode] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      navigate("/login");
      return null;
    }
    navigate(`/problem/${problemId}`);
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleDifficultyChange = (e) => setSelectedDifficulty(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("all");
    setSelectedCategory("all");
  };

  const handleCompanySearch = (e) => setCompanySearchQuery(e.target.value);
  const resetCompanyFilters = () => {
    setCompanySearchQuery("");
  };

  const solvedCompanyProblems = companyFilteredProblems.filter((problem) =>
    solvedProblemIds.includes(problem.problem_id)
  );

  const companySolvedPercentage =
    companyFilteredProblems.length === 0
      ? 0
      : ((solvedCompanyProblems.length / companyFilteredProblems.length) * 100).toFixed(0);

  // --- REUSABLE COMPONENT: Difficulty Signal Badge ---
  // This replaces the plain text with the bar visualization
  const DifficultyBadge = ({ difficulty }) => {
    const styles = {
        Easy: { 
            text: "text-emerald-700", 
            bg: "bg-emerald-50 border-emerald-100", 
            barActive: "bg-emerald-500", 
            barInactive: "bg-emerald-200/50" 
        },
        Medium: { 
            text: "text-amber-700", 
            bg: "bg-amber-50 border-amber-100", 
            barActive: "bg-amber-500", 
            barInactive: "bg-amber-200/50" 
        },
        Hard: { 
            text: "text-rose-700", 
            bg: "bg-rose-50 border-rose-100", 
            barActive: "bg-rose-500", 
            barInactive: "bg-rose-200/50" 
        }
    };

    const style = styles[difficulty] || styles.Easy;
    const level = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border ${style.bg}`}>
            {/* The Signal Bars */}
            <div className="flex gap-[1.5px] items-end h-3">
                <div className={`w-1 rounded-[1px] h-1.5 ${style.barActive}`}></div>
                <div className={`w-1 rounded-[1px] h-2 ${level >= 2 ? style.barActive : style.barInactive}`}></div>
                <div className={`w-1 rounded-[1px] h-3 ${level >= 3 ? style.barActive : style.barInactive}`}></div>
            </div>
            {/* The Text Label */}
            <span className={`text-[10px] font-bold uppercase tracking-wide ${style.text}`}>
                {difficulty}
            </span>
        </div>
    );
  };

  // --- REUSABLE COMPONENT: The Problem List ---
  const ProblemList = ({ data }) => {
    if (data.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>No problems found.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-8">Problem</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-1 text-right">Acc.</div>
        </div>

        {/* List Body */}
        <div className="divide-y divide-slate-100">
          {data.map((problem) => {
            const isSolved = solvedProblemIds.includes(problem.problem_id);
            return (
              <div
                key={problem.problem_id}
                onClick={() => handleSolve(problem.problem_id)}
                className={`
                    group cursor-pointer transition-all duration-200 
                    p-4 md:px-6 md:py-4
                    flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-4 md:items-center
                    ${isSolved ? "bg-slate-50/50" : "hover:bg-slate-50"}
                `}
              >
                {/* Mobile Top Row: ID & Difficulty Badge */}
                <div className="flex items-center justify-between md:hidden">
                  <span className="text-xs font-mono text-slate-400">
                    #{String(problem.problem_id).padStart(3, "0")}
                  </span>
                  
                  {/* Replaced Text with Badge Component */}
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>

                {/* Desktop: Status Column */}
                <div className="hidden md:flex col-span-1 justify-center">
                  {isSolved ? (
                    <div className="bg-emerald-100 rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-full group-hover:border-blue-500 transition-colors" />
                  )}
                </div>

                {/* Main Content: Title & Tags */}
                <div className="md:col-span-8">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm sm:text-base font-bold ${
                        isSolved
                          ? "text-slate-600"
                          : "text-slate-900 group-hover:text-[#0652e9]"
                      }`}
                    >
                      {problem.title}
                    </h3>
                    {/* Mobile Status Icon (Top Right next to title) */}
                    {isSolved && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 md:hidden mt-1" />
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {problem.tags &&
                      problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium border border-slate-200 whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Desktop: Difficulty Column */}
                <div className="hidden md:block col-span-2">
                   {/* Replaced Text with Badge Component */}
                   <DifficultyBadge difficulty={problem.difficulty} />
                </div>

                {/* Acceptance Rate (Desktop & Mobile) */}
                <div className="md:col-span-1 md:text-right flex items-center gap-1 md:block">
                  <span className="text-[10px] uppercase text-slate-400 font-bold md:hidden">
                    Acceptance:
                  </span>
                  <span className="font-mono text-slate-500 text-xs font-medium">
                    {problem.total_submissions > 0
                      ? `${(
                          (problem.accepted_submissions /
                            problem.total_submissions) *
                          100
                        ).toFixed(0)}%`
                      : "-"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- REUSABLE COMPONENT: Stat Card ---
  const StatCard = ({ title, count, colorClass, barColor, bars = 0, icon: Icon }) => (
    <div className={`bg-gradient-to-br from-white ${colorClass} rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between group transition-all`}>
      <div className="mb-2 sm:mb-0">
        <div className="text-xl sm:text-2xl font-bold text-slate-800 mb-0.5 leading-none">
          {count}
        </div>
        <div className="text-slate-500/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          {title}
        </div>
      </div>
      
      <div className="self-end sm:self-center">
        {Icon ? (
          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
            <Icon className="w-4 h-4 text-slate-600" />
          </div>
        ) : (
          <div className="flex gap-1 items-end h-6 sm:h-8">
            <div className={`w-1.5 sm:w-2 h-3 sm:h-4 rounded-[2px] ${bars >= 1 ? barColor : 'bg-slate-200/50'}`}></div>
            <div className={`w-1.5 sm:w-2 h-4 sm:h-6 rounded-[2px] ${bars >= 2 ? barColor : 'bg-slate-200/50'}`}></div>
            <div className={`w-1.5 sm:w-2 h-5 sm:h-8 rounded-[2px] ${bars >= 3 ? barColor : 'bg-slate-200/50'}`}></div>
          </div>
        )}
      </div>
    </div>
  );

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

  // --- MODE: Company View ---
  if (showCompanyMode) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#0652e9] shadow-xl pb-6 pt-4 sm:py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setShowCompanyMode(false)}
              className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors group text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg shrink-0">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Company Interview Problems
                </h1>
                <p className="text-sm text-indigo-100 max-w-xl">
                  Curated list of problems asked by top tech companies.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl">
              {[
                { label: "Total", val: companyFilteredProblems.length, icon: Target, color: "text-emerald-300", bg: "bg-emerald-500/20" },
                { label: "Done", val: `${companySolvedPercentage}%`, icon: TrendingUp, color: "text-amber-300", bg: "bg-amber-500/20" },
                { label: "Solved", val: solvedCompanyProblems.length, icon: Award, color: "text-purple-300", bg: "bg-purple-500/20" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 flex flex-col items-center sm:items-start sm:flex-row gap-2 sm:gap-3">
                  <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-base sm:text-xl font-bold text-white leading-tight">
                      {stat.val}
                    </div>
                    <div className="text-indigo-100 text-[10px] sm:text-xs font-medium uppercase">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
          {/* Featured Companies */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0652e9]" />
                Featured
              </h2>
            </div>
            <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 scrollbar-hide">
              {["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Uber"].map((company) => (
                <button
                  key={company}
                  onClick={() => setCompanySearchQuery(company)}
                  className="px-3 py-1.5 bg-slate-50 whitespace-nowrap hover:bg-[#0652e9] hover:text-white text-slate-600 rounded-lg text-xs font-medium transition-all border border-slate-200"
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl p-3 shadow-sm mb-4 border border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search company problems..."
                value={companySearchQuery}
                onChange={handleCompanySearch}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 text-sm"
              />
              {(companySearchQuery) && (
                <button
                  onClick={resetCompanyFilters}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          </div>

          {/* Reused Problem List Component */}
          <ProblemList data={companyFilteredProblems} />
        </div>
      </div>
    );
  }

  // --- MODE: Standard View ---
  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Banner */}
        <div className="bg-[#0652e9] rounded-2xl p-5 sm:p-6 mb-6 shadow-lg shadow-blue-900/10 relative overflow-hidden text-white">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-1">Master Your Skills</h2>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium">
                        {stats.total} curated problems waiting for you.
                    </p>
                </div>
                <div className="flex gap-2">
                     <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 border border-white/20">
                        <div className="text-xs text-blue-100 uppercase font-bold tracking-wider">Solved</div>
                        <div className="text-xl font-bold leading-none mt-0.5">{solvedCount}</div>
                     </div>
                     <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 border border-white/20">
                        <div className="text-xs text-blue-100 uppercase font-bold tracking-wider">Progress</div>
                        <div className="text-xl font-bold leading-none mt-0.5">
                            {Math.round((solvedCount / stats.total) * 100) || 0}%
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="col-span-2 md:col-span-1">
                <StatCard title="Total" count={stats.total} colorClass="to-slate-50" icon={Layers} />
            </div>
            <StatCard title="Easy" count={stats.easy} colorClass="to-emerald-50" barColor="bg-emerald-500" bars={1} />
            <StatCard title="Medium" count={stats.medium} colorClass="to-amber-50" barColor="bg-amber-500" bars={2} />
            <StatCard title="Hard" count={stats.hard} colorClass="to-rose-50" barColor="bg-rose-500" bars={3} />
            <div className="col-span-2 md:col-span-1">
                 <StatCard title="Solved" count={solvedCount} colorClass="to-indigo-50" icon={CheckCircle} />
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-3 shadow-sm mb-4 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0652e9] border border-slate-200 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 md:flex">
              <select
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium w-full md:w-auto"
              >
                <option value="all">Diff: All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium w-full md:w-auto"
              >
                <option value="all">Cat: All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
                onClick={() => setShowCompanyMode(true)}
                className="col-span-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
              >
                <Building2 className="w-4 h-4" />
                <span className="md:hidden">Switch to </span>Companies
              </button>
          </div>
        </div>

        {/* Reused Problem List Component */}
        <ProblemList data={filteredProblems} />
      </div>
    </div>
  );
};

export default Arena;
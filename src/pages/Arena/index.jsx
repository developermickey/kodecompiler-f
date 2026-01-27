import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  CheckCircle,
  Circle,
  Loader,
  Trophy,
  ChevronDown,
  X,
  Filter,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblems } from "../../redux/slices/problemSlice";
import { fetchUserProgress } from "../../redux/slices/userprogressSlice";
import { useNavigate } from "react-router-dom";

// --- SUB-COMPONENT: Difficulty Badge ---
const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    Easy: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    Medium: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
    Hard: { bg: "bg-rose-100 text-rose-700", dot: "bg-rose-500" },
  };
  const style = styles[difficulty] || styles.Easy;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${style.bg}`}
    >
      {difficulty}
    </span>
  );
};

// --- REUSABLE COMPONENT: Custom Dropdown ---
const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map internal values to display labels
  const getDisplayLabel = () => {
    if (value === "all") return label;
    // Capitalize first letter for display if needed
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
          ${
            isOpen || value !== "all"
              ? "bg-white border-blue-500 ring-2 ring-blue-500/10 text-blue-700"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
          }
        `}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 ${value !== "all" ? "text-blue-500" : "text-zinc-400"}`}
          />
        )}
        <span>{getDisplayLabel()}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-500" : "text-zinc-400"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-40 bg-white rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
          {/* Option: All (Reset) */}
          <button
            onClick={() => {
              onChange("all");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-zinc-50 transition-colors flex items-center justify-between
              ${value === "all" ? "text-blue-600 bg-blue-50/50" : "text-zinc-600"}
            `}
          >
            <span>All {label}</span>
            {value === "all" && <CheckCircle className="w-3 h-3" />}
          </button>

          <div className="h-px bg-zinc-100 my-1" />

          {/* Options List */}
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-zinc-50 transition-colors flex items-center justify-between
                ${value === option ? "text-blue-600 bg-blue-50/50" : "text-zinc-600"}
              `}
            >
              <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              {value === option && <CheckCircle className="w-3 h-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
// --- SUB-COMPONENT: LeetCode Style Companies Widget ---
const CompaniesWidget = ({
  problems = [],
  selectedCompany,
  onSelectCompany,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Logic: Derive Company Stats from the actual Problem List
  // We scan all problems, count company occurrences, and sort by popularity.
  const companyStats = useMemo(() => {
    const stats = {};

    problems.forEach((problem) => {
      // Assuming problem.companies is an array of strings like ["Google", "Amazon"]
      // If your data uses tags for companies, change this to problem.tags
      const companies = problem.companies || [];

      companies.forEach((company) => {
        stats[company] = (stats[company] || 0) + 1;
      });
    });

    // Convert object to array and sort by count (descending)
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [problems]);

  // 2. Logic: Filter the derived list based on the local search input
  const filteredList = companyStats.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden sticky top-6 flex flex-col max-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-zinc-700">
          <Building2 className="w-4 h-4" />
          <span className="font-semibold text-sm">Companies</span>
        </div>
        {selectedCompany && (
          <button
            onClick={() => onSelectCompany(null)}
            className="text-[10px] font-medium text-red-500 hover:text-red-600 bg-red-50 px-2 py-0.5 rounded-full transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-3 shrink-0">
        <div className="relative bg-zinc-100 rounded-lg group focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent py-2 pl-8 pr-8 text-xs font-medium text-zinc-700 placeholder:text-zinc-400 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Chips Cloud (Scrollable Area) */}
      <div className="px-3 pb-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {filteredList.length === 0 ? (
          <div className="text-center py-4 text-xs text-zinc-400">
            No companies found
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {filteredList.map((company) => {
              const isSelected = selectedCompany === company.name;

              return (
                <button
                  key={company.name}
                  onClick={() =>
                    onSelectCompany(isSelected ? null : company.name)
                  } // Toggle logic
                  className={`
                    group flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-200
                    ${
                      isSelected
                        ? "bg-zinc-800 border-zinc-800 text-white shadow-md"
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                    }
                  `}
                >
                  <span className="text-xs font-medium truncate max-w-[100px]">
                    {company.name}
                  </span>
                  <span
                    className={`
                      text-[9px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-mono
                      ${
                        isSelected
                          ? "bg-zinc-600 text-zinc-100"
                          : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                      }
                    `}
                  >
                    {company.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
// --- MAIN COMPONENT ---
const Arena = () => {
  // State
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "all",
    status: "all",
    topic: null,
    company: null,
  });

  const [showAllTopics, setShowAllTopics] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const {
    list: problems,
    stats,
    loading,
  } = useSelector((state) => state.problems);
  const { solvedProblemIds, solvedCount } = useSelector(
    (state) => state.userProgress,
  );

  useEffect(() => {
    dispatch(fetchProblems());
    if (user) dispatch(fetchUserProgress());
  }, [dispatch, user]);

  // Derived State
  const allTopics = useMemo(() => {
    const tags = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // 1. Search Filter
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      // 2. Difficulty Filter
      const matchesDifficulty =
        filters.difficulty === "all" ||
        problem.difficulty === filters.difficulty;

      // 3. Status Filter
      const isSolved = solvedProblemIds.includes(problem.problem_id);
      let matchesStatus = true;
      if (filters.status === "solved") matchesStatus = isSolved;
      if (filters.status === "todo") matchesStatus = !isSolved;

      // 4. Topic Filter
      const matchesTopic =
        !filters.topic ||
        (problem.tags && problem.tags.includes(filters.topic));

      // 5. Company Filter (NEW)
      // Checks if the selected company exists in the problem's 'companies' array
      const matchesCompany =
        !filters.company ||
        (problem.companies && problem.companies.includes(filters.company));

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesStatus &&
        matchesTopic &&
        matchesCompany
      );
    });
  }, [problems, filters, solvedProblemIds]);
  const handleSolve = (problemId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/problem/${problemId}`);
  };

  const toggleTopic = (topic) => {
    setFilters((prev) => ({
      ...prev,
      topic: prev.topic === topic ? null : topic,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-8 h-8 text-zinc-900 animate-spin" />
      </div>
    );
  }

  const visibleTopics = showAllTopics ? allTopics : allTopics.slice(0, 15);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-zinc-900">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* TOP ROW: Title & Progress */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Problem Set
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Join the arena and test your skills.
            </p>
          </div>

          {/* Stats Widget */}
          <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-zinc-400">
                Solved
              </div>
              <div className="text-lg font-bold leading-none">
                {solvedCount}{" "}
                <span className="text-zinc-300 text-sm">/ {stats.total}</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center border border-yellow-100">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* --- LEFT COLUMN (Problems) --- */}
          <div className="lg:col-span-3 space-y-5">
            {/* 1. FILTER BAR */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
              {/* Search & Dropdowns */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow group">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-zinc-800" />
                  <input
                    type="text"
                    placeholder="Search title..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  {/* Difficulty Dropdown */}
                  <FilterDropdown
                    label="Difficulty"
                    options={["Easy", "Medium", "Hard"]}
                    value={filters.difficulty}
                    onChange={(val) =>
                      setFilters((prev) => ({ ...prev, difficulty: val }))
                    }
                  />

                  {/* Status Dropdown */}
                  <FilterDropdown
                    label="Status"
                    options={["solved", "todo"]}
                    value={filters.status}
                    onChange={(val) =>
                      setFilters((prev) => ({ ...prev, status: val }))
                    }
                  />
                </div>
              </div>

              {/* Topic Cloud (Horizontal Scroll on Mobile) */}
              {allTopics.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 md:flex-wrap no-scrollbar">
                    {filters.topic && (
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, topic: null }))
                        }
                        className="flex-shrink-0 flex items-center gap-1 px-3 py-1 bg-zinc-800 text-white rounded-full text-xs font-medium hover:bg-zinc-700"
                      >
                        <X className="w-3 h-3" />
                        {filters.topic}
                      </button>
                    )}
                    {visibleTopics.map((topic) => {
                      if (topic === filters.topic) return null;
                      return (
                        <button
                          key={topic}
                          onClick={() => toggleTopic(topic)}
                          className="flex-shrink-0 px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-xs font-medium hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
                        >
                          {topic}
                        </button>
                      );
                    })}
                    {allTopics.length > 15 && (
                      <button
                        onClick={() => setShowAllTopics(!showAllTopics)}
                        className="text-xs text-blue-600 font-medium whitespace-nowrap px-1 hover:underline"
                      >
                        {showAllTopics ? "Show Less" : "Expand"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. TABLE */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-50/50 border-b border-zinc-200 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                <div className="col-span-1">Status</div>
                <div className="col-span-8">Title</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-1 text-right">Acc.</div>
              </div>

              <div className="divide-y divide-zinc-100">
                {filteredProblems.length === 0 ? (
                  <div className="py-20 text-center text-zinc-400">
                    <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No problems found.</p>
                    <button
                      onClick={() =>
                        setFilters({
                          search: "",
                          difficulty: "all",
                          status: "all",
                          topic: null,
                        })
                      }
                      className="text-blue-600 text-sm hover:underline mt-2"
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  filteredProblems.map((problem, i) => {
                    const isSolved = solvedProblemIds.includes(
                      problem.problem_id,
                    );
                    return (
                      <div
                        key={problem.problem_id}
                        onClick={() => handleSolve(problem.problem_id)}
                        className={`group relative flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 p-4 md:px-6 md:py-4 cursor-pointer hover:bg-zinc-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-white"}`}
                      >
                        {/* Status */}
                        <div className="hidden md:block col-span-1">
                          {isSolved ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-300 group-hover:text-zinc-400" />
                          )}
                        </div>

                        {/* Title */}
                        <div className="md:col-span-8">
                          <div className="flex items-center justify-between md:justify-start gap-2">
                            <h3 className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">
                              <span className="mr-2 text-zinc-400 font-mono text-xs">
                                {problem.problem_id}.
                              </span>
                              {problem.title}
                            </h3>
                            {/* Mobile Check */}
                            {isSolved && (
                              <CheckCircle className="w-4 h-4 text-emerald-500 md:hidden" />
                            )}
                          </div>
                        </div>

                        {/* Difficulty */}
                        <div className="flex items-center justify-between md:block md:col-span-2 mt-1 md:mt-0">
                          <DifficultyBadge difficulty={problem.difficulty} />

                          {/* Mobile Acc */}
                          <span className="text-xs text-zinc-400 font-mono md:hidden">
                            {problem.total_submissions > 0
                              ? `${((problem.accepted_submissions / problem.total_submissions) * 100).toFixed(0)}%`
                              : "-"}
                          </span>
                        </div>

                        {/* Desktop Acc */}
                        <div className="hidden md:block col-span-1 text-right text-xs text-zinc-500 font-mono">
                          {problem.total_submissions > 0
                            ? `${((problem.accepted_submissions / problem.total_submissions) * 100).toFixed(1)}%`
                            : "-"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Sidebar) --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* 1. Daily Challenge Card */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden group cursor-pointer">
              <div className="absolute -right-6 -top-6 bg-white/5 w-24 h-24 rounded-full blur-xl group-hover:bg-white/10 transition-all"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Daily Challenge
                  </span>
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-lg leading-tight mb-1">
                  Merge k Sorted Lists
                </h3>
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                    Hard
                  </span>
                  <span className="text-emerald-400 font-medium">+10 XP</span>
                </div>
              </div>
            </div>

            {/* 2. Companies Widget */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pass props to the new widget */}
              <CompaniesWidget
                problems={problems}
                selectedCompany={filters.company}
                onSelectCompany={(companyName) =>
                  setFilters((prev) => ({ ...prev, company: companyName }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arena;

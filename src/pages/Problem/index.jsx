import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Settings,
  History,
  Moon,
  Sun,
  Type,
  X,
  Loader,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag,
  Building,
  Code,
  Terminal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertTriangle,
  Info,
  Check,
  PlayCircle,
  Copy,
  BarChart3,
  Zap,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Sparkles,
  Cpu,
  HardDrive,
  Eye,
  EyeOff,
  Filter,
  Search,
  TrendingUp,
  Users,
  Star,
  Calendar,
  GitBranch,
  FileText,
  HelpCircle,
  ListChecks,
  Send,
  AlertCircle as AlertIcon,
  Pause,
  ThumbsUp,
  ThumbsDown,
  User,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import NotFound from "../NotFound";

const Problem = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [openHintIndex, setOpenHintIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [testCaseHeight, setTestCaseHeight] = useState(200);
  const [isResizingTestCase, setIsResizingTestCase] = useState(false);
  const [timer, setTimer] = useState(1800);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("testcases");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [customTimerMinutes, setCustomTimerMinutes] = useState(30);
  const [leftPanelTab, setLeftPanelTab] = useState("description");
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [selectedsubLanguage, setSeletcedsubLanguage] = useState(null);
  const [selectedcode, setSelectedCode] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [isLoadingSolutions, setIsLoadingSolutions] = useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = useState(null);
  const [solutionsFilter, setSolutionsFilter] = useState("all");
  const [expandedSolutionId, setExpandedSolutionId] = useState(null);
  const [solutionLanguages, setSolutionLanguages] = useState([]);
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);
  //const [filteredsolution , setFilteredSolution] = useState();
  const [votechange, setvotechange] = useState(true);

  const MONACO_LANG_MAP = {
    python: "python",
    javascript: "javascript",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    bash: "bash",
  };

  const containerRef = useRef(null);
  const hintsRef = useRef(null);
  const companiesRef = useRef(null);

  // Timer functionality
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimer(customTimerMinutes * 60);
    setIsTimerRunning(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    // remove old scrollbar style if exists
    const oldStyle = document.getElementById("custom-scrollbar-style");
    if (oldStyle) {
      oldStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "custom-scrollbar-style";

    style.innerHTML = `
    /* ===== NORMAL SCROLLBAR ONLY ===== */

    /* Chrome, Edge, Safari */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${darkMode ? "#09090b" : "#f4f4f5"};
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${darkMode ? "#3f3f46" : "#a1a1aa"};
      border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: ${darkMode ? "#52525b" : "#71717a"};
    }

    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: ${darkMode ? "#3f3f46 #09090b" : "#a1a1aa #f4f4f5"};
    }
  `;

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [darkMode]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/problems/${problemId}`,
          { credentials: "include" }
        );
        const data = await res.json();

        const acceptanceRate =
          data.total_submissions > 0
            ? (
                (data.accepted_submissions / data.total_submissions) *
                100
              ).toFixed(2)
            : "0.00";

        const formattedProblem = {
          id: problemId,
          title: data.title || "",
          difficulty: data.difficulty || "Medium",
          description: data.description || "",
          examples: data.examples || [],
          constraints: data.constraints || [],
          hints: data.hints || [],
          tags: data.tags || [],
          starter_code: data.starter_code || {},
          companies: data.companies || [],
          testCases: (data.test_cases || []).filter((tc) => !tc.hidden),
          points: data.points || 0,
          acceptanceRate,
          total_submissions: data.total_submissions || 0,
          accepted_submissions: data.accepted_submissions || 0,
          time_limit: data.time_limit || "2s",
          memory_limit: data.memory_limit || "256MB",
        };

        setProblem(formattedProblem);
        const languages = Object.keys(formattedProblem.starter_code);
        if (languages.length > 0) {
          setSelectedLanguage(languages[0]);
          setCode(formattedProblem.starter_code[languages[0]] || "");
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
      }
    };

    fetchData();
  }, [problemId]);

  // Fetch submissions
  useEffect(() => {
    if (leftPanelTab !== "submissions" || !problem) return;

    const fetchSubmissions = async () => {
      setIsLoadingSubmissions(true);

      try {
        const res = await fetch(
          `http://localhost:5000/api/problems/submissions/my?problem_id=${Number(
            problemId
          )}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch submissions");
        }

        const data = await res.json();

        const formatted = data.map((sub) => ({
          id: sub.id || sub._id,
          date: new Date(sub.submitted_at).toLocaleString(),
          language: sub.language,
          status: sub.status,
          runtime: sub.runtime_ms ? `${sub.runtime_ms} ms` : "-",
          memory: sub.memory_kb ? `${sub.memory_kb} MB` : "-",
          code: sub.code,
        }));

        setSubmissions(formatted);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setSubmissions([]);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [leftPanelTab, problemId, problem]);

  // Fetch solutions
  useEffect(() => {
    if (leftPanelTab !== "solutions" || !problemId) return;

    const fetchSolutions = async () => {
      setIsLoadingSolutions(true);
      try {
        const url = new URL(
          `http://localhost:5000/api/solutions/problem/${problemId}`
        );

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch solutions");
        }

        const data = await res.json();

        // // Filter verified solutions if selected
        // let filteredData = data;
        // if (solutionsFilter === "verified") {
        //   filteredData = data.filter(sol => sol.is_verified);
        // }

        // // Extract unique languages from solutions
        const languages = [...new Set(data.map((sol) => sol.language))];
        setSolutionLanguages(languages);

        setSolutions(data);

        // Auto-select first solution

        if (!selectedSolutionId && data.length > 0) {
          setSelectedSolutionId(data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching solutions:", err);
        setSolutions([]);
      } finally {
        setIsLoadingSolutions(false);
      }
    };

    fetchSolutions();
  }, [leftPanelTab, problemId, votechange]);

  const selectedSolution = useMemo(() => {
    return solutions.find((s) => s._id === selectedSolutionId) || null;
  }, [solutions, selectedSolutionId]);

  // Resizing logic for main panel
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && containerRef.current) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const newLeftWidth =
          ((e.clientX - containerRect.left) / containerRect.width) * 100;

        if (newLeftWidth > 25 && newLeftWidth < 75) {
          setLeftWidth(newLeftWidth);
        }
      }

      if (isResizingTestCase && containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const relativeY = e.clientY;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newHeight = containerRect.bottom - relativeY;

        if (newHeight > 100 && newHeight < containerHeight - 200) {
          setTestCaseHeight(newHeight);
        }
      }
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      setIsResizingTestCase(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isResizingTestCase]);

  const filteredSolutions = useMemo(() => {
    if (solutionsFilter === "all") return solutions;
    return solutions.filter((s) => s.language === solutionsFilter);
  }, [solutionsFilter, solutions]);

  // Scroll to section
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlevote = async (vote, solutionId) => {
    const res = await fetch(
      `http://localhost:5000/api/solutions/${solutionId}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          solution_id: solutionId, // ✅ ADD THIS
          vote_type: vote, // "upvote" or "downvote"
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("422 error details:", err);
      throw new Error("Vote failed");
      return;
    }

    setvotechange(!votechange);

    return res.json();
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setOutput("");

      const response = await fetch("http://localhost:5000/api/problems/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          problem_id: problemId, // from useParams
          language: selectedLanguage, // python / cpp / java etc
          code: code, // editor code
        }),
      });

      const data = await response.json();

      if (data.status === "Success") {
        setOutput(
          `Input:
        ${data.test_case_used.input}

        Output:
        ${data.output}

        Execution Time: ${data.execution_time} ms`
        );
      } else {
        setOutput(
          `Error:
        ${data.error || "Unknown error"}`
        );
      }
    } catch (err) {
      setOutput("Error connecting to server");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    setIsRunning(true);
    setIsSubmitted(false);
    setActiveTab("results");

    setTimeout(() => {
      const passed = Math.random() > 0.3;
      if (passed) {
        setOutput(
          `✅ Accepted\n\n✓ All test cases passed\n✓ Runtime: ${Math.floor(
            Math.random() * 100 + 50
          )} ms\n✓ Memory: ${(Math.random() * 20 + 40).toFixed(
            1
          )} MB\n✓ Beats ${Math.floor(Math.random() * 30 + 60)}% of users`
        );
        setIsSubmitted(true);
      } else {
        setOutput(
          `❌ Wrong Answer\n\n✗ Test Case ${
            Math.floor(Math.random() * problem.testCases.length) + 1
          } failed\n\nInput: ${problem.testCases[0]?.input}\nYour Output: ${
            Math.random() > 0.5 ? "null" : "undefined"
          }\nExpected: ${problem.testCases[0]?.expected}`
        );
      }
      setIsRunning(false);
    }, 2000);
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <Code className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-zinc-400 font-medium">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem.title) {
    return <NotFound />;
  }

  // Color schemes with smaller text
  const difficultyColors = {
    Easy: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-500",
      border: "border-emerald-500/30",
      ring: "ring-emerald-500/20",
    },
    Medium: {
      bg: "bg-amber-500/15",
      text: "text-amber-500",
      border: "border-amber-500/30",
      ring: "ring-amber-500/20",
    },
    Hard: {
      bg: "bg-rose-500/15",
      text: "text-rose-500",
      border: "border-rose-500/30",
      ring: "ring-rose-500/20",
    },
  };

  const diff = difficultyColors[problem.difficulty] || difficultyColors.Medium;

  // Zinc-based dark theme colors
  const bgPrimary = darkMode ? "bg-zinc-950" : "bg-gray-50";
  const bgSecondary = darkMode ? "bg-zinc-900" : "bg-white";
  const bgTertiary = darkMode ? "bg-zinc-800" : "bg-gray-100";
  const textPrimary = darkMode ? "text-zinc-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-zinc-300" : "text-gray-700";
  const textTertiary = darkMode ? "text-zinc-400" : "text-gray-500";
  const borderColor = darkMode ? "border-zinc-800" : "border-gray-200";
  const hoverBg = darkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100";
  const activeBg = darkMode ? "bg-zinc-800" : "bg-gray-200";

  // Language options
  const languageOptions = Object.keys(problem.starter_code || {}).map(
    (lang) => ({
      value: lang,
      label: lang.charAt(0).toUpperCase() + lang.slice(1),
    })
  );

  // Custom scrollbar styles
  const scrollbarStyles = darkMode
    ? "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
    : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100";

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          border: "border-emerald-500/20",
        };
      case "Wrong Answer":
        return {
          bg: "bg-rose-500/10",
          text: "text-rose-700",
          border: "border-rose-500/20",
        };
      case "Time Limit Exceeded":
        return {
          bg: "bg-amber-500/15",
          text: "text-amber-600",
          border: "border-amber-500/20",
        };
      case "Runtime Error":
        return {
          bg: "bg-red-500/10",
          text: "text-red-300",
          border: "border-red-500/20",
        };
      default:
        return {
          bg: "bg-zinc-500/10",
          text: "text-zinc-300",
          border: "border-zinc-500/20",
        };
    }
  };

  // Language filter options for solutions
  const languageFilterOptions = [
    { value: "all", label: "All Languages" },
    { value: "verified", label: "Verified Only" },
    ...solutionLanguages.map((lang) => ({
      value: lang,
      label: lang.charAt(0).toUpperCase() + lang.slice(1),
    })),
  ];

  return (
    <div className={`h-screen flex flex-col ${bgPrimary} overflow-hidden`}>
      {/* Timer Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowTimerModal(false)}
          />

          {/* Modal */}
          <div
            className={`${bgSecondary} relative w-[380px] rounded-xl border ${borderColor} shadow-2xl p-6 z-10`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center">
                  ⏱️
                </div>
                <div>
                  <h3 className={`${textPrimary} font-semibold text-lg`}>
                    Timer Settings
                  </h3>
                  <p className={`${textTertiary} text-xs`}>
                    Set your focus duration
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTimerModal(false)}
                className={`cursor-pointer p-1.5 rounded-md ${hoverBg} transition-colors`}
                aria-label="Close"
              >
                <X className={`w-4 h-4 ${textTertiary}`} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-5">
              {/* Input */}
              <div>
                <label
                  className={`${textSecondary} text-sm font-medium mb-2 block`}
                >
                  Duration (minutes)
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customTimerMinutes}
                    onChange={(e) =>
                      setCustomTimerMinutes(
                        Math.max(1, Math.min(180, Number(e.target.value) || 1))
                      )
                    }
                    className={`w-full pl-4 pr-12 py-2.5 rounded-lg text-sm border ${borderColor}
                      ${
                        darkMode
                          ? "bg-zinc-900 text-zinc-100 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-900 focus:ring-blue-500"
                      }
                      focus:outline-none focus:ring-2`}
                  />

                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${textTertiary}`}
                  >
                    min
                  </span>
                </div>

                <p className={`${textTertiary} text-xs mt-1`}>
                  Max 180 minutes • Recommended: 25–50
                </p>
              </div>

              {/* Info */}
              <div
                className={`rounded-lg border ${borderColor} p-3 text-xs ${textSecondary}
                  ${darkMode ? "bg-zinc-800/40" : "bg-gray-100"}`}
              >
                ⏳ Current timer will be set to{" "}
                <span className="font-semibold text-blue-500">
                  {customTimerMinutes} minutes
                </span>{" "}
                ({customTimerMinutes * 60} seconds)
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setTimer(customTimerMinutes * 60);
                    setIsTimerRunning(false);
                    setShowTimerModal(false);
                  }}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
                >
                  ▶ Apply
                </button>

                <button
                  onClick={resetTimer}
                  className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm border ${borderColor}
                    ${
                      darkMode
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        : "bg-white hover:bg-gray-100 text-gray-700"
                    } transition-colors`}
                >
                  ↺ Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOP NAVIGATION ===== */}
      <div
        className={`${bgSecondary} border-b ${borderColor} px-5 py-2.5 flex items-center justify-between`}
      >
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-l border-zinc-800 pl-4">
            <button
              onClick={() => setLeftPanelTab("description")}
              className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                leftPanelTab === "description"
                  ? `${activeBg} ${textPrimary}`
                  : `${textTertiary} ${hoverBg}`
              }`}
            >
              <FileText className="w-3 h-3" />
              Description
            </button>
            <button
              onClick={() => setLeftPanelTab("submissions")}
              className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                leftPanelTab === "submissions"
                  ? `${activeBg} ${textPrimary}`
                  : `${textTertiary} ${hoverBg}`
              }`}
            >
              <ListChecks className="w-3 h-3" />
              Submissions
            </button>

            <button
              onClick={() => setLeftPanelTab("solutions")}
              className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                leftPanelTab === "solutions"
                  ? `${activeBg} ${textPrimary}`
                  : `${textTertiary} ${hoverBg}`
              }`}
            >
              <Code className="w-3 h-3" />
              Solutions
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded ${textTertiary} ${hoverBg} transition-colors`}
            >
              <BarChart3 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Center Section - Problem Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-xs ${textTertiary} mb-0.5`}>Acceptance</div>
            <div className={`font-bold text-sm ${textPrimary}`}>
              {problem.acceptanceRate}%
            </div>
          </div>
          <div className="text-center">
            <div className={`text-xs ${textTertiary} mb-0.5`}>Points</div>
            <div className={`font-bold text-sm ${textPrimary}`}>
              {problem.points}
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border ${borderColor}
            ${darkMode ? "bg-zinc-800/70" : "bg-gray-100"}
            shadow-sm`}
          >
            {/* Clock Icon */}
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-lg
              ${timer < 300 ? "bg-rose-500/15" : "bg-blue-500/15"}`}
            >
              <Clock
                className={`w-3.5 h-3.5 ${
                  timer < 300 ? "text-rose-500" : "text-blue-500"
                }`}
              />
            </div>

            {/* Time */}
            <span
              className={`font-mono font-semibold text-sm tracking-wide
                ${timer < 300 ? "text-rose-500" : textPrimary}`}
            >
              {formatTime(timer)}
            </span>

            {/* Divider */}
            <div
              className={`h-5 w-px ${darkMode ? "bg-zinc-700" : "bg-gray-300"}`}
            />

            {/* Play / Pause */}

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`cursor-pointer p-1.5 rounded-lg transition-colors
                ${
                  darkMode
                    ? "hover:bg-zinc-700 text-zinc-300"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              title={isTimerRunning ? "Pause Timer" : "Start Timer"}
            >
              {isTimerRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowTimerModal(true)}
              className={`cursor-pointer p-1.5 rounded-lg transition-colors
                ${
                  darkMode
                    ? "hover:bg-zinc-700 text-zinc-300"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              title="Timer Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            className={`cursor-pointer p-2 rounded-lg ${hoverBg} transition-colors`}
          >
            <History className={`w-4 h-4 ${textTertiary}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`cursor-pointer p-2 rounded-lg ${hoverBg} transition-colors`}
            >
              <Settings className={`w-4 h-4 ${textTertiary}`} />
            </button>

            {showSettings && (
              <div
                className={`absolute right-0 mt-2 w-64 ${bgSecondary} ${borderColor} border rounded-lg shadow-xl z-50`}
              >
                <div className="p-4 border-b ${borderColor}">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`${textPrimary} font-bold text-sm`}>
                      Settings
                    </h3>
                    <X
                      onClick={() => setShowSettings(false)}
                      className={`w-4 h-4 ${textTertiary} cursor-pointer hover:text-zinc-300`}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          className={`${textSecondary} text-xs font-medium flex items-center gap-1.5`}
                        >
                          {darkMode ? (
                            <Moon className="w-3.5 h-3.5" />
                          ) : (
                            <Sun className="w-3.5 h-3.5" />
                          )}
                          Theme
                        </label>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`w-10 h-5 rounded-full transition-colors relative ${
                            darkMode ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                              darkMode ? "left-5" : "left-0.5"
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`${textSecondary} text-xs font-medium mb-2 flex items-center gap-1.5`}
                      >
                        <Type className="w-3.5 h-3.5" />
                        Font Size: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="18"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-700 rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* ===== LEFT PANEL ===== */}
        <div
          style={{ width: `${leftWidth}%` }}
          className={`overflow-y-auto ${bgSecondary} p-6 ${scrollbarStyles}`}
        >
          {leftPanelTab === "description" ? (
            <>
              {/* Problem Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-semibold border ${diff.bg} ${diff.text} ${diff.border} ring-1 ${diff.ring}`}
                      >
                        {problem.difficulty}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs">
                        <button
                          onClick={() => scrollToSection(hintsRef)}
                          className={`cursor-pointer ${textTertiary} hover:text-zinc-200 px-2 py-1 rounded transition-colors`}
                        >
                          💡 Hints ({problem.hints.length})
                        </button>
                        {problem.companies.length > 0 && (
                          <>
                            <span className={textTertiary}>•</span>
                            <button
                              onClick={() => scrollToSection(companiesRef)}
                              className={`cursor-pointer ${textTertiary} hover:text-zinc-200 px-2 py-1 rounded flex items-center gap-1 transition-colors`}
                            >
                              <Building className="w-3 h-3" />
                              Companies ({problem.companies.length})
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <h1 className={`text-x2 font-bold ${textPrimary} mb-3`}>
                      {problem.id}. {problem.title}
                    </h1>
                    <p className={`${textSecondary} text-sm leading-normal`}>
                      {problem.description}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-zinc-800/30" : "bg-gray-50"
                    } border ${borderColor}`}
                  >
                    <div className={`text-xs ${textTertiary} mb-1`}>
                      Total Submissions
                    </div>
                    <div className={`font-bold ${textPrimary}`}>
                      {problem.total_submissions?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-zinc-800/30" : "bg-gray-50"
                    } border ${borderColor}`}
                  >
                    <div className={`text-xs ${textTertiary} mb-1`}>
                      Accepted Submissions
                    </div>
                    <div className={`font-bold ${textPrimary}`}>
                      {problem.accepted_submissions}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-emerald-500/10" : "bg-emerald-100"
                    } border ${
                      darkMode ? "border-emerald-500/20" : "border-emerald-200"
                    }`}
                  >
                    <div
                      className={`text-xs ${
                        darkMode ? "text-emerald-300" : "text-emerald-700"
                      } mb-1`}
                    >
                      Acceptance Rate
                    </div>
                    <div
                      className={`font-bold ${
                        darkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      {problem.acceptanceRate}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Examples Section */}
              {problem.examples.length > 0 && (
                <div className="mb-6">
                  <h3
                    className={`${textPrimary} font-bold text-sm mb-3 flex items-center gap-1.5`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Examples
                  </h3>
                  <div className="space-y-4">
                    {problem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`border ${borderColor} rounded-lg overflow-hidden ${
                          darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                        }`}
                      >
                        <div
                          className={`px-4 py-2.5 ${
                            darkMode ? "bg-zinc-800/40" : "bg-gray-100"
                          } border-b ${borderColor}`}
                        >
                          <span
                            className={`text-xs font-semibold ${
                              darkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
                            Example {idx + 1}
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="space-y-3">
                            <div>
                              <div className={`text-xs ${textTertiary} mb-1.5`}>
                                Input
                              </div>
                              <pre
                                className={`text-xs font-mono p-3 rounded ${
                                  darkMode
                                    ? "bg-zinc-900 text-zinc-300"
                                    : "bg-white text-gray-800"
                                } overflow-x-auto border ${borderColor}`}
                              >
                                {ex.input}
                              </pre>
                            </div>
                            <div>
                              <div className={`text-xs ${textTertiary} mb-1.5`}>
                                Output
                              </div>
                              <pre
                                className={`text-xs font-mono p-3 rounded ${
                                  darkMode
                                    ? "bg-zinc-900 text-zinc-300"
                                    : "bg-white text-gray-800"
                                } overflow-x-auto border ${borderColor}`}
                              >
                                {ex.output}
                              </pre>
                            </div>
                            {ex.explanation && (
                              <div>
                                <div
                                  className={`text-xs ${textTertiary} mb-1.5`}
                                >
                                  Explanation
                                </div>
                                <p className={`text-xs ${textSecondary}`}>
                                  {ex.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Constraints Section */}
              {problem.constraints.length > 0 && (
                <div className="mb-6">
                  <h3
                    className={`${textPrimary} font-bold text-sm mb-3 flex items-center gap-1.5`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Constraints
                  </h3>
                  <div
                    className={`${
                      darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                    } border ${borderColor} rounded-lg p-4`}
                  >
                    <ul className={`space-y-2 text-xs ${textSecondary}`}>
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 mt-0.5 text-zinc-500">•</span>
                          <span className="font-mono">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tags Section */}
              {problem.tags.length > 0 && (
                <div className="mb-6">
                  <h3
                    className={`${textPrimary} font-bold text-sm mb-3 flex items-center gap-1.5`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Topics & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          darkMode
                            ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                        } transition-colors cursor-pointer`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Section */}
              {problem.companies.length > 0 && (
                <div ref={companiesRef} className="mb-6 scroll-mt-8">
                  <h3
                    className={`${textPrimary} font-bold text-sm mb-3 flex items-center gap-1.5`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    Companies
                  </h3>
                  <div
                    className={`${
                      darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                    } border ${borderColor} rounded-lg p-4`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {problem.companies.map((company, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            darkMode
                              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          } transition-colors cursor-pointer flex items-center gap-1.5`}
                        >
                          <Building className="w-3 h-3" />
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Hints Section */}
              {problem.hints.length > 0 && (
                <div ref={hintsRef} className="mb-6 scroll-mt-8">
                  <h3
                    className={`${textPrimary} font-bold text-sm mb-3 flex items-center gap-1.5`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Hints
                  </h3>
                  <div className="space-y-2">
                    {problem.hints.map((hint, index) => (
                      <div
                        key={index}
                        className={`border ${borderColor} rounded-lg overflow-hidden ${
                          darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setOpenHintIndex(
                              openHintIndex === index ? null : index
                            )
                          }
                          className={`cursor-pointer w-full flex justify-between items-center px-4 py-3 ${textPrimary} ${
                            darkMode
                              ? "hover:bg-zinc-800/40"
                              : "hover:bg-gray-100"
                          } transition-colors`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded ${
                                darkMode ? "bg-amber-500/10" : "bg-amber-100"
                              } flex items-center justify-center`}
                            >
                              <span className="text-xs">💡</span>
                            </div>
                            <span className="font-medium text-sm">
                              Hint {index + 1}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 ${textTertiary} transition-transform ${
                              openHintIndex === index ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openHintIndex === index && (
                          <div
                            className={`px-4 py-3 border-t ${borderColor} ${
                              darkMode ? "bg-zinc-900/20" : "bg-white"
                            }`}
                          >
                            <p className={`${textSecondary} text-sm`}>{hint}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : leftPanelTab === "submissions" ? (
            /* ===== SUBMISSIONS TAB ===== */
            <div>
              <div className="mb-6">
                <h1 className={`text-xl font-bold ${textPrimary} mb-2`}>
                  My Submissions
                </h1>
                <p className={`${textSecondary} text-sm`}>
                  View your previous submissions for this problem
                </p>
              </div>

              {isLoadingSubmissions ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                      <ListChecks className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-zinc-400 font-medium">
                      Loading submissions...
                    </p>
                  </div>
                </div>
              ) : submissions.length === 0 ? (
                <div
                  className={`flex flex-col items-center justify-center h-64 ${
                    darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                  } rounded-lg border ${borderColor}`}
                >
                  <Send className="w-12 h-12 text-zinc-500 mb-4" />
                  <h3 className={`${textPrimary} font-medium mb-2`}>
                    No submissions yet
                  </h3>
                  <p
                    className={`${textSecondary} text-sm text-center max-w-md`}
                  >
                    Submit your solution to see it appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`${
                      darkMode ? "bg-zinc-800/30" : "bg-gray-50"
                    } border ${borderColor} rounded-lg overflow-hidden`}
                  >
                    <div
                      className={`grid grid-cols-12 px-4 py-3 ${
                        darkMode ? "bg-zinc-800/40" : "bg-gray-100"
                      } border-b ${borderColor} text-xs font-medium ${textTertiary}`}
                    >
                      <div className="col-span-3">Date</div>
                      <div className="col-span-2">Language</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Runtime</div>
                      <div className="col-span-2">Memory</div>
                    </div>
                    <div className="cursor-pointer divide-y divide-zinc-800">
                      {submissions.map((sub) => {
                        const statusColors = getStatusColor(sub.status);
                        return (
                          <div
                            key={sub.id}
                            className={`grid grid-cols-12 px-4 py-3 items-center hover:${
                              darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                            } transition-colors`}
                            onClick={() => {
                              setSelectedCode(sub.code);
                              setSeletcedsubLanguage(sub.language);
                            }}
                          >
                            <div
                              className={`col-span-3 text-xs ${textSecondary}`}
                            >
                              {sub.date}
                            </div>
                            <div
                              className={`col-span-2 text-xs ${textSecondary}`}
                            >
                              {sub.language}
                            </div>
                            <div className="col-span-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                              >
                                {sub.status === "Accepted" && (
                                  <Check className="w-3 h-3 mr-1" />
                                )}
                                {sub.status === "Wrong Answer" && (
                                  <AlertIcon className="w-3 h-3 mr-1" />
                                )}
                                {sub.status === "Wrong Answer" ? (
                                  "Wrong"
                                ) : sub.status === "Time Limit Exceeded" ? (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    TLE
                                  </span>
                                ) : (
                                  sub.status
                                )}{" "}
                              </span>
                            </div>
                            <div
                              className={`col-span-2 text-xs font-mono ${textPrimary}`}
                            >
                              {sub.runtime}
                            </div>
                            <div
                              className={`col-span-2 text-xs font-mono ${textPrimary}`}
                            >
                              {sub.memory}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Most Recent Submission Details */}
                  {selectedcode && (
                    <div
                      className={`border ${borderColor} rounded-lg overflow-hidden ${
                        darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 ${
                          darkMode ? "bg-zinc-800/40" : "bg-gray-100"
                        } border-b ${borderColor}`}
                      >
                        <h3 className={`${textPrimary} font-medium text-sm`}>
                          Selected Submission Code
                        </h3>
                        <p className={`${textTertiary} text-xs mt-1`}>
                          {selectedsubLanguage}
                        </p>
                      </div>
                      <div className="p-4">
                        <pre
                          className={`text-xs font-mono p-4 rounded ${
                            darkMode
                              ? "bg-zinc-900 text-zinc-300"
                              : "bg-white text-gray-800"
                          } overflow-x-auto border ${borderColor}`}
                        >
                          {selectedcode}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Submission Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-emerald-100 border-emerald-200"
                      } border`}
                    >
                      <div
                        className={`text-xs ${
                          darkMode ? "text-emerald-300" : "text-emerald-700"
                        } mb-1`}
                      >
                        Accepted
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          darkMode ? "text-emerald-300" : "text-emerald-700"
                        }`}
                      >
                        {
                          submissions.filter((s) => s.status === "Accepted")
                            .length
                        }
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode
                          ? "bg-amber-500/10 border-amber-500/20"
                          : "bg-amber-100 border-amber-200"
                      } border`}
                    >
                      <div
                        className={`text-xs ${
                          darkMode ? "text-amber-300" : "text-amber-700"
                        } mb-1`}
                      >
                        Wrong Answer
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          darkMode ? "text-amber-300" : "text-amber-700"
                        }`}
                      >
                        {
                          submissions.filter((s) => s.status === "Wrong Answer")
                            .length
                        }
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode
                          ? "bg-zinc-800/30 border-zinc-800"
                          : "bg-gray-100 border-gray-200"
                      } border`}
                    >
                      <div className={`text-xs ${textTertiary} mb-1`}>
                        Total Attempts
                      </div>
                      <div className={`text-xl font-bold ${textPrimary}`}>
                        {submissions.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : leftPanelTab === "solutions" ? (
            /* ===== SOLUTIONS TAB ===== */
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className={`text-xl font-bold ${textPrimary} mb-2`}>
                      Solutions
                    </h1>
                    <p className={`${textSecondary} text-sm`}>
                      Browse solutions submitted by other users
                    </p>
                  </div>

                  {/* Language Filter Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageFilter(!showLanguageFilter)}
                      className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg ${
                        darkMode
                          ? "bg-zinc-800 hover:bg-zinc-700"
                          : "bg-gray-100 hover:bg-gray-200"
                      } border ${borderColor} text-sm font-medium ${textPrimary} transition-colors`}
                    >
                      <Filter className="w-4 h-4" />
                      {solutionsFilter === "all"
                        ? "All Languages"
                        : solutionsFilter === "verified"
                        ? "Verified Only"
                        : solutionsFilter.charAt(0).toUpperCase() +
                          solutionsFilter.slice(1)}
                      <ChevronDown
                        className={`w-4 h-4 ${textTertiary} transition-transform ${
                          showLanguageFilter ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showLanguageFilter && (
                      <div
                        className={`absolute right-0 mt-2 w-56 ${bgSecondary} ${borderColor} border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto`}
                      >
                        <div className="p-2">
                          {languageFilterOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSolutionsFilter(option.value);
                                setShowLanguageFilter(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded ${
                                solutionsFilter === option.value
                                  ? `${
                                      darkMode
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "bg-blue-100 text-blue-600"
                                    }`
                                  : `${textSecondary} ${
                                      darkMode
                                        ? "hover:bg-zinc-800"
                                        : "hover:bg-gray-100"
                                    }`
                              } transition-colors`}
                            >
                              <span className="flex-1 text-left">
                                {option.label}
                              </span>
                              {solutionsFilter === option.value && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filter Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`text-sm ${textSecondary}`}>
                    Showing{" "}
                    <span className={`font-bold ${textPrimary}`}>
                      {solutions.length}
                    </span>{" "}
                    solution{solutions.length !== 1 ? "s" : ""}
                    {solutionsFilter !== "all" && (
                      <span className="ml-2">
                        filtered by:{" "}
                        <span
                          className={`font-medium ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          {solutionsFilter === "verified"
                            ? "Verified Only"
                            : solutionsFilter.charAt(0).toUpperCase() +
                              solutionsFilter.slice(1)}
                        </span>
                      </span>
                    )}
                  </div>

                  {solutionsFilter !== "all" && (
                    <button
                      onClick={() => setSolutionsFilter("all")}
                      className={`cursor-pointer text-xs px-3 py-1.5 rounded ${
                        darkMode
                          ? "bg-zinc-800 hover:bg-zinc-700"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textSecondary} transition-colors flex items-center gap-1.5`}
                    >
                      <X className="w-3 h-3" />
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isLoadingSolutions ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                      <Code className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-zinc-400 font-medium">
                      Loading solutions...
                    </p>
                  </div>
                </div>
              ) : !filteredSolutions ? (
                <div
                  className={`flex flex-col items-center justify-center h-64 ${
                    darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                  } rounded-lg border ${borderColor}`}
                >
                  <Code className="w-12 h-12 text-zinc-500 mb-4" />
                  <h3 className={`${textPrimary} font-medium mb-2`}>
                    {solutionsFilter === "all"
                      ? "No solutions yet"
                      : "No matching solutions"}
                  </h3>
                  <p
                    className={`${textSecondary} text-sm text-center max-w-md`}
                  >
                    {solutionsFilter === "all"
                      ? "Be the first to submit a solution for this problem!"
                      : `No ${
                          solutionsFilter === "verified"
                            ? "verified"
                            : solutionsFilter
                        } solutions found. Try a different filter.`}
                  </p>
                  {solutionsFilter !== "all" && (
                    <button
                      onClick={() => setSolutionsFilter("all")}
                      className="mt-4 cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      Show All Solutions
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Solutions List */}
                  <div
                    className={`${
                      darkMode ? "bg-zinc-800/30" : "bg-gray-50"
                    } border ${borderColor} rounded-lg overflow-hidden`}
                  >
                    <div
                      className={`grid grid-cols-12 px-4 py-3 ${
                        darkMode ? "bg-zinc-800/40" : "bg-gray-100"
                      } border-b ${borderColor} text-xs font-medium ${textTertiary}`}
                    >
                      <div className="col-span-1">Votes</div>
                      <div className="col-span-4">Solution</div>
                      <div className="col-span-2">Language</div>
                      <div className="col-span-3">User</div>
                      <div className="col-span-2">Date</div>
                    </div>

                    <div className="divide-y divide-zinc-800">
                      {filteredSolutions &&
                        filteredSolutions.map((solution) => (
                          <div
                            key={solution._id}
                            className={`grid grid-cols-12 px-4 py-3 items-center hover:${
                              darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                            } transition-colors cursor-pointer ${
                              selectedSolution?._id === solution._id
                                ? darkMode
                                  ? "bg-zinc-800/40"
                                  : "bg-blue-50/50"
                                : ""
                            }`}
                            onClick={() => setSelectedSolutionId(solution._id)}
                          >
                            {/* Votes */}
                            <div className="col-span-1">
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3 text-emerald-500" />
                                  <span
                                    className={`text-xs font-bold ${textPrimary}`}
                                  >
                                    {solution.upvotes || 0}
                                  </span>
                                </div>
                                {solution.is_verified && (
                                  <div className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    Verified
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Solution Preview */}
                            <div className="col-span-4">
                              <div className="flex flex-col">
                                <span
                                  className={`text-sm font-medium ${textPrimary} truncate`}
                                >
                                  {solution.title || "Untitled Solution"}
                                </span>
                              </div>
                            </div>

                            {/* Language */}
                            <div className="col-span-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  darkMode
                                    ? "bg-zinc-800 text-zinc-300"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {solution.language}
                              </span>
                            </div>

                            {/* User */}
                            <div className="col-span-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full ${
                                    darkMode ? "bg-zinc-700" : "bg-gray-300"
                                  } flex items-center justify-center`}
                                >
                                  <User className="w-3 h-3 text-zinc-400" />
                                </div>
                                <span
                                  className={`text-xs ${textSecondary} truncate`}
                                >
                                  {solution.username}
                                </span>
                              </div>
                            </div>

                            {/* Date */}
                            <div
                              className={`col-span-2 text-xs ${textSecondary}`}
                            >
                              {new Date(
                                solution.created_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Selected Solution Details */}
                  {selectedSolution && (
                    <div
                      className={`border ${borderColor} rounded-lg overflow-hidden ${
                        darkMode ? "bg-zinc-800/20" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 ${
                          darkMode ? "bg-zinc-800/40" : "bg-gray-100"
                        } border-b ${borderColor}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3
                              className={`${textPrimary} font-medium text-sm`}
                            >
                              {selectedSolution.title || "Solution Details"}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-zinc-400" />
                                <span className={`text-xs ${textTertiary}`}>
                                  {selectedSolution.username}
                                </span>
                              </div>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  darkMode
                                    ? "bg-zinc-800 text-zinc-300"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {selectedSolution.language}
                              </span>
                              {selectedSolution.is_verified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  <Check className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                              <span className={`text-xs ${textTertiary}`}>
                                {new Date(
                                  selectedSolution.created_at
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setExpandedSolutionId(
                                  expandedSolutionId === selectedSolution._id
                                    ? null
                                    : selectedSolution._id
                                );
                              }}
                              className={`cursor-pointer p-1.5 rounded ${
                                darkMode
                                  ? "hover:bg-zinc-700"
                                  : "hover:bg-gray-200"
                              }`}
                            >
                              {expandedSolutionId === selectedSolution._id ? (
                                <ChevronUp className="w-4 h-4 text-zinc-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  selectedSolution.code
                                );
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className={`cursor-pointer p-1.5 rounded ${
                                darkMode
                                  ? "hover:bg-zinc-700"
                                  : "hover:bg-gray-200"
                              }`}
                              title="Copy code"
                            >
                              <Copy className={`w-4 h-4 ${textTertiary}`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Solution Code */}
                      <div className="p-4">
                        {selectedSolution.description && (
                          <div className="mb-4">
                            <h4
                              className={`text-sm font-medium ${textPrimary} mb-2`}
                            >
                              Description
                            </h4>
                            <p className={`text-sm ${textSecondary}`}>
                              {selectedSolution.description}
                            </p>
                          </div>
                        )}

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4
                              className={`text-sm font-medium ${textPrimary}`}
                            >
                              Code
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handlevote("upvote", selectedSolution._id)
                                }
                                className={`cursor-pointer flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                  darkMode
                                    ? "hover:bg-zinc-800"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3 text-emerald-500" />
                                <span className={textSecondary}>
                                  {selectedSolution.upvotes || 0}
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handlevote("downvote", selectedSolution._id)
                                }
                                className={`cursor-pointer flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                  darkMode
                                    ? "hover:bg-zinc-800"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <ThumbsDown className="w-3 h-3 text-rose-500" />
                              </button>
                            </div>
                          </div>

                          <div
                            className={`${
                              expandedSolutionId === selectedSolution._id
                                ? ""
                                : "max-h-96 overflow-hidden"
                            }`}
                          >
                            <pre
                              className={`text-xs font-mono p-4 rounded ${
                                darkMode
                                  ? "bg-zinc-900 text-zinc-300"
                                  : "bg-white text-gray-800"
                              } overflow-x-auto border ${borderColor}`}
                            >
                              {selectedSolution.code}
                            </pre>

                            {expandedSolutionId !== selectedSolution._id && (
                              <div className="relative">
                                <div
                                  className={`absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t ${
                                    darkMode ? "from-zinc-800" : "from-gray-50"
                                  } to-transparent`}
                                ></div>
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                                  <button
                                    onClick={() =>
                                      setExpandedSolutionId(
                                        selectedSolution._id
                                      )
                                    }
                                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium ${
                                      darkMode
                                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    } flex items-center gap-1`}
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                    Show Full Code
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Solution Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className={`p-3 rounded-lg ${
                              darkMode ? "bg-zinc-800/30" : "bg-gray-100"
                            } border ${borderColor}`}
                          >
                            <div className={`text-xs ${textTertiary} mb-1`}>
                              Time Complexity
                            </div>
                            <div
                              className={`text-sm font-medium ${textPrimary}`}
                            >
                              {selectedSolution.time_complexity ||
                                "Not specified"}
                            </div>
                          </div>
                          <div
                            className={`p-3 rounded-lg ${
                              darkMode ? "bg-zinc-800/30" : "bg-gray-100"
                            } border ${borderColor}`}
                          >
                            <div className={`text-xs ${textTertiary} mb-1`}>
                              Space Complexity
                            </div>
                            <div
                              className={`text-sm font-medium ${textPrimary}`}
                            >
                              {selectedSolution.space_complexity ||
                                "Not specified"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Solutions Stats */}
                  <div className="grid grid-cols-4 gap-3">
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode
                          ? "bg-blue-500/10 border-blue-500/20"
                          : "bg-blue-100 border-blue-200"
                      } border`}
                    >
                      <div
                        className={`text-xs ${
                          darkMode ? "text-blue-300" : "text-blue-700"
                        } mb-1`}
                      >
                        Total Solutions
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          darkMode ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        {solutions.length}
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-emerald-100 border-emerald-200"
                      } border`}
                    >
                      <div
                        className={`text-xs ${
                          darkMode ? "text-emerald-300" : "text-emerald-700"
                        } mb-1`}
                      >
                        Verified
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          darkMode ? "text-emerald-300" : "text-emerald-700"
                        }`}
                      >
                        {solutions.filter((s) => s.is_verified).length}
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode
                          ? "bg-amber-500/10 border-amber-500/20"
                          : "bg-amber-100 border-amber-200"
                      } border`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`text-xs ${
                              darkMode ? "text-amber-300" : "text-amber-700"
                            } mb-1`}
                          >
                            Top Language
                          </div>
                          <div
                            className={`text-xl font-bold ${
                              darkMode ? "text-amber-300" : "text-amber-700"
                            }`}
                          >
                            {(() => {
                              const langCount = {};
                              solutions.forEach((s) => {
                                langCount[s.language] =
                                  (langCount[s.language] || 0) + 1;
                              });
                              const topLang = Object.entries(langCount).sort(
                                (a, b) => b[1] - a[1]
                              )[0];
                              return topLang ? topLang[0] : "-";
                            })()}
                          </div>
                        </div>
                        <Code
                          className={`w-8 h-8 ${
                            darkMode ? "text-amber-300/40" : "text-amber-700/40"
                          }`}
                        />
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode
                          ? "bg-purple-500/10 border-purple-500/20"
                          : "bg-purple-100 border-purple-200"
                      } border`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`text-xs ${
                              darkMode ? "text-purple-300" : "text-purple-700"
                            } mb-1`}
                          >
                            Most Upvoted
                          </div>
                          <div
                            className={`text-xl font-bold ${
                              darkMode ? "text-purple-300" : "text-purple-700"
                            }`}
                          >
                            {solutions.length > 0
                              ? Math.max(
                                  ...solutions.map((s) => s.upvotes || 0)
                                )
                              : "-"}
                          </div>
                        </div>
                        <ThumbsUp
                          className={`w-8 h-8 ${
                            darkMode
                              ? "text-purple-300/40"
                              : "text-purple-700/40"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* ===== RESIZER HANDLE ===== */}
        <div
          onMouseDown={() => setIsResizing(true)}
          className={`w-1 cursor-col-resize ${
            darkMode
              ? "bg-zinc-800 hover:bg-blue-500"
              : "bg-gray-300 hover:bg-blue-400"
          } transition-colors`}
        />

        {/* ===== RIGHT PANEL - EDITOR ===== */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className={`flex flex-col ${bgPrimary}`}
        >
          {/* Editor Header */}
          <div className={`${bgSecondary} border-b ${borderColor} px-4 py-3`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Language Selection */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowLanguageDropdown(!showLanguageDropdown)
                    }
                    className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded ${
                      darkMode
                        ? "bg-zinc-800 hover:bg-zinc-700"
                        : "bg-gray-100 hover:bg-gray-200"
                    } border ${borderColor} text-sm font-medium ${textPrimary} transition-colors`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    {selectedLanguage.charAt(0).toUpperCase() +
                      selectedLanguage.slice(1)}
                    <ChevronDown
                      className={`w-3.5 h-3.5 ${textTertiary} transition-transform ${
                        showLanguageDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showLanguageDropdown && (
                    <div
                      className={`absolute top-full mt-1 min-w-[160px] ${bgSecondary} ${borderColor} border rounded-lg shadow-lg z-50`}
                    >
                      <div className="p-1">
                        {languageOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedLanguage(option.value);
                              setCode(
                                problem?.starter_code?.[option.value] || ""
                              );
                              setShowLanguageDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded ${
                              selectedLanguage === option.value
                                ? `${
                                    darkMode
                                      ? "bg-blue-500/20 text-blue-400"
                                      : "bg-blue-100 text-blue-600"
                                  }`
                                : `${textSecondary} ${
                                    darkMode
                                      ? "hover:bg-zinc-800"
                                      : "hover:bg-gray-100"
                                  }`
                            } transition-colors`}
                          >
                            <span>{option.label}</span>
                            {selectedLanguage === option.value && (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className={`cursor-pointer p-1.5 rounded ${
                    darkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100"
                  } transition-colors relative`}
                  title="Copy code"
                >
                  <Copy className={`w-4 h-4 ${textTertiary}`} />
                  {copied && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-zinc-800 text-white text-xs rounded border border-zinc-700">
                      Copied!
                    </div>
                  )}
                </button>
              </div>

              {/* Run and Submit Buttons */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs mr-4">
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded ${
                      darkMode ? "bg-zinc-800" : "bg-gray-100"
                    } border ${borderColor}`}
                  >
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span className={textSecondary}>
                      Time Limit: {problem.time_limit / 1000}s
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isRunning
                      ? "bg-zinc-600 cursor-not-allowed"
                      : `${
                          darkMode
                            ? "bg-zinc-800 hover:bg-zinc-700"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`
                  } ${textSecondary}`}
                >
                  {isRunning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-zinc-400/30 border-t-zinc-400 rounded-full animate-spin"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Run
                    </>
                  )}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isRunning}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isSubmitted
                      ? `${
                          darkMode
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        }`
                      : `${
                          darkMode
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`
                  } text-white`}
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Submitted
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={MONACO_LANG_MAP[selectedLanguage] || "plaintext"}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={darkMode ? "vs-dark" : "light"}
              options={{
                fontSize,
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 2,
                renderLineHighlight: "all",
                padding: { top: 16 },
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.6,
                cursorBlinking: "smooth",
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                  useShadows: false,
                },
              }}
            />
          </div>

          {/* Test Cases & Results Panel */}
          <div
            className={`border-t ${borderColor} ${bgSecondary} ${scrollbarStyles}`}
            style={{ height: testCaseHeight }}
          >
            {/* Resize Handle */}
            <div
              onMouseDown={() => setIsResizingTestCase(true)}
              className={`h-1.5 cursor-row-resize ${
                darkMode
                  ? "bg-zinc-800 hover:bg-blue-500"
                  : "bg-gray-300 hover:bg-blue-400"
              } transition-colors`}
            />

            <div className="h-full overflow-hidden flex flex-col">
              {/* Tabs */}
              <div className={`border-b ${borderColor} flex items-center`}>
                <button
                  onClick={() => setActiveTab("testcases")}
                  className={`px-4 py-2.5 text-xs font-medium relative transition-colors ${
                    activeTab === "testcases"
                      ? `${textPrimary} after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 ${
                          darkMode ? "after:bg-blue-500" : "after:bg-blue-600"
                        }`
                      : `${textTertiary} ${
                          darkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100"
                        }`
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveTab("results")}
                  className={`px-4 py-2.5 text-xs font-medium relative transition-colors ${
                    activeTab === "results"
                      ? `${textPrimary} after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 ${
                          darkMode ? "after:bg-blue-500" : "after:bg-blue-600"
                        }`
                      : `${textTertiary} ${
                          darkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100"
                        }`
                  }`}
                >
                  Results
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4">
                {activeTab === "testcases" ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-bold ${textPrimary} text-sm`}>
                        Test Cases
                      </h4>
                      <div className={`text-xs ${textTertiary}`}>
                        {problem.testCases?.length || 0} test cases
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.testCases?.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTestCase(index)}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            activeTestCase === index
                              ? `${
                                  darkMode
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-500 text-white"
                                }`
                              : `${
                                  darkMode
                                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`
                          }`}
                        >
                          Case {index + 1}
                        </button>
                      ))}
                    </div>

                    {problem.testCases?.[activeTestCase] && (
                      <div className="space-y-4">
                        <div>
                          <div className={`text-xs ${textTertiary} mb-2`}>
                            Input
                          </div>
                          <pre
                            className={`text-xs font-mono p-3 rounded ${
                              darkMode
                                ? "bg-zinc-900 text-zinc-300"
                                : "bg-white text-gray-800"
                            } overflow-x-auto border ${borderColor}`}
                          >
                            {problem.testCases[activeTestCase].input}
                          </pre>
                        </div>
                        <div>
                          <div className={`text-xs ${textTertiary} mb-2`}>
                            Expected Output
                          </div>
                          <pre
                            className={`text-xs font-mono p-3 rounded ${
                              darkMode
                                ? "bg-zinc-900 text-zinc-300"
                                : "bg-white text-gray-800"
                            } overflow-x-auto border ${borderColor}`}
                          >
                            {problem.testCases[activeTestCase].expected}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-bold ${textPrimary} text-sm`}>
                        Results
                      </h4>
                      {output && (
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              output.includes("✅") || output.includes("✓")
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          ></div>
                          <span
                            className={`text-xs ${
                              output.includes("✅") || output.includes("✓")
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}
                          >
                            {output.includes("✅") || output.includes("✓")
                              ? "Success"
                              : "Failed"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`${
                        darkMode ? "bg-zinc-900/50" : "bg-gray-100"
                      } rounded p-3 border ${borderColor}`}
                    >
                      <pre
                        className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                          output.includes("✅") || output.includes("✓")
                            ? "text-emerald-400"
                            : output.includes("❌")
                            ? "text-rose-400"
                            : textSecondary
                        }`}
                      >
                        {output || "Run your code to see results here"}
                      </pre>
                    </div>

                    {output && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div
                          className={`p-2 rounded ${
                            darkMode ? "bg-zinc-800/30" : "bg-gray-50"
                          } border ${borderColor} text-center`}
                        >
                          <div className={`text-xs ${textTertiary} mb-0.5`}>
                            Status
                          </div>
                          <div
                            className={`text-xs font-bold ${
                              output.includes("✅") || output.includes("✓")
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}
                          >
                            {output.includes("✅") || output.includes("✓")
                              ? "Accepted"
                              : "Failed"}
                          </div>
                        </div>
                        <div
                          className={`p-2 rounded ${
                            darkMode ? "bg-zinc-800/30" : "bg-gray-50"
                          } border ${borderColor} text-center`}
                        >
                          <div className={`text-xs ${textTertiary} mb-0.5`}>
                            Runtime
                          </div>
                          <div className={`text-xs font-bold ${textPrimary}`}>
                            {output.match(/\d+(\.\d+)?\s*ms/)?.[0] || "N/A"}
                          </div>
                        </div>
                        <div
                          className={`p-2 rounded ${
                            darkMode ? "bg-zinc-800/30" : "bg-gray-50"
                          } border ${borderColor} text-center`}
                        >
                          <div className={`text-xs ${textTertiary} mb-0.5`}>
                            Memory
                          </div>
                          <div className={`text-xs font-bold ${textPrimary}`}>
                            {output.match(/\d+(\.\d+)?\s*MB/)?.[0] || "N/A"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;

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
import { useDispatch, useSelector } from "react-redux";
import { fetchContestDetails } from "../../redux/slices/contestSlice";
import { API_BASE_URL } from "../../config/api";

const ContestQuestion = () => {
  /* =========================
   ROUTING / DATA
========================= */
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const dispatch = useDispatch();
  /* =========================
     CODE EDITOR STATE
  ========================= */
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);

  /* =========================
     EXECUTION / SUBMISSION
  ========================= */
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* =========================
     TEST CASES / TABS
  ========================= */
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [activeTab, setActiveTab] = useState("testcases");

  /* =========================
     UI / THEME / SETTINGS
  ========================= */
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  /* =========================
     LAYOUT / RESIZING
  ========================= */
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const [testCaseHeight, setTestCaseHeight] = useState(400);
  const [isResizingTestCase, setIsResizingTestCase] = useState(false);

  // Memoized static map to prevent recreation on render
  const MONACO_LANG_MAP = useMemo(
    () => ({
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
    }),
    []
  );

  const containerRef = useRef(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Scrollbar Style Injection
  useEffect(() => {
    const styleId = "custom-scrollbar-style";
    let style = document.getElementById(styleId);

    if (style) {
      style.remove();
    }

    style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      /* ===== NORMAL SCROLLBAR ONLY ===== */
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: ${
        darkMode ? "#09090b" : "#f4f4f5"
      }; }
      ::-webkit-scrollbar-thumb { background-color: ${
        darkMode ? "#3f3f46" : "#a1a1aa"
      }; border-radius: 6px; }
      ::-webkit-scrollbar-thumb:hover { background-color: ${
        darkMode ? "#52525b" : "#71717a"
      }; }
      * { scrollbar-width: thin; scrollbar-color: ${
        darkMode ? "#3f3f46 #09090b" : "#a1a1aa #f4f4f5"
      }; }
    `;

    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) existingStyle.remove();
    };
  }, [darkMode]);
  const [question_number, setQuestionNumber] = useState(0); // For now, we use question number 1
  // Fetch Contest Details
  useEffect(() => {
    console.log("Fetching contest details for ID:", id);
    dispatch(fetchContestDetails(id));
  }, [id, dispatch]);

  // Redux Selection
  const contest = useSelector(
    (store) =>
      store?.contest?.contest?.challenge?.questions[`${question_number}`]
  );
  const contestQuestions = useSelector(
    (store) => store?.contest?.contest?.challenge?.questions
  );
  // Problem Formatting Logic
  useEffect(() => {
    if (!contest) return;

    const formattedProblem = {
      question_number: contest.question_number || "",
      title: contest.title || "",
      difficulty: contest.difficulty || "Medium",
      description: contest.description || "",
      examples: contest.examples || [],
      constraints: contest.constraints || [],
      hints: contest.hints || [],
      starter_code: contest.starter_code || {},
      testCases: (contest.sample_test_cases || []).filter((tc) => !tc.hidden),
      points: contest.points || 0,
      time_limit: contest.time_limit || "2s",
      memory_limit: contest.memory_limit || "256MB",
    };
    setCode(formattedProblem.starter_code[selectedLanguage] || "");
    setProblem(formattedProblem);
  }, [contest, selectedLanguage]);

  // Resizing Logic
  useEffect(() => {
    if (!isResizing && !isResizingTestCase) return;

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

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setOutput("");

      const response = await fetch(`${API_BASE_URL}/problems/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          problem_id: id, // ✅ USE ROUTE PARAM
          language: selectedLanguage,
          code: code,
        }),
      });

      const data = await response.json();

      if (data.status === "Success") {
        setOutput(
          `Input:\n${data.test_case_used?.input || ""}\n\nOutput:\n${
            data.output
          }\n\nExecution Time: ${data.execution_time} ms`
        );
      } else {
        setOutput(`Error:\n${data.error || "Unknown error"}`);
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
        const randomTestCase = problem?.testCases?.length
          ? Math.floor(Math.random() * problem.testCases.length)
          : 0;

        setOutput(
          `❌ Wrong Answer\n\n✗ Test Case ${
            randomTestCase + 1
          } failed\n\nInput: ${
            problem?.testCases?.[0]?.input || "N/A"
          }\nYour Output: ${
            Math.random() > 0.5 ? "null" : "undefined"
          }\nExpected: ${problem?.testCases?.[0]?.expected || "N/A"}`
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

  // Memoized to prevent recreation on every render
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

  return (
    <div className={`h-screen flex flex-col ${bgPrimary} overflow-hidden`}>
      {/* ===== TOP NAVIGATION ===== */}
      <div
        className={`${bgSecondary} border-b ${borderColor} px-5 py-2.5 flex items-center relative `}
      >
        <div className="flex flex-wrap gap-2">
          {contestQuestions?.map((question, index) => {
            // Logic is now purely 0-based
            const isActive = question_number === index;

            return (
              <div
                key={index}
                onClick={() => setQuestionNumber(index)} // Sets state to 0, 1, 2...
                className={`
          cursor-pointer w-10 h-10 flex items-center justify-center rounded border-2 font-medium transition-colors
          ${
            isActive
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100"
          }
        `}
              >
                {/* If you want it to display "1" to humans but use "0" in logic, change this to {index + 1} */}
                {index + 1}
              </div>
            );
          })}
        </div>
        {/* Right Section - Actions */}
        <div className="absolute right-0 flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`cursor-pointer p-2 rounded-lg ${hoverBg} transition-colors`}
              aria-label="Settings"
            >
              <Settings className={`w-5 h-5 ${textTertiary}`} />
            </button>

            {showSettings && (
              <div
                className={`absolute right-0 mt-2 w-64 ${bgSecondary} ${borderColor} border rounded-lg shadow-xl z-50`}
              >
                <div className={`p-4 border-b ${borderColor}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`${textPrimary} font-bold text-sm`}>
                      Settings
                    </h3>
                    <X
                      onClick={() => setShowSettings(false)}
                      className={`w-4 h-4 ${textTertiary} cursor-pointer hover:text-zinc-300`}
                      aria-label="Close settings"
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
                          aria-label="Toggle theme"
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
                  </div>
                  <h1 className={`text-2xl font-bold ${textPrimary} mb-3`}>
                    {problem.question_number}. {problem.title}
                  </h1>
                  <p className={`${textSecondary} text-sm leading-normal`}>
                    {problem.description}
                  </p>
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
                              <div className={`text-xs ${textTertiary} mb-1.5`}>
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
          </>
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
                                ? darkMode
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-blue-100 text-blue-600"
                                : textSecondary +
                                  (darkMode
                                    ? " hover:bg-zinc-800"
                                    : " hover:bg-gray-100")
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
                  aria-label="Copy code"
                >
                  <Copy className={`w-4 h-4 ${textTertiary}`} />
                  {copied && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-zinc-800 text-white text-xs rounded border border-zinc-700 z-10 whitespace-nowrap">
                      Copied!
                    </div>
                  )}
                </button>
              </div>

              {/* Run and Submit Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isRunning
                      ? "bg-zinc-600 cursor-not-allowed"
                      : darkMode
                      ? "bg-zinc-800 hover:bg-zinc-700"
                      : "bg-gray-200 hover:bg-gray-300"
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
                      ? darkMode
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-emerald-500 hover:bg-emerald-600"
                      : darkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
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
                              ? darkMode
                                ? "bg-blue-600 text-white"
                                : "bg-blue-500 text-white"
                              : darkMode
                              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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

export default ContestQuestion;

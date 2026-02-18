import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Settings,
  Moon,
  Sun,
  Type,
  X,
  Play,
  CheckCircle,
  Tag,
  Code,
  Terminal,
  ChevronDown,
  AlertTriangle,
  Check,
  Copy,
  FileText,
  Send,
  Menu,
  Smartphone,
  Monitor,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContestDetails } from "../../redux/slices/contestSlice";
import apiClient from "../../redux/api/axios";
import { getResult, runCode, resetCodeState } from "../../redux/slices/codeSlice";

const ContestQuestion = () => {
  const [isMobile, setIsMobile] = useState(false);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { success, message, passed, total, details }

  /* =========================
     TEST CASES / TABS
  ========================= */

  const [activeTestCase, setActiveTestCase] = useState(0);
  const [activeTab, setActiveTab] = useState("testcases");
  
  /* =========================
     MOBILE VIEW STATE
  ========================= */

  const [mobileActiveTab, setMobileActiveTab] = useState("editor"); // 'problem' | 'editor'
  const [mobileView, setMobileView] = useState("vertical"); // 'vertical' | 'horizontal'
  const [showQuestionMenu, setShowQuestionMenu] = useState(false);

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
    [],
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
      store?.contest?.contest?.challenge?.questions[`${question_number}`],
  );
  const contestQuestions = useSelector(
    (store) => store?.contest?.contest?.challenge?.questions,
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Changed from 768 to 1024 for better tablet support
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  


  const { output, status, error, jobId, userCodes } = useSelector(
    (store) => store?.code,
  );


  // Reset code state when changing questions
  useEffect(() => {
    dispatch(resetCodeState());
    setSubmitResult(null);
  }, [question_number, dispatch]);

  const handleRun = () => {
    if (status === "running" || status === "submitting" || isSubmitting) return;
    setSubmitResult(null);
    setActiveTab("results");
    // Ensure we stay on editor tab in mobile view
    if (isMobile) setMobileActiveTab("editor");
    dispatch(runCode({ language: selectedLanguage, code, input: '' }));
  };

  // Poll for run results
  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(() => {
      dispatch(getResult(jobId));
    }, 2000);
    if (status === "completed" || status === "failed") {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [jobId, dispatch, status]);

  const handleSubmit = async () => {
    if (isSubmitting || status === "running") return;
    
    setIsSubmitting(true);
    setSubmitResult(null);
    setActiveTab("results");
    // Ensure we stay on editor tab in mobile view
    if (isMobile) setMobileActiveTab("editor");

    try {
      const response = await apiClient.post(
        `/weekly-challenges/${id}/question/${problem.question_number}/submit`,
        {
          code,
          language: selectedLanguage,
        }
      );
      
      console.log("Submit response:", response.data);
      
      // Handle various response formats
      const data = response.data;
      const isSuccess = data?.success === true || 
                        data?.status === "accepted" || 
                        (data?.passed !== undefined && data?.passed === data?.total);
      
      setSubmitResult({
        success: isSuccess,
        message: data?.message || data?.error || (isSuccess ? "All test cases passed!" : "Some test cases failed"),
        passed: data?.passed,
        total: data?.total,
        details: data?.details || data?.results || data?.test_results,
        execution_time: data?.execution_time || data?.time,
      });
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      setSubmitResult({
        success: false,
        message: err.response?.data?.message || err.response?.data?.error || err.response?.data?.detail || "Submission failed. Please try again.",
        error: true,
      });
    } finally {
      setIsSubmitting(false);
    }
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
    }),
  );

  // Custom scrollbar styles
  const scrollbarStyles = darkMode
    ? "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
    : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100";

  const MobileViewComponent = () => (
    <div className={`h-screen flex flex-col ${bgPrimary} overflow-hidden font-sans`}>
      
      {/* ===== HEADER ===== */}
      <div className={`${bgSecondary} border-b ${borderColor} px-3 py-2 flex items-center justify-between shrink-0 z-30 relative`}>
        <div className="flex items-center gap-3">
          {/* Menu Toggle (Opens Question List) */}
          <button
            onClick={() => setShowQuestionMenu(!showQuestionMenu)}
            className={`cursor-pointer p-2 rounded-lg transition-colors ${
              darkMode ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            {showQuestionMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          {/* Title & Badge */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${diff.bg} ${diff.text} ${diff.border}`}>
              {problem.difficulty}
            </span>
            <div className="flex flex-col overflow-hidden">
              <span className={`text-sm font-bold ${textPrimary} truncate max-w-[200px]`}>
                {problem.question_number}. {problem.title}
              </span>
            </div>
          </div>
        </div>

        {/* View Toggle (Only visible in Editor tab usually, but good to have access) */}
        {mobileActiveTab === "editor" && (
           <button
           onClick={() => setMobileView(mobileView === "vertical" ? "horizontal" : "vertical")}
           className={`cursor-pointer p-2 rounded-lg transition-colors hidden sm:block ${hoverBg}`}
           title={mobileView === "vertical" ? "Horizontal View" : "Vertical View"}
         >
           {mobileView === "vertical" ? (
             <Smartphone className={`w-4 h-4 ${textSecondary}`} />
           ) : (
             <Monitor className={`w-4 h-4 ${textSecondary}`} />
           )}
         </button>
        )}
      </div>

      {/* ===== QUESTION NAVIGATION OVERLAY (Replaces Source's Mobile Menu) ===== */}
      {showQuestionMenu && (
        <div className={`absolute top-[57px] left-0 w-full ${bgSecondary} border-b ${borderColor} shadow-xl z-40 p-4 animate-in slide-in-from-top-2`}>
          <h3 className={`text-xs font-bold ${textTertiary} uppercase tracking-wider mb-3`}>
            Contest Questions
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {contestQuestions?.map((q, index) => {
              const isActive = problem.question_number === (index + 1); // Assuming 1-based index matching
              return (
                <button
                  key={index}
                  onClick={() => {
                    setQuestionNumber(index);
                    setShowQuestionMenu(false);
                  }}
                  className={`
                    h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all
                    ${isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : `${darkMode ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          {/* Quick Stats Block */}
          <div className={`mt-4 pt-4 border-t ${borderColor} grid grid-cols-2 gap-4`}>
             <div className="text-center">
               <div className={`text-xs ${textTertiary}`}>Points</div>
               <div className={`font-bold ${textPrimary}`}>{problem.points}</div>
             </div>
             <div className="text-center">
               <div className={`text-xs ${textTertiary}`}>Acceptance</div>
               <div className={`font-bold ${textPrimary}`}>{problem.acceptanceRate}%</div>
             </div>
          </div>
        </div>
      )}

      {/* ===== MAIN TABS ===== */}
      <div className={`flex border-b ${borderColor} shrink-0 bg-opacity-50 ${bgPrimary}`}>
        <button
          onClick={() => setMobileActiveTab("problem")}
          className={`flex-1 py-2.5 text-center font-medium text-sm transition-colors ${
            mobileActiveTab === "problem" 
              ? `${activeBg} ${textPrimary} border-b-2 border-blue-500` 
              : `${textTertiary} ${hoverBg}`
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Problem
          </div>
        </button>
        <button
          onClick={() => setMobileActiveTab("editor")}
          className={`flex-1 py-2.5 text-center font-medium text-sm transition-colors ${
            mobileActiveTab === "editor" 
              ? `${activeBg} ${textPrimary} border-b-2 border-blue-500` 
              : `${textTertiary} ${hoverBg}`
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Code className="w-4 h-4" />
            Editor
          </div>
        </button>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* --- PROBLEM TAB --- */}
        {mobileActiveTab === "problem" && (
          <div className={`h-full overflow-y-auto p-4 ${scrollbarStyles} pb-20`}>
            {/* Header Section */}
            <div className="mb-6">
              <h1 className={`text-xl font-bold ${textPrimary} mb-2`}>
                {problem.question_number}. {problem.title}
              </h1>
              <p className={`${textSecondary} text-sm leading-relaxed whitespace-pre-wrap`}>
                {problem.description}
              </p>
            </div>

            {/* Examples */}
            {problem.examples?.map((ex, idx) => (
              <div key={idx} className={`border ${borderColor} rounded-lg overflow-hidden mb-4 ${darkMode ? "bg-zinc-800/20" : "bg-gray-50"}`}>
                <div className={`px-3 py-2 ${darkMode ? "bg-zinc-800/40" : "bg-gray-100"} border-b ${borderColor}`}>
                  <span className={`text-xs font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                    Example {idx + 1}
                  </span>
                </div>
                <div className="p-3 space-y-3">
                  <div>
                    <div className={`text-xs ${textTertiary} mb-1 uppercase font-bold`}>Input</div>
                    <pre className={`text-xs font-mono p-2 rounded ${darkMode ? "bg-zinc-900 text-zinc-300" : "bg-white text-gray-800"} overflow-x-auto border ${borderColor}`}>
                      {ex.input}
                    </pre>
                  </div>
                  <div>
                    <div className={`text-xs ${textTertiary} mb-1 uppercase font-bold`}>Output</div>
                    <pre className={`text-xs font-mono p-2 rounded ${darkMode ? "bg-zinc-900 text-zinc-300" : "bg-white text-gray-800"} overflow-x-auto border ${borderColor}`}>
                      {ex.output}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Tags (if any) */}
            {problem.tags && problem.tags.length > 0 && (
               <div className="mt-6">
                 <h3 className={`${textPrimary} font-bold text-sm mb-2 flex items-center gap-1.5`}>
                   <Tag className="w-3.5 h-3.5" /> Topics
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {problem.tags.map((tag, i) => (
                     <span key={i} className={`px-2 py-1 rounded text-xs font-medium ${darkMode ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"} border ${borderColor}`}>
                       {tag}
                     </span>
                   ))}
                 </div>
               </div>
            )}
          </div>
        )}

        {/* --- EDITOR TAB --- */}
        {mobileActiveTab === "editor" && (
          <div className={`h-full flex ${mobileView === "vertical" ? "flex-col" : "flex-row"}`}>
            
            {/* Editor Container */}
            <div className={`${mobileView === "vertical" ? "h-3/5" : "w-1/2"} flex flex-col border-r ${borderColor} min-h-0`}>
              
              {/* Toolbar */}
              <div className={`${bgSecondary} border-b ${borderColor} flex flex-col gap-2 p-2 shrink-0`}>
                <div className="flex items-center justify-between">
                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${darkMode ? "bg-zinc-800 hover:bg-zinc-700" : "bg-gray-100 hover:bg-gray-200"} border ${borderColor} text-xs font-medium ${textPrimary}`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      {selectedLanguage}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {showLanguageDropdown && (
                      <div className={`absolute top-full left-0 mt-1 w-36 ${bgSecondary} ${borderColor} border rounded-lg shadow-xl z-50 overflow-hidden`}>
                         {languageOptions.map((option) => (
                           <button 
                             key={option.value}
                             onClick={() => { 
                               setSelectedLanguage(option.value); 
                               setCode(problem?.starter_code?.[option.value] || "");
                               setShowLanguageDropdown(false); 
                             }}
                             className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                               selectedLanguage === option.value
                                 ? "bg-blue-500 text-white"
                                 : `${textSecondary} hover:bg-blue-500 hover:text-white`
                             }`}
                           >
                             {option.label}
                           </button>
                         ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Icons */}
                  <div className="flex items-center gap-1">
                     <button 
                       onClick={handleCopyCode}
                       className={`p-2 rounded transition-colors ${darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200"}`} 
                       title="Copy code"
                     >
                        <Copy className={`w-4 h-4 ${textTertiary}`} />
                     </button>
                  </div>
                </div>

                {/* Run / Submit Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleRun}
                    disabled={status === "running" || isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm
                      ${status === "running" || isSubmitting
                        ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" 
                        : `${darkMode ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700" : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"}`
                      }`}
                  >
                    {status === "running" ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <Play className="w-3 h-3" />}
                    Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={status === "running" || isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm text-white 
                      ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
                  >
                    {isSubmitting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Send className="w-3 h-3" />}
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>

              {/* Monaco Editor Wrapper */}
              <div className="flex-1 min-h-0 relative">
                 <Editor
                   height="100%"
                   language={MONACO_LANG_MAP[selectedLanguage] || "plaintext"}
                   value={code}
                   onChange={(value) => setCode(value || "")}
                   theme={darkMode ? "vs-dark" : "light"}
                   options={{
                     fontSize: 13,
                     minimap: { enabled: false },
                     lineNumbers: "on",
                     wordWrap: "on",
                     padding: { top: 12 },
                     fontFamily: "'JetBrains Mono', monospace",
                   }}
                 />
              </div>
            </div>

            {/* Test Cases / Results Split */}
            <div className={`${mobileView === "vertical" ? "h-2/5" : "w-1/2"} flex flex-col border-t ${borderColor}`}>
              {/* Tab Header */}
              <div className={`${bgSecondary} border-b ${borderColor} flex items-center shrink-0`}>
                <button
                  onClick={() => setActiveTab("testcases")}
                  className={`flex-1 px-3 py-2 text-xs font-medium relative transition-colors ${activeTab === "testcases" ? `${textPrimary} border-b-2 border-blue-500` : `${textTertiary}`}`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveTab("results")}
                  className={`flex-1 px-3 py-2 text-xs font-medium relative transition-colors ${activeTab === "results" ? `${textPrimary} border-b-2 border-blue-500` : `${textTertiary}`}`}
                >
                  Results
                </button>
              </div>

              {/* Panel Content */}
              <div className={`flex-1 overflow-auto p-3 ${bgPrimary}`}>
                {activeTab === "testcases" ? (
                  <div className="space-y-3">
                     {/* Test Case Tabs */}
                     <div className="flex overflow-x-auto gap-2 pb-2">
                       {problem.examples?.map((_, index) => (
                         <button
                           key={index}
                           onClick={() => setActiveTestCase(index)}
                           className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                             activeTestCase === index 
                             ? "bg-blue-600 text-white" 
                             : `${darkMode ? "bg-zinc-800 text-zinc-400" : "bg-gray-200 text-gray-600"}`
                           }`}
                         >
                           Case {index + 1}
                         </button>
                       ))}
                     </div>
                     {/* Active Case Data */}
                     {problem.examples && problem.examples[activeTestCase] && (
                       <div className="space-y-3">
                         <div>
                           <div className={`text-xs ${textTertiary} mb-1`}>Input</div>
                           <pre className={`text-xs font-mono p-2 rounded ${darkMode ? "bg-zinc-900 text-zinc-300" : "bg-white text-gray-800"} border ${borderColor}`}>
                             {problem.examples[activeTestCase].input}
                           </pre>
                         </div>
                         <div>
                           <div className={`text-xs ${textTertiary} mb-1`}>Expected Output</div>
                           <pre className={`text-xs font-mono p-2 rounded ${darkMode ? "bg-zinc-900 text-zinc-300" : "bg-white text-gray-800"} border ${borderColor}`}>
                             {problem.examples[activeTestCase].output}
                           </pre>
                         </div>
                       </div>
                     )}
                  </div>
                ) : (
                  /* Results View */
                  <div>
                    {status === "running" || status === "submitting" || status === "submitted" || isSubmitting ? (
                      <div className="flex flex-col items-center justify-center h-full pt-8">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                        <p className={`text-xs ${textTertiary}`}>{isSubmitting ? "Submitting..." : "Running..."}</p>
                      </div>
                    ) : submitResult ? (
                      /* Submission Results */
                      <div className="space-y-3">
                        <div className={`flex items-center gap-2 text-sm font-bold ${submitResult.success ? "text-emerald-500" : "text-rose-500"}`}>
                          {submitResult.success ? <CheckCircle className="w-4 h-4"/> : <X className="w-4 h-4"/>}
                          {submitResult.success ? "Accepted" : "Failed"}
                        </div>
                        {submitResult.passed !== undefined && (
                          <div className={`text-xs ${textSecondary}`}>
                            Passed: {submitResult.passed}/{submitResult.total} test cases
                          </div>
                        )}
                        <pre className={`text-xs font-mono p-3 rounded border ${
                          submitResult.success 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        } whitespace-pre-wrap`}>
                          {submitResult.message}
                        </pre>
                        {submitResult.execution_time && (
                          <div className={`text-xs ${textTertiary}`}>
                            Execution time: {(submitResult.execution_time * 1000).toFixed(2)}ms
                          </div>
                        )}
                      </div>
                    ) : !output && !error ? (
                      <div className="flex flex-col items-center justify-center h-full pt-8 opacity-50">
                        <Play className={`w-8 h-8 mb-2 ${textTertiary}`} />
                        <p className={`text-xs ${textTertiary}`}>Run code to see results</p>
                      </div>
                    ) : (
                      /* Run Results */
                      <div className="space-y-3">
                        <div className={`flex items-center gap-2 text-sm font-bold ${error ? "text-rose-500" : "text-emerald-500"}`}>
                          {error ? <X className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                          {error ? "Error" : "Success"}
                        </div>
                        <pre className={`text-xs font-mono p-3 rounded border ${
                          error 
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        } whitespace-pre-wrap`}>
                          {error || output || "No output"}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const DesktopViewComponent = () => {
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
          <div className="absolute right-0 flex items-center gap-3 pr-2">
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
        <div
          ref={containerRef}
          className="flex flex-col md:flex-row flex-1 overflow-hidden relative"
        >
          {/* ===== LEFT PANEL ===== */}
          <div
            style={{ "--left-width": `${leftWidth}%` }}
            className={`overflow-y-auto ${bgSecondary} p-6 ${scrollbarStyles} w-full md:w-[var(--left-width)] h-[45%] md:h-full`}
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
                    
                  </div>
                </div>
              )}
            </>
          </div>

          {/* ===== RESIZER HANDLE ===== */}
          <div
            onMouseDown={() => setIsResizing(true)}
            className={`w-1 cursor-col-resize hidden md:block ${
              darkMode
                ? "bg-zinc-800 hover:bg-blue-500"
                : "bg-gray-300 hover:bg-blue-400"
            } transition-colors`}
          />

          {/* ===== RIGHT PANEL - EDITOR ===== */}
          <div
            style={{ "--right-width": `${100 - leftWidth}%` }}
            className={`flex flex-col ${bgPrimary} w-full md:w-[var(--right-width)] h-[55%] md:h-full`}
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
                                  problem?.starter_code?.[option.value] || "",
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
                    disabled={status === "running" || isSubmitting}
                    className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      status === "running" || isSubmitting
                        ? "bg-zinc-600 cursor-not-allowed"
                        : darkMode
                          ? "bg-zinc-800 hover:bg-zinc-700"
                          : "bg-gray-200 hover:bg-gray-300"
                    } ${textSecondary}`}
                  >
                    {status === "running" ? (
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
                    disabled={status === "running" || isSubmitting}
                    className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      submitResult?.success
                        ? darkMode
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-emerald-500 hover:bg-emerald-600"
                        : isSubmitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : darkMode
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : submitResult?.success ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Accepted
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
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
                        {(output || error || submitResult) && (
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                (error || (submitResult && !submitResult.success))
                                  ? "bg-rose-500"
                                  : "bg-emerald-500"
                              }`}
                            ></div>
                            <span
                              className={`text-xs ${
                                (error || (submitResult && !submitResult.success))
                                  ? "text-rose-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {submitResult 
                                ? (submitResult.success ? "Accepted" : "Failed")
                                : (error ? "Failed" : "Success")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Loading State */}
                      {(status === "running" || status === "submitting" || status === "submitted" || isSubmitting) ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                          <p className={`text-sm ${textTertiary}`}>{isSubmitting ? "Submitting..." : "Running..."}</p>
                        </div>
                      ) : submitResult ? (
                        /* Submission Results */
                        <div className="space-y-4">
                          <div
                            className={`${
                              darkMode ? "bg-zinc-900/50" : "bg-gray-100"
                            } rounded-lg p-4 border ${submitResult.success ? "border-emerald-500/30" : "border-rose-500/30"}`}
                          >
                            <div className={`flex items-center gap-2 mb-2 font-bold ${
                              submitResult.success ? "text-emerald-500" : "text-rose-500"
                            }`}>
                              {submitResult.success ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                              {submitResult.success ? "Accepted" : "Wrong Answer"}
                            </div>
                            {submitResult.passed !== undefined && (
                              <p className={`text-sm ${textSecondary} mb-2`}>
                                Test Cases: {submitResult.passed}/{submitResult.total} passed
                              </p>
                            )}
                            <pre className={`text-xs font-mono whitespace-pre-wrap ${
                              submitResult.success ? "text-emerald-400" : "text-rose-400"
                            }`}>
                              {submitResult.message}
                            </pre>
                          </div>
                          {submitResult.execution_time && (
                            <div className={`text-xs ${textTertiary}`}>
                              Execution time: {(submitResult.execution_time * 1000).toFixed(2)}ms
                            </div>
                          )}
                        </div>
                      ) : (output || error) ? (
                        /* Run Results */
                        <div>
                          <div
                            className={`${
                              darkMode ? "bg-zinc-900/50" : "bg-gray-100"
                            } rounded p-3 border ${borderColor}`}
                          >
                            <pre
                              className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                                error
                                  ? "text-rose-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {error || output}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-12 opacity-50">
                          <Play className={`w-10 h-10 mb-3 ${textTertiary}`} />
                          <p className={`text-sm ${textTertiary}`}>Run your code to see results</p>
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

  return isMobile ? <MobileViewComponent /> : <DesktopViewComponent />;
};

export default ContestQuestion;


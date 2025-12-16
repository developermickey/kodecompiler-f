import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Settings, History, Maximize2, Moon, Sun, Type, X, Loader } from "lucide-react";
import Editor from "@monaco-editor/react";
import NotFound from "../NotFound";


const Problem = () =>
{
  // Mock problemid for demo - replace with useParams() in your actual code
  const {problemId} = useParams();

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [openHintIndex, setOpenHintIndex] = useState(null);
  
  
  
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [testCaseHeight, setTestCaseHeight] = useState(280);
  const [isResizingTestCase, setIsResizingTestCase] = useState(false);

  const MONACO_LANG_MAP =
    {
    python: "python",
    javascript: "javascript",
    java: "java",
    cpp: "cpp",
    c:"c",
    go:"go",
    rust:"rust",
    php:"php",
    ruby:"ruby",
    bash:"bash"
    };


  
  const containerRef = useRef(null);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        const res = await fetch(
          `http://localhost:5000/api/problems/${problemId}`, { credentials: "include" }
        );
        const data = await res.json();

        const acceptanceRate =
          data.total_submissions > 0
            ? (
                (data.accepted_submissions / data.total_submissions) *
                100
              ).toFixed(2)
            : "0.00";

        const formattedProblem =
        {
          title: data.title,
          difficulty: data.difficulty,
          description: data.description,

          examples: data.examples || [],
          constraints: data.constraints || [],
          hints: data.hints || [],
          tags: data.tags || [],

          starter_code: data.starter_code || {},
          companies: data.companies || [],

          testCases: (data.test_cases || []).filter(tc => !tc.hidden),

          points: data.points,
          acceptanceRate
        };

        setProblem(formattedProblem);
        const languages = Object.keys(formattedProblem.starter_code || {});
        const defaultLanguage = languages[0] || "";

        setSelectedLanguage(defaultLanguage);
        setCode(formattedProblem.starter_code?.[defaultLanguage] || "");
      }
      catch (err)
      {
        console.error("Error fetching problem:", err);
      }
    };

    fetchData();
  }, [problemId]);

  // Resizing logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      if (newLeftWidth > 20 && newLeftWidth < 80) {
        setLeftWidth(newLeftWidth);
      }
    };


    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

    useEffect(() =>
    {
        const handleMouseMove = (e) =>
        {
            if (!isResizingTestCase) return;

            setTestCaseHeight(prev =>
            {
            const newHeight = prev - e.movementY;
            if (newHeight < 50) return 180;
            if (newHeight > 600) return 600;
            return newHeight;
            });
        };

        const handleMouseUp = () =>
        {
            setIsResizingTestCase(false);
        };

        if (isResizingTestCase)
        {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () =>
        {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizingTestCase]);

  const handleLanguageChange = (lang) =>
  {
    setSelectedLanguage(lang);
    setCode(problem?.starter_code?.[lang] || "");
  };

  const handleRun = () =>
  {
    setIsRunning(true);
    setOutput("");

    setTimeout(() =>
    {
      setOutput("All visible test cases passed ✅");
      setIsRunning(false);
    }, 1200);
  };

  if (!problem)
  {
   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading problems...</p>
        </div>
      </div>
    );
  }
   if(problem.title == null)
    return (<NotFound/>);

  

  const difficultyColors = {
    Easy: darkMode ? "text-emerald-400" : "text-emerald-600",
    Medium: darkMode ? "text-amber-400" : "text-amber-600",
    Hard: darkMode ? "text-rose-400" : "text-rose-600"
  };

  // Theme classes
  const bgPrimary = darkMode ? 'bg-gray-950' : 'bg-white';
  const bgSecondary = darkMode ? 'bg-gray-900' : 'bg-gray-100';
  const bgTertiary = darkMode ? 'bg-gray-800' : 'bg-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-700';
  const textTertiary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-800' : 'border-gray-300';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200';
  const editorBg = darkMode ? 'bg-gray-950' : 'bg-white';
  const editorText = darkMode ? 'text-gray-100' : 'text-gray-900';

 

  return (
    <div className={`h-screen flex flex-col ${bgPrimary}`}>

      {/* ===== TOP BAR ===== */}
      <div className={`${bgSecondary} border-b ${borderColor} px-6 py-3.5 flex justify-between items-center shadow-sm`}>
        <div className={`${textPrimary} font-semibold text-lg tracking-tight`}>
          Problem Workspace
        </div>

        <div className="flex gap-4 relative">
          <History className={`w-5 h-5 ${textTertiary} hover:${textPrimary} cursor-pointer transition-colors`} />
          
          <div className="relative">
            <Settings 
              onClick={() => setShowSettings(!showSettings)}
              className={`w-5 h-5 ${textTertiary} ${showSettings ? textPrimary : ''} cursor-pointer transition-colors`} 
            />
            
            {/* Settings Dropdown */}
            {showSettings && (
              <div className={`absolute right-0 mt-2 w-64 ${bgSecondary} ${borderColor} border rounded-lg shadow-xl z-50 p-4`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`${textPrimary} font-semibold`}>Settings</h3>
                  <X 
                    onClick={() => setShowSettings(false)}
                    className={`w-4 h-4 ${textTertiary} cursor-pointer ${hoverBg} rounded`}
                  />

                </div>
                
                {/* Dark Mode Toggle */}
                <div className="mb-4">
                  <label className={`${textSecondary} text-sm font-medium mb-2 block`}>
                    Theme
                  </label>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-full flex items-center justify-between ${bgTertiary} ${hoverBg} px-3 py-2 rounded-md transition-colors`}
                  >
                    <span className={`${textPrimary} text-sm flex items-center gap-2`}>
                      {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      {darkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <div className={`w-10 h-5 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-400'} relative`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                    </div>
                  </button>
                </div>
                
                {/* Font Size */}
                <div>
                  <label className={`${textSecondary} text-sm font-medium mb-2 flex items-center gap-2`}>
                    <Type className="w-4 h-4" />
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className={`flex justify-between text-xs ${textTertiary} mt-1`}>
                    <span>10px</span>
                    <span>24px</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Maximize2 className={`w-5 h-5 ${textTertiary} hover:${textPrimary} cursor-pointer transition-colors`} />
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">

        {/* ===== LEFT PANEL ===== */}
        <div 
          style={{ width: `${leftWidth}%` }}
          className={`overflow-y-auto border-r ${borderColor} p-8 ${bgPrimary}`}
        >

          {/* Title */}
          <h1 className={`text-3xl font-bold text-[#0652e9] mb-3 tracking-tight`}>
            {problem.title}
          </h1>

          {/* Meta */}
          <div className={`flex gap-5 text-sm mb-6 pb-6 border-b ${borderColor}`}>
            <span className={`font-semibold ${difficultyColors[problem.difficulty] || textTertiary}`}>
              {problem.difficulty}
            </span>
            <span className={`${textTertiary} font-medium`}>
              Acceptance: <span className={textSecondary}>{problem.acceptanceRate}%</span>
            </span>
            <span className={`${textTertiary} font-medium`}>
              Points: <span className={textSecondary}>{problem.points}</span>
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className={`${textSecondary} leading-relaxed text-[15px]`}>
              {problem.description}
            </p>
          </div>

          {/* Companies */}
          {problem.companies.length > 0 && (
            <div className="mb-8">
              <h3 className={`${textTertiary} text-xs font-semibold uppercase tracking-wider mb-3`}>
                Companies
              </h3>
              <div className="flex gap-2 flex-wrap">
                {problem.companies.map((c, i) => (
                  <span
                    key={i}
                    className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-200 border-gray-300'} border px-3 py-1.5 rounded-md text-sm ${textSecondary} font-medium ${hoverBg} transition-colors`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ===== TOPICS ===== */}
          {problem.tags.length > 0 && (
            <div className="mb-8">
              <h3 className={`${textTertiary} text-xs font-semibold uppercase tracking-wider mb-3`}>
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`${darkMode ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400' : 'bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-700'} border px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors`}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ===== EXAMPLES ===== */}
          <div className="mb-8">
            <h2 className={`${textPrimary} font-bold text-lg mb-4`}>Examples</h2>

            {problem.examples.map((ex, idx) => (
              <div
                key={idx}
                className={`mb-5 ${darkMode ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-300 hover:border-gray-400'} border rounded-lg p-5 transition-colors`}
              >
                <h3 className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold mb-3 text-sm`}>
                  Example {idx + 1}
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className={`${textTertiary} text-xs font-semibold uppercase tracking-wider mb-1.5`}>Input</p>
                    <pre className={`${darkMode ? 'text-gray-200 bg-gray-950 border-gray-800' : 'text-gray-800 bg-white border-gray-300'} text-sm p-3 rounded border font-mono`}>{ex.input}</pre>
                  </div>
                  <div>
                    <p className={`${textTertiary} text-xs font-semibold uppercase tracking-wider mb-1.5`}>Output</p>
                    <pre className={`${darkMode ? 'text-gray-200 bg-gray-950 border-gray-800' : 'text-gray-800 bg-white border-gray-300'} text-sm p-3 rounded border font-mono`}>{ex.output}</pre>
                  </div>
                </div>

                {ex.explanation && (
                  <div className={`mt-3 pt-3 border-t ${borderColor}`}>
                    <p className={`${textSecondary} text-sm leading-relaxed`}>
                      <span className={`${textTertiary} font-semibold`}>Explanation: </span>
                      {ex.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="mb-8">
            <h2 className={`${textPrimary} font-bold text-lg mb-3`}>Constraints</h2>
            <div className="space-y-2">
              {problem.constraints.map((c, i) => (
                <p key={i} className={`${textSecondary} text-sm flex items-start`}>
                  <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3 mt-0.5`}>•</span>
                  <span>{c}</span>
                </p>
              ))}
            </div>
          </div>

          {/* ===== MULTI DROPDOWN HINTS ===== */}
          {problem.hints.length > 0 && (
            <div className="mb-8">
              <h2 className={`${textPrimary} font-bold text-lg mb-4`}>Hints</h2>

              {problem.hints.map((hint, index) => (
                <div
                  key={index}
                  className={`mb-3 border ${borderColor} rounded-lg ${darkMode ? 'bg-gray-900/30 hover:border-gray-700' : 'bg-gray-50 hover:border-gray-400'} overflow-hidden transition-colors`}
                >
                  <button
                    onClick={() =>
                      setOpenHintIndex(
                        openHintIndex === index ? null : index
                      )
                    }
                    className={`w-full flex justify-between items-center px-5 py-3.5 ${textPrimary} ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${darkMode ? 'text-amber-400' : 'text-amber-600'} text-lg`}>💡</span>
                      <span className="font-medium text-sm">Hint {index + 1}</span>
                    </div>
                    <span className={`${textTertiary} text-sm`}>
                      {openHintIndex === index ? "▲" : "▼"}
                    </span>
                  </button>

                  {openHintIndex === index && (
                    <div className={`px-5 py-4 ${textSecondary} text-sm leading-relaxed border-t ${borderColor} ${darkMode ? 'bg-gray-900/20' : 'bg-white'}`}>
                      {hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== RESIZER ===== */}
        <div
          onMouseDown={() => setIsResizing(true)}
          className={`w-1 ${darkMode ? 'bg-gray-800 hover:bg-blue-500' : 'bg-gray-300 hover:bg-blue-400'} cursor-col-resize transition-colors`}
        />

        {/* ===== RIGHT PANEL ===== */}
        <div 
          style={{ width: `${100 - leftWidth}%` }}
          className={`flex flex-col ${bgSecondary}`}
        >

          {/* Language Selector */}
          <div
            className={`${bgSecondary} border-b ${borderColor} px-4 py-3 flex items-center justify-between`}
            >
            {/* LEFT: Language Selector */}
            <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`${bgTertiary} ${textPrimary} px-4 py-2 rounded-md border ${borderColor} font-medium text-sm cursor-pointer ${hoverBg} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            >
                {Object.keys(problem.starter_code).map((lang) => (
                <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                </option>
                ))}
            </select>

            {/* RIGHT: Action Buttons */}
            <div className="flex items-center gap-3">
                <button
                onClick={handleRun}
                disabled={isRunning}
                className={`${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} disabled:opacity-50 px-6 py-2.5 rounded-lg ${textPrimary} font-semibold text-sm transition-colors shadow-sm`}
                >
                {isRunning ? "Running..." : "Run"}
                </button>

                <button
                className={`bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition-colors shadow-sm ${
                    darkMode ? "shadow-blue-500/20" : ""
                }`}
                >
                Submit
                </button>
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
                tabSize: 4
                }}
            />
            </div>



          {/* Output */}
          {output && (
            <div className={`${bgSecondary} border-t ${borderColor} p-5 max-h-48 overflow-y-auto`}>
              <h3 className={`${textTertiary} text-xs font-semibold uppercase tracking-wider mb-2`}>Output</h3>
              <pre className={`${textSecondary} text-sm font-mono leading-relaxed`}>{output}</pre>
            </div>
          )}

          {/* ===== TEST CASES ===== */}
         
            {problem.testCases && problem.testCases.length > 0 && (
            <div
                className={`mb-8 border ${borderColor} rounded-lg overflow-hidden`}
                style={{ height: testCaseHeight }}
            >
                {/* Resize Handle */}
                <div
                onMouseDown={() => setIsResizingTestCase(true)}
                className={`h-2 cursor-row-resize ${
                    darkMode ? "bg-gray-800 hover:bg-blue-500" : "bg-gray-300 hover:bg-blue-400"
                } transition-colors`}
                />

                {/* Content */}
                <div className="h-full overflow-y-auto p-4">
                <h2 className={`${textPrimary} font-bold text-lg mb-4`}>
                    Test Cases
                </h2>

                <div className="space-y-4">
                    {problem.testCases.map((tc, index) => (
                    <div
                        key={index}
                        className={`border ${borderColor} rounded-lg p-4 ${
                        darkMode
                            ? "bg-gray-900/40 hover:border-gray-700"
                            : "bg-gray-50 hover:border-gray-400"
                        } transition-colors`}
                    >
                        <p className={`text-[#0652e9] text-xs font-semibold uppercase tracking-wider mb-2`}>
                        Test Case {index + 1}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className={`${textTertiary} text-xs mb-1`}>Input</p>
                            <pre
                            className={`text-sm font-mono p-3 rounded border ${
                                darkMode
                                ? "bg-gray-950 text-gray-200 border-gray-800"
                                : "bg-white text-gray-800 border-gray-300"
                            }`}
                            >
                            {tc.input}
                            </pre>
                        </div>

                        <div>
                            <p className={`${textTertiary} text-xs mb-1`}>Expected Output</p>
                            <pre
                            className={`text-sm font-mono p-3 rounded border ${
                                darkMode
                                ? "bg-gray-950 text-gray-200 border-gray-800"
                                : "bg-white text-gray-800 border-gray-300"
                            }`}
                            >
                            {tc.expected}
                            </pre>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Problem;
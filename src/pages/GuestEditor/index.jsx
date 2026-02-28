import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import {
  Play,
  Code2,
  Terminal,
  Settings,
  Sparkles,
  GripVertical,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Cpu
} from "lucide-react";
// IMPORTANT: Update this import path to point to your actual code slice file
import {
  runCode,
  getResult,
  resetCodeState,
} from "../../redux/slices/codeSlice";

const GuestEditor = () => {
  const dispatch = useDispatch();

  // Local state for the editor inputs
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState('print("Hello, World!")');
  const [input, setInput] = useState("");

  // UI layout states
  const [editorWidth, setEditorWidth] = useState(60);
  const [outputHeight, setOutputHeight] = useState(60);

  // Redux state
  const {
    jobId,
    status,
    output: reduxOutput,
    isRunning,
    error,
  } = useSelector((state) => state.code);

  const horizontalResizerRef = useRef(null);
  const verticalResizerRef = useRef(null);
  const containerRef = useRef(null);

  const languages = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "shell", label: "Bash" }, // Monaco prefers 'shell' for bash
  ];

  const templates = {
    python: 'print("Hello, World!")',
    javascript: 'console.log("Hello, World!");',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    go: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    rust: 'fn main() {\n    println!("Hello, World!");\n}',
    php: '<?php\necho "Hello, World!\\n";\n?>',
    ruby: 'puts "Hello, World!"',
    shell: '#!/bin/bash\necho "Hello, World!"',
  };

  // --- Reset Redux State on Mount/Unmount ---
  useEffect(() => {
    dispatch(resetCodeState());
    return () => dispatch(resetCodeState());
  }, [dispatch]);

  // --- Polling Logic for Code Execution ---
  useEffect(() => {
    let pollInterval;

    if (jobId && (status === "submitted" || status === "running")) {
      pollInterval = setInterval(() => {
        dispatch(getResult(jobId));
      }, 1500); // Poll every 1.5 seconds
    }

    // Stop polling once finished
    if (status === "completed" || status === "failed") {
      clearInterval(pollInterval);
    }

    return () => clearInterval(pollInterval);
  }, [jobId, status, dispatch]);

  // --- Layout Resizers ---
  useEffect(() => {
    const resizer = horizontalResizerRef.current;
    const container = containerRef.current;
    if (!resizer || !container) return;

    let isResizing = false;

    const handleMouseDown = () => {
      isResizing = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const containerRect = container.getBoundingClientRect();
      const newWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth > 20 && newWidth < 80) setEditorWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    resizer.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      resizer.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const resizer = verticalResizerRef.current;
    if (!resizer) return;

    let isResizing = false;
    let startY = 0;
    let startHeight = outputHeight;

    const handleMouseDown = (e) => {
      isResizing = true;
      startY = e.clientY;
      startHeight = outputHeight;
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const rightPanel = resizer.parentElement;
      const panelHeight = rightPanel.getBoundingClientRect().height;
      const deltaY = e.clientY - startY;
      const deltaPercent = (deltaY / panelHeight) * 100;
      const newHeight = startHeight + deltaPercent;

      if (newHeight > 20 && newHeight < 80) setOutputHeight(newHeight);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    resizer.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      resizer.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [outputHeight]);

  // --- Handlers ---
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(templates[newLang] || "");
    dispatch(resetCodeState());
  };

  const handleRunCode = () => {
    dispatch(resetCodeState());
    dispatch(runCode({ language: language === 'shell' ? 'bash' : language, code, input }));
  };

  // --- Render Helpers ---
  const renderOutput = () => {
    if (status === "submitting") return (
      <div className="flex items-center space-x-2 text-indigo-600">
        <Send className="w-4 h-4 animate-pulse" />
        <span>Submitting to server...</span>
      </div>
    );
    if (status === "submitted") return (
      <div className="flex items-center space-x-2 text-amber-600">
        <Clock className="w-4 h-4 animate-pulse" />
        <span>Job created. Waiting in queue...</span>
      </div>
    );
    if (status === "running") return (
      <div className="flex items-center space-x-2 text-blue-600">
        <Cpu className="w-4 h-4 animate-pulse" />
        <span>Executing code...</span>
      </div>
    );

    if (status === "failed") return (
      <div className="flex flex-col space-y-2 text-red-600">
        <div className="flex items-center space-x-2 font-medium">
          <XCircle className="w-4 h-4" />
          <span>Request Failed</span>
        </div>
        <span className="text-red-500/80">{error?.message || error || "Execution failed."}</span>
      </div>
    );

    if (status === "completed") {
      if (error) {
        return (
           <div className="flex flex-col space-y-2 text-red-600">
            <div className="flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Execution Error</span>
            </div>
            <span className="text-red-500/90 whitespace-pre-wrap">{error}</span>
          </div>
        );
      }
      return reduxOutput ? (
        <span className="text-slate-700">{reduxOutput}</span>
      ) : (
        <div className="flex items-center space-x-2 text-emerald-600">
          <CheckCircle2 className="w-4 h-4" />
          <span>Execution completed (No output returned).</span>
        </div>
      );
    }

    return <span className="text-slate-400 italic">Output will appear here...</span>;
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-slate-900">
      {/* Header Toolbar */}
      <header className="bg-white border-b border-zinc-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Branding & Warning */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-700 font-semibold text-xs tracking-wide">
                  GUEST MODE
                </span>
              </div>
              <div className="hidden md:flex items-center text-slate-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1.5 text-amber-500" />
                <span>Code won't be saved.</span>
                <a
                  href="/register"
                  className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline ml-1.5 transition-colors"
                >
                  Sign up to save
                </a>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center space-x-3">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`px-5 py-2 rounded-lg text-sm font-semibold text-white flex items-center space-x-2 transition-all shadow-sm ${
                  isRunning
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0"
                }`}
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" fill="currentColor" />
                )}
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-2 sm:p-4 gap-2 sm:gap-4 overflow-y-auto lg:overflow-hidden h-[calc(100vh-64px)]"
      >
        {/* === Left Panel: Code Editor === */}
        <section
          className="flex flex-col bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden min-h-[50vh] lg:min-h-0 w-full lg:w-[var(--editor-width)] transition-shadow ring-1 ring-transparent focus-within:ring-indigo-500/20 focus-within:border-indigo-300"
          style={{ "--editor-width": `${editorWidth}%` }}
        >
          <header className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
              Editor
            </h2>
          </header>
          <div className="flex-1 relative pt-2">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />
          </div>
        </section>

        {/* === Horizontal Drag Resizer === */}
        <div
          ref={horizontalResizerRef}
          className="hidden lg:flex w-2 items-center justify-center cursor-col-resize group mx-[-8px] z-10"
        >
          <div className="h-12 w-1 bg-zinc-300 rounded-full group-hover:bg-indigo-500 group-hover:w-1.5 transition-all duration-200 flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
          </div>
        </div>

        {/* === Right Panel: Output & Input === */}
        <section
          className="flex flex-col w-full lg:w-[var(--right-width)] gap-2 sm:gap-4"
          style={{ "--right-width": `${100 - editorWidth}%` }}
        >
          {/* Output Panel */}
          <div
            className="flex flex-col bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden min-h-[30vh] lg:min-h-0 h-auto lg:h-[var(--output-height)] transition-shadow ring-1 ring-transparent focus-within:ring-indigo-500/20 focus-within:border-indigo-300"
            style={{ "--output-height": `${outputHeight}%` }}
          >
            <header className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
                Output
              </h2>
              {(status === "running" || status === "submitted") && (
                <div className="ml-auto flex items-center space-x-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Polling
                  </span>
                </div>
              )}
            </header>
            <div className="flex-1 p-4 overflow-auto bg-[#fafafa]">
              <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                {renderOutput()}
              </pre>
            </div>
          </div>

          {/* Vertical Drag Resizer === */}
          <div
            ref={verticalResizerRef}
            className="hidden lg:flex h-2 items-center justify-center cursor-row-resize group my-[-8px] z-10"
          >
            <div className="w-12 h-1 bg-zinc-300 rounded-full group-hover:bg-indigo-500 group-hover:h-1.5 transition-all duration-200 flex items-center justify-center">
              <GripVertical className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 rotate-90" />
            </div>
          </div>

          {/* Input Panel */}
          <div
            className="flex flex-col bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden min-h-[20vh] lg:min-h-0 h-auto lg:h-[var(--input-height)] transition-shadow ring-1 ring-transparent focus-within:ring-indigo-500/20 focus-within:border-indigo-300"
            style={{ "--input-height": `${100 - outputHeight}%` }}
          >
            <header className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-slate-500" />
              <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
                Standard Input
              </h2>
            </header>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter standard input here (e.g., inputs for Scanner or input() calls)..."
                className="absolute inset-0 w-full h-full p-4 font-mono text-[13px] bg-white text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GuestEditor;
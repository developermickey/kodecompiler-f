import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FolderOpen,
  Save,
  Play,
  ChevronDown,
  ArrowLeftRight,
  X,
  Check,
  FileCode,
  Loader2,
  RefreshCw,
  Terminal,
  FileCode2,
} from "lucide-react";
import {
  runCode,
  getResult,
  getUserCodes,
  saveCode,
  createCode,
} from "../../redux/slices/codeSlice";
import axios from "axios";

const MainCompilerLight = () => {
  const dispatch = useDispatch();

  // --- Redux State ---
  const { output, status, error, jobId, userCodes } = useSelector(
    (store) => store?.code
  );

  // --- Layout State ---
  const [leftWidth, setLeftWidth] = useState(60);
  const [ioHeight, setIoHeight] = useState(40);
  const [isDraggingVert, setIsDraggingVert] = useState(false);
  const [isDraggingHorz, setIsDraggingHorz] = useState(false);

  // --- Functional State ---
  const [language, setLanguage] = useState("python");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isFilePanelOpen, setIsFilePanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Files");
  const [notification, setNotification] = useState(null);

  // --- Content State ---
  const [code, setCode] = useState('print("Hello, World!")');
  const [input, setInput] = useState("");
  const [codeName, setCodeName] = useState("Untitled Project");
  const [activeCodeId, setActiveCodeId] = useState(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false); // NEW: To toggle input

  // --- Refs ---
  const lineNumbersRef = useRef(null);
  const containerRef = useRef(null);
  const langMenuRef = useRef(null);
  const textareaRef = useRef(null);
  const titleInputRef = useRef(null); // NEW: Focus input on click

  // --- Close Dropdowns on Click Outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      // Save name on click outside
      if (
        isEditingName &&
        titleInputRef.current &&
        !titleInputRef.current.contains(event.target)
      ) {
        setIsEditingName(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingName]);

  // --- Smart Keyboard Handler ---
  const handleKeyDown = (e) => {
    const { selectionStart, selectionEnd, value } = e.target;
    if (e.key === "Tab") {
      e.preventDefault();
      const newValue =
        value.substring(0, selectionStart) +
        "    " +
        value.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
      }, 0);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const currentLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const currentLine = value.substring(currentLineStart, selectionStart);
      const indentation = currentLine.match(/^\s*/)[0];
      const newValue =
        value.substring(0, selectionStart) +
        "\n" +
        indentation +
        value.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd =
          selectionStart + indentation.length + 1;
      }, 0);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRun = () => {
    if (status === "running") return;
    setActiveTab("Output");
    dispatch(runCode({ language, code, input }));
  };

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

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const toggleFilePanel = (tabName) => {
    console.log(userCodes)
    if (isFilePanelOpen && activeTab === tabName) {
      setIsFilePanelOpen(false);
    } else {
      setIsFilePanelOpen(true);
      setActiveTab(tabName);
      if (
        tabName === "My Codes" &&
        (!userCodes?.codes || userCodes.codes.length === 0)
      ) {
        dispatch(getUserCodes());
      }
    }
  };

  // --- NEW: Helper to map extensions to languages ---
  const detectLanguageFromExtension = (filename) => {
    if (!filename) return null;
    const ext = filename.split(".").pop().toLowerCase();

    const extensionMap = {
      py: "python",
      js: "javascript",
      jsx: "javascript",
      ts: "javascript",
      java: "java",
      cpp: "c++",
      c: "c++",
      cc: "c++",
    };

    return extensionMap[ext] || null;
  };

  const handleCodeClick = async (code_id) => {
    if (isCodeLoading) return;
    setIsCodeLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/codes/${code_id}`,
        { withCredentials: true }
      );

      const fetchedTitle = res.data.title || "Untitled";

      setCodeName(fetchedTitle);
      setCode(res.data.code);
      setActiveCodeId(code_id);

      // --- NEW: Auto-detect language based on title extension ---
      const detectedLang = detectLanguageFromExtension(fetchedTitle);
      if (detectedLang) {
        setLanguage(detectedLang);
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to load code.");
    } finally {
      setIsCodeLoading(false);
    }
  };

  // --- Resizing Logic ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (isDraggingVert) {
        let w = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftWidth(Math.max(20, Math.min(w, 80)));
      }
      if (isDraggingHorz) {
        const outputHeight = 100 - ((e.clientY - rect.top) / rect.height) * 100;
        setIoHeight(Math.max(10, Math.min(outputHeight, 80)));
      }
    };
    const handleMouseUp = () => {
      setIsDraggingVert(false);
      setIsDraggingHorz(false);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
    if (isDraggingVert || isDraggingHorz) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = isDraggingVert ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingVert, isDraggingHorz]);

  const lines = code.split("\n").length;
  const lineNumbers = Array.from(
    { length: Math.max(lines, 20) },
    (_, i) => i + 1
  );

  /* ===================== CORRECT SAVE HANDLER ===================== */
  const handleSave = () => {
    if (!activeCodeId) {
      showNotification("Please select or create a file first.");
      return;
    }

    // Construct the FULL payload based on your API schema
    const payload = {
      title: codeName,
      language: language,
      code: code,
      description: "", // Add if you have a field for this
      input: input,
      lastOutput: output || "",
      folderPath: "/", // Default or from state
    };

    dispatch(saveCode({ code_id: activeCodeId, payload }))
      .unwrap() // Allows us to catch errors/success directly here
      .then(() => {
        showNotification("File saved successfully.");
      })
      .catch((err) => {
        console.error("Save failed:", err);
        showNotification("Failed to save.");
      });
  };

  const handleCreateCode = () => {
    dispatch(
      createCode({
        title: codeName,
        language,
        code,
        description: "",
        input: input || "",
        folderPath: "",
      })
    );
  };

  /* ===================== RENDER ===================== */
  return (
    <div className="flex flex-col h-screen w-full bg-white text-gray-800 font-sans overflow-hidden">
      {notification && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={16} className="text-green-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      <header className="h-14 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4 z-30 select-none shrink-0">
        <div className="flex items-center space-x-2">
          <HeaderButton
            icon={<FolderOpen size={15} />}
            label="My Codes"
            active={isFilePanelOpen && activeTab === "My Codes"}
            onClick={() => toggleFilePanel("My Codes")}
          />
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* UPDATED SAVE BUTTON */}
          <HeaderButton
            icon={<Save size={15} />}
            label="Save"
            onClick={handleSave} // Calls the new logic
          />
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <HeaderButton
            icon={<Save size={15} />}
            label="Add"
            onClick={handleCreateCode}
          />

          <div className="hidden md:flex items-center ml-4 group relative">
            <span className="text-xs text-gray-400 mr-2 flex items-center gap-1">
              <FileCode2 size={12} /> Editing:
            </span>

            {/* --- NEW: Editable Title --- */}
            {isEditingName ? (
              <input
                ref={titleInputRef}
                type="text"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingName(false);
                }}
                autoFocus
                className="text-sm text-gray-700 font-semibold bg-white border border-blue-300 rounded px-1 py-0.5 outline-none focus:ring-2 focus:ring-blue-100 min-w-[150px]"
              />
            ) : (
              <span
                onClick={() => setIsEditingName(true)}
                className="text-sm text-gray-700 font-semibold truncate max-w-[200px] cursor-text hover:bg-gray-200 px-1 rounded transition-colors"
                title="Click to rename"
              >
                {codeName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 px-3 py-1.5 rounded text-xs border border-gray-300 min-w-[110px] justify-between text-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold capitalize">{language}</span>
              </div>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  isLangMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-xl z-50 overflow-hidden">
                {["python", "javascript", "java", "c++"].map((lang) => (
                  <div
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className="px-4 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 cursor-pointer capitalize"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleRun}
            disabled={status === "running"}
            className={`
                flex items-center gap-2 px-5 py-1.5 rounded shadow-md text-sm font-semibold transition-all active:scale-95
                ${
                  status === "running"
                    ? "bg-blue-400 cursor-not-allowed text-white/80"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                }
            `}
          >
            {status === "running" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
            <span>{status === "running" ? "Running" : "Run"}</span>
          </button>
        </div>
      </header>

      {/* --- Rest of the Layout (Unchanged) --- */}
      <div className="flex flex-1 relative overflow-hidden" ref={containerRef}>
        {isFilePanelOpen && (
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0 animate-in slide-in-from-left-5 duration-200">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
              <span className="flex items-center gap-2">
                {activeTab}
                {activeTab === "My Codes" && (
                  <RefreshCw
                    size={12}
                    className="cursor-pointer hover:text-blue-600 hover:rotate-180 transition-all"
                    onClick={() => dispatch(getUserCodes())}
                  />
                )}
              </span>
              <X
                size={14}
                className="cursor-pointer hover:text-gray-900"
                onClick={() => setIsFilePanelOpen(false)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {activeTab === "My Codes" ? (
                (
                  userCodes?.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleCodeClick(item._id)}
                      className={`
                        flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded transition-colors border border-transparent
                        ${
                          activeCodeId === item._id
                            ? "bg-blue-50 text-blue-700 border-blue-100 font-medium"
                            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        }
                      `}
                    >
                      <FileCode size={14} className="shrink-0" />
                      <span className="truncate">
                        {item.title || "Untitled"}
                      </span>
                    </div>
                  ))
                
                )
              ) : (
                <div className="p-2 text-xs text-gray-400 italic">
                  File explorer placeholder
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className="flex flex-col h-full bg-white relative"
          style={{ width: `${leftWidth}%` }}
        >
          {isCodeLoading && (
            <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" />
            </div>
          )}
          <div className="h-8 bg-gray-50 flex items-center px-4 border-b border-gray-200 shrink-0">
            <span className="text-[11px] font-bold text-gray-500 tracking-wider flex items-center gap-2">
              <FileCode size={12} /> EDITOR
            </span>
          </div>
          <div className="flex-1 flex overflow-hidden relative group">
            <div
              ref={lineNumbersRef}
              className="w-12 bg-gray-50 text-right pr-3 pt-4 text-gray-400 font-mono text-xs leading-6 select-none overflow-hidden border-r border-gray-100 shrink-0"
            >
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={(e) => {
                if (lineNumbersRef.current)
                  lineNumbersRef.current.scrollTop = e.target.scrollTop;
              }}
              className="flex-1 h-full bg-white text-gray-800 font-mono text-sm p-4 pt-4 leading-6 border-none outline-none resize-none custom-scrollbar whitespace-pre"
              spellCheck="false"
              autoCapitalize="none"
            />
          </div>
        </div>

        <div
          className="w-1 bg-gray-100 hover:bg-blue-500 cursor-col-resize flex items-center justify-center z-10 transition-colors relative group"
          onMouseDown={() => setIsDraggingVert(true)}
        >
          <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            <ArrowLeftRight size={12} className="text-white" />
          </div>
        </div>

        <div
          className="flex flex-col h-full bg-white min-w-0"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="flex flex-col min-h-0 bg-white flex-1">
            <div className="h-8 bg-gray-50 flex items-center px-3 border-b border-gray-200 shrink-0">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Input (STDIN)
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter custom input here..."
              className="flex-1 w-full bg-white text-gray-800 font-mono text-sm p-3 border-none outline-none resize-none custom-scrollbar"
            />
          </div>

          <div
            className="h-1 bg-gray-100 hover:bg-blue-500 cursor-row-resize z-10 transition-colors shrink-0"
            onMouseDown={() => setIsDraggingHorz(true)}
          />

          <div
            className="flex flex-col shrink-0"
            style={{ height: `${ioHeight}%` }}
          >
            <div className="h-8 bg-gray-50 flex items-center justify-between px-3 border-b border-gray-200 shrink-0">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Terminal size={12} /> Output
              </span>
              {status === "running" && (
                <span className="text-[10px] text-blue-600 animate-pulse">
                  Processing...
                </span>
              )}
            </div>

            <div className="flex-1 p-3 font-mono text-sm overflow-auto whitespace-pre-wrap bg-gray-50/50 custom-scrollbar">
              {status === "running" ? (
                <div className="text-gray-400 italic">Running code...</div>
              ) : error ? (
                <div className="text-red-600 bg-red-50 p-2 rounded border border-red-100">
                  {error}
                </div>
              ) : output ? (
                <pre className="text-gray-800">{output}</pre>
              ) : (
                <div className="text-gray-400 italic text-xs">
                  Run code to see output
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

const HeaderButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all select-none
      ${
        active
          ? "bg-blue-50 text-blue-600 border border-blue-200"
          : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default MainCompilerLight;

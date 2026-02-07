import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import {
  Edit2,
  Trash2,
  FilePlus,
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
  Menu,
  Keyboard,
  MoreVertical,
  LayoutTemplate,
  FileText,
  Search,
  ChevronRight,
  Folder,
} from "lucide-react";
import {
  runCode,
  getResult,
  getUserCodes,
  saveCode,
  createCode,
  deleteCode,
} from "../../redux/slices/codeSlice";
import axios from "axios";
import {
  createFolder,
  deleteFolder,
  fetchFolders,
} from "../../redux/slices/folderSlice";

const MainCompilerLight = () => {
  const dispatch = useDispatch();

  // --- Redux State ---
  const { output, status, error, jobId, userCodes } = useSelector(
    (store) => store?.code,
  );

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  const { folders } = useSelector((state) => state?.folder);
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

  // --- Mobile Specific State ---
  const [mobileTab, setMobileTab] = useState("editor"); // 'editor' | 'input' | 'output'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Content State ---
  const [code, setCode] = useState('print("Hello, World!")');
  const [input, setInput] = useState("");
  const [codeName, setCodeName] = useState("Untitled Project");
  const [activeCodeId, setActiveCodeId] = useState(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [folderPath, setFolderPath] = useState();
  const [showSaveModal, setShowSaveModal] = useState(false);

  // --- Refs ---
  const containerRef = useRef(null);
  const langMenuRef = useRef(null);
  const titleInputRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // --- Close Dropdowns on Click Outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
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

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRun = () => {
    if (status === "running") return;

    dispatch(runCode({ language, code, input }));
  };
  useEffect(() => {
    if (status === "completed" && window.innerWidth < 768) {
      setMobileTab("output");
    }
  }, [status]);

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
    // Mobile logic: always open if triggered
    if (window.innerWidth < 768) {
      setIsFilePanelOpen((prev) => !prev);
      setActiveTab(tabName);
    } else {
      // Desktop logic
      if (isFilePanelOpen) {
        setIsFilePanelOpen(false);
      } else {
        setIsFilePanelOpen(true);
        setActiveTab(tabName);
      }
    }

    if (tabName === "My Codes") {
      dispatch(getUserCodes());
    }
  };

  const detectLanguageFromExtension = (filename) => {
    if (!filename) return null;
    const ext = filename.split(".").pop().toLowerCase();
    const extensionMap = {
      py: "python",
      js: "javascript",
      jsx: "javascript",
      ts: "javascript",
      java: "java",
      cpp: "cpp",
      c: "cpp",
      cc: "cpp",
    };
    return extensionMap[ext] || null;
  };

  const handleCodeClick = async (code_id) => {
    if (isCodeLoading) return;
    setIsCodeLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/codes/${code_id}`,
        { withCredentials: true },
      );
      const fetchedTitle = res.data.title || "Untitled";
      setCodeName(fetchedTitle);
      setCode(res.data.code);
      setActiveCodeId(code_id);
      const detectedLang = detectLanguageFromExtension(fetchedTitle);
      if (detectedLang) setLanguage(detectedLang);

      // Close mobile drawer after selection
      if (window.innerWidth < 768) setIsFilePanelOpen(false);
    } catch (err) {
      console.error(err);
      showNotification("Failed to load code.");
    } finally {
      setIsCodeLoading(false);
    }
  };

  // --- Resizing Logic (Desktop Only) ---
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

  const handleSave = () => {
    if (!activeCodeId) {
      showNotification("Please select/create a file.");
      return;
    }
    const payload = {
      title: codeName,
      language,
      code,
      description: "",
      input,
      lastOutput: output || "",
    };
    dispatch(saveCode({ code_id: activeCodeId, payload }))
      .unwrap()
      .then(() => showNotification("Saved successfully."))
      .catch((err) => showNotification("Failed to save."));
  };

  const handleModalSave = () => {
    dispatch(createFolder(folderPath));
    dispatch(
      createCode({
        title: codeName,
        language,
        code,
        description: "",
        input: input || "",
        folderPath: folderPath,
      }),
    )
      .unwrap()
      .then(() => showNotification("Created successfully."))
      .catch((err) => showNotification("Failed to save."));
  };

  const handleCreateCode = () => {
    setShowSaveModal((prev) => !prev);
  };

  // --- Monaco Setup ---
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Add custom completions here if needed (omitted for brevity)
  };

  return (
    <div className="relative h-screen w-full">
      {/* MAIN APP — ALWAYS MOUNTED */}
      <div className="flex flex-col h-screen w-full bg-white text-gray-800 font-sans overflow-hidden">
        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-gray-700">
            <div className="bg-green-500/20 p-1 rounded-full">
              <Check size={14} className="text-green-400" />
            </div>
            <span className="text-sm font-medium">{notification}</span>
          </div>
        )}

        {/* ================= HEADER (Responsive) ================= */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 md:px-4 z-40 shrink-0">
          {/* Left: Branding & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => toggleFilePanel("My Codes")}
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Center: Desktop Tools */}
          <div className="hidden md:flex items-center gap-2">
            <HeaderButton
              icon={<FolderOpen size={15} />}
              label="My Codes"
              active={isFilePanelOpen && activeTab === "My Codes"}
              onClick={() => toggleFilePanel("My Codes")}
            />
            <div className="h-4 w-px bg-gray-300 mx-1"></div>
            <HeaderButton
              icon={<Save size={15} />}
              label="Save"
              onClick={handleSave}
            />
            <HeaderButton
              icon={<FileCode size={15} />}
              label="New"
              onClick={handleCreateCode}
            />
          </div>

          {/* Right: Language & Run */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-2 md:px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-200 text-gray-700 transition-colors"
              >
                <span className="capitalize hidden md:inline">{language}</span>
                <span className="capitalize md:hidden">
                  {language === "javascript"
                    ? "JS"
                    : language === "python"
                      ? "PY"
                      : "C++"}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95">
                  {["python", "javascript", "java", "cpp"].map((lang) => (
                    <div
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className="px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 cursor-pointer capitalize flex items-center justify-between group"
                    >
                      {lang === "cpp" ? "C++" : lang}
                      {language === lang && (
                        <Check size={14} className="text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={status === "running"}
              className={`
                flex items-center gap-2 px-3 md:px-5 py-1.5 rounded-md shadow-sm text-xs md:text-sm font-semibold transition-all active:scale-95
                ${status === "running" ? "bg-blue-100 text-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"}
              `}
            >
              {status === "running" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Play size={16} fill="currentColor" />
              )}
              <span className="hidden md:inline">
                {status === "running" ? "Running" : "Run Code"}
              </span>
            </button>

            {/* Mobile More Menu */}
            <div className="md:hidden relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600"
              >
                <MoreVertical size={20} />
              </button>
              {isMobileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                    Actions
                  </div>
                  <button
                    onClick={() => {
                      handleSave();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex gap-3"
                  >
                    <Save size={16} /> Save File
                  </button>
                  <button
                    onClick={() => {
                      handleCreateCode();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex gap-3"
                  >
                    <FileCode size={16} /> New File
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= BODY CONTENT ================= */}

        {/* 1. DESKTOP LAYOUT (Hidden on mobile) */}
        <div
          className="hidden md:flex flex-1 relative overflow-hidden"
          ref={containerRef}
        >
          {/* ... Existing Sidebar Code ... */}
          {isFilePanelOpen && (
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
              <SidebarContent
                userCodes={userCodes}
                activeCodeId={activeCodeId}
                handleCodeClick={handleCodeClick}
                dispatch={dispatch}
                close={() => setIsFilePanelOpen(false)}
                folders={folders}
                activeTab={activeTab}
                code={code}
                language={language}
                input={input}
                showNotification={showNotification}
              />
            </div>
          )}

          {/* Desktop Split Panes */}
          <div
            className="flex flex-col h-full bg-white relative"
            style={{ width: `${leftWidth}%` }}
          >
            {/* Editor Wrapper */}
            <div className="h-full w-full relative">
              <Editor
                height="100%"
                language={language === "c++" ? "cpp" : language}
                value={code}
                theme="light"
                onChange={setCode}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 16 },
                }}
              />
            </div>
          </div>

          {/* Vertical Drag Handle */}
          <div
            className="w-1 bg-gray-100 hover:bg-blue-500 cursor-col-resize z-10 transition-colors"
            onMouseDown={() => setIsDraggingVert(true)}
          />

          {/* IO Panel */}
          <div
            className="flex flex-col h-full bg-white min-w-0"
            style={{ width: `${100 - leftWidth}%` }}
          >
            <div className="flex flex-col flex-1 min-h-0">
              <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-b">
                INPUT
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 resize-none outline-none font-mono text-sm"
                placeholder="Input here..."
              />
            </div>
            <div
              className="h-1 bg-gray-100 hover:bg-blue-500 cursor-row-resize z-10"
              onMouseDown={() => setIsDraggingHorz(true)}
            />
            <div className="flex flex-col" style={{ height: `${ioHeight}%` }}>
              <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-b flex justify-between">
                <span>OUTPUT</span>
                {status === "running" && (
                  <span className="text-blue-500 animate-pulse">
                    Processing...
                  </span>
                )}
              </div>
              <div
                className={`flex-1 p-3 font-mono text-sm overflow-auto whitespace-pre-wrap ${error ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-800"}`}
              >
                {output || error || (
                  <span className="text-gray-400 italic">No output yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. MOBILE LAYOUT (Hidden on desktop) */}
        <div className="md:hidden flex flex-col flex-1 relative w-full overflow-hidden bg-white">
          {/* Mobile File Drawer (Overlay) */}
          {isFilePanelOpen && (
            <div className="absolute inset-0 z-50 flex">
              <div className="w-4/5 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200 border-r border-gray-200 flex flex-col">
                <SidebarContent
                  activeTab={activeTab}
                  dispatch={dispatch}
                  code={code}
                  language={language}
                  input={input}
                  folders={folders}
                  userCodes={userCodes}
                  activeCodeId={activeCodeId}
                  showNotification={showNotification}
                  handleCodeClick={handleCodeClick}
                  close={() => setIsFilePanelOpen(false)}
                  isMobile
                />
              </div>
              <div
                className="w-1/5 h-full bg-black/20 backdrop-blur-sm"
                onClick={() => setIsFilePanelOpen(false)}
              ></div>
            </div>
          )}

          {/* Tab Content Area */}
          <div className="flex-1 relative overflow-hidden">
            {/* EDITOR TAB */}
            <div
              className={`absolute inset-0 flex flex-col ${mobileTab === "editor" ? "z-10 visible" : "z-0 invisible"}`}
            >
              <Editor
                height="100%"
                language={language === "c++" ? "cpp" : language}
                value={code}
                theme="light"
                onChange={setCode}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: false, // Save space on mobile
                  padding: { top: 10 },
                }}
              />
            </div>

            {/* INPUT TAB */}
            <div
              className={`absolute inset-0 flex flex-col bg-white ${mobileTab === "input" ? "z-20 visible" : "z-0 invisible"}`}
            >
              <div className="p-4 flex-1 flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Standard Input (Stdin)
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50"
                  placeholder="Enter input for your program here..."
                />
              </div>
            </div>

            {/* OUTPUT TAB */}
            <div
              className={`absolute inset-0 flex flex-col bg-white ${mobileTab === "output" ? "z-20 visible" : "z-0 invisible"}`}
            >
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Console Output
                  </label>
                  {status === "running" && (
                    <span className="text-xs text-blue-600 font-medium animate-pulse">
                      Running...
                    </span>
                  )}
                </div>

                <div
                  className={`flex-1 rounded-lg border p-3 font-mono text-xs sm:text-sm overflow-auto whitespace-pre-wrap ${error ? "bg-red-50 border-red-200 text-red-700" : "bg-gray-900 border-gray-800 text-green-400"}`}
                >
                  {status === "running"
                    ? "..."
                    : output || error || "Run code to see output"}
                </div>

                {/* Quick stat info */}
                <div className="mt-2 flex gap-4 text-[10px] text-gray-400">
                  <span>Job ID: {jobId ? jobId.slice(0, 8) : "N/A"}</span>
                  <span>Lang: {language}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="h-14 bg-white border-t border-gray-200 flex justify-around items-center shrink-0 pb-safe">
            <MobileNavButton
              active={mobileTab === "editor"}
              onClick={() => setMobileTab("editor")}
              icon={<FileCode2 size={20} />}
              label="Editor"
            />
            <MobileNavButton
              active={mobileTab === "input"}
              onClick={() => setMobileTab("input")}
              icon={<Keyboard size={20} />}
              label="Input"
            />
            <MobileNavButton
              active={mobileTab === "output"}
              onClick={() => setMobileTab("output")}
              icon={<Terminal size={20} />}
              label="Output"
              hasIndicator={
                status === "running" || (output && mobileTab !== "output")
              }
            />
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {showSaveModal && (
        <SaveModal
          setShowSaveModal={setShowSaveModal}
          folderPath={folderPath}
          setFolderPath={setFolderPath}
          handleModalSave={handleModalSave}
          setCodeName={setCodeName}
          codeName={codeName}
        />
      )}
    </div>
  );
};

const SidebarContent = ({
  activeTab,
  userCodes,
  activeCodeId,
  handleCodeClick,
  dispatch,
  close,
  code,
  language,
  isMobile,
  input,
  folders,
  showNotification,
}) => {
  const [openFolders, setOpenFolders] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const [codeName, setCodeName] = useState("Untitled Project");

  // --- Renaming State ---
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // --- Context Menu State ---
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    type: null, // 'folder' or 'file'
    data: null,
  });

  const contextMenuRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, show: false });
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [contextMenu]);

  // --- Handlers ---

  const toggleFolder = (folderPath) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getUserCodes());
    await dispatch(fetchFolders());
    setIsRefreshing(false);
  };

  const handleModalSave = () => {
    console.log(codeName, language, code, input, folderPath);
    dispatch(
      createCode({
        title: codeName,
        language,
        code,
        description: "",
        input: input || "",
        folderPath: folderPath,
      }),
    )
      .unwrap()
      .then(() => showNotification("Created successfully."))
      .catch((err) => showNotification("Failed to save."));
  };
  const handleCreateFile = (data) => {
    setContextMenu({ ...contextMenu, show: false });
    setFolderPath(data.path);
    // console.log("Creating file in folder:", data);
    setSaveModalOpen(true);
  };

  const handleContextMenu = (e, type, data) => {
    e.preventDefault();
    e.stopPropagation();
    const x = e.clientX;
    const y = e.clientY;
    setContextMenu({ show: true, x, y, type, data });
  };

  // --- Action Handlers ---

  const handleRenameStart = () => {
    setRenamingId(contextMenu.data._id);
    // Use 'title' for files, 'path' or name for folders depending on your DB structure
    setRenameValue(contextMenu.data.title || contextMenu.data.path || "");
    setContextMenu({ ...contextMenu, show: false });
  };

  const handleRenameSubmit = async () => {
    if (!renameValue.trim()) return setRenamingId(null);

    if (contextMenu.type === "folder") {
      // Dispatch folder rename
      // await dispatch(renameFolder({ id: renamingId, name: renameValue }));
      await dispatch(fetchFolders()); // Refresh folders
    } else {
      // Dispatch file rename
      // Assuming editCode takes { id, payload }
      await dispatch(
        saveCode({
          code_id: renamingId,
          payload: { title: renameValue },
        }),
      );
      await dispatch(getUserCodes()); // Refresh files
    }
    setRenamingId(null);
  };

  const handleDelete = async () => {
    setContextMenu({ ...contextMenu, show: false });

    if (contextMenu.type === "folder") {
      // Handle Folder Delete
      await dispatch(deleteFolder(contextMenu.data._id));
      dispatch(fetchFolders()); // Refresh folder list
    } else {
      // Handle File Delete
      await dispatch(deleteCode(contextMenu.data._id))
        .unwrap() // Wait for the promise to resolve
        .then(() => {
          // FIX: Explicitly fetch codes again to update UI
          dispatch(getUserCodes());
        })
        .catch((err) => console.error("Delete failed", err));
    }
  };

  // Helper to detect Enter key on Rename Input
  const handleRenameKeyDown = (e) => {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") setRenamingId(null);
  };

  return (
    <>
      <div
        className="flex flex-col h-full bg-white border-r border-gray-200 relative"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
          <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            {activeTab}
            {activeTab === "My Codes" && (
              <button
                onClick={handleRefresh}
                className={`p-1 rounded-md hover:bg-blue-100 hover:text-blue-600 transition-all ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
                title="Refresh Files"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </span>
          <button
            onClick={close}
            className="p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* --- Tree View Content --- */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {activeTab === "My Codes" ? (
            <div className="space-y-0.5">
              {folders?.map((item) => {
                const isOpen = openFolders[item.path];
                const folderFiles = userCodes?.filter(
                  (code) => code?.folderPath === item.path,
                );

                return (
                  <div key={item._id} className="select-none">
                    {/* Folder Row */}
                    <div
                      onClick={() => {
                        toggleFolder(item.path);
                      }}
                      onContextMenu={(e) =>
                        handleContextMenu(e, "folder", item)
                      }
                      className={`
                      group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer transition-all duration-200 border-l-2 border-transparent
                      ${isOpen ? "bg-gray-50" : "hover:bg-gray-50"}
                    `}
                    >
                      <span
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
                      >
                        <ChevronDown size={14} />
                      </span>

                      <span
                        className={`transition-colors ${isOpen ? "text-blue-600" : "text-blue-400 group-hover:text-blue-500"}`}
                      >
                        {isOpen ? (
                          <FolderOpen size={16} />
                        ) : (
                          <Folder size={16} />
                        )}
                      </span>

                      {/* FOLDER RENAME INPUT OR TEXT */}
                      {renamingId === item._id ? (
                        <input
                          autoFocus
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={handleRenameSubmit}
                          onKeyDown={handleRenameKeyDown}
                          onClick={(e) => e.stopPropagation()} // Prevent folder toggle when clicking input
                          className="flex-1 min-w-0 bg-white border border-blue-500 rounded px-1 py-0.5 text-sm outline-none"
                        />
                      ) : (
                        <span
                          className={`truncate text-sm font-medium transition-colors ${isOpen ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}
                        >
                          {item.path || "Untitled"}
                        </span>
                      )}

                      <span className="ml-auto text-[10px] text-gray-300 group-hover:text-gray-400">
                        {folderFiles?.length || 0}
                      </span>
                    </div>

                    {/* Files inside folder */}
                    {isOpen && (
                      <div className="relative animate-in slide-in-from-top-2 fade-in duration-200 origin-top">
                        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-200" />

                        {folderFiles && folderFiles.length > 0 ? (
                          folderFiles.map((code) => (
                            <div
                              key={code._id}
                              onClick={() => handleCodeClick(code._id)}
                              onContextMenu={(e) =>
                                handleContextMenu(e, "file", code)
                              }
                              className={`
                              group/file flex items-center gap-2 pl-9 pr-3 py-1.5 cursor-pointer text-sm border-l-2 transition-all
                              ${
                                activeCodeId === code._id
                                  ? "bg-blue-50/80 text-blue-700 border-blue-600 font-medium"
                                  : "text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
                              }
                            `}
                            >
                              <FileCode
                                size={14}
                                className={`shrink-0 transition-colors ${activeCodeId === code._id ? "text-blue-600" : "text-gray-400 group-hover/file:text-gray-600"}`}
                              />

                              {/* FILE RENAME INPUT OR TEXT */}
                              {renamingId === code._id ? (
                                <input
                                  autoFocus
                                  type="text"
                                  value={renameValue}
                                  onChange={(e) =>
                                    setRenameValue(e.target.value)
                                  }
                                  onBlur={handleRenameSubmit}
                                  onKeyDown={handleRenameKeyDown}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-1 min-w-0 bg-white border border-blue-500 rounded px-1 py-0 text-sm outline-none"
                                />
                              ) : (
                                <span className="truncate">
                                  {code.title || "Untitled"}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="pl-9 py-2 text-xs text-gray-400 flex items-center gap-2 italic">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>{" "}
                            Empty
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="bg-gray-50 p-3 rounded-full mb-3">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium">No files found</p>
            </div>
          )}
        </div>

        {/* --- Custom Context Menu --- */}
        {contextMenu.show && (
          <div
            ref={contextMenuRef}
            className="fixed z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 text-sm text-gray-700 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 border-b border-gray-100 bg-gray-50 rounded-t-lg">
              {contextMenu.type === "folder"
                ? "Folder Actions"
                : "File Actions"}
            </div>

            <button
              onClick={handleRenameStart}
              className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
            >
              <Edit2 size={14} /> Rename
            </button>

            <button
              onClick={handleDelete}
              className="w-full text-left px-3 py-2 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>

            {contextMenu.type === "folder" && (
              <button
                // onClick={() => {
                //   console.log("Create file in:", contextMenu.data);
                //   setContextMenu({ ...contextMenu, show: false });
                // }}
                onClick={() => {
                  handleCreateFile(contextMenu.data);
                }}
                className="w-full text-left px-3 py-2 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors border-t border-gray-50"
              >
                <FilePlus size={14} /> New File
              </button>
            )}
          </div>
        )}
      </div>
      {saveModalOpen && (
        <SaveModal
          setShowSaveModal={setSaveModalOpen}
          folderPath={folderPath}
          setFolderPath={setFolderPath}
          handleModalSave={handleModalSave}
          setCodeName={setCodeName}
          codeName={codeName}
        />
      )}
    </>
  );
};

const HeaderButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${active ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent"}`}
  >
    {icon} <span>{label}</span>
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label, hasIndicator }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
  >
    {hasIndicator && (
      <span className="absolute top-2 right-8 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
    )}
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
    {active && (
      <span className="absolute bottom-0 w-8 h-1 bg-blue-600 rounded-t-full"></span>
    )}
  </button>
);

const SaveModal = ({
  setShowSaveModal,
  folderPath,
  setFolderPath,
  handleModalSave,
  setCodeName,
  codeName,
}) => {
  // Handle "Enter" key to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleModalSave();
      setShowSaveModal(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center transition-all"
      onClick={() => setShowSaveModal(false)}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[400px] rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Save size={16} className="text-blue-600" />
            Save Snippet
          </h2>
          <button
            onClick={() => setShowSaveModal(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
              Snippet Name
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <FileText size={16} />
              </div>
              <input
                type="text"
                placeholder="e.g. Array Sort Algorithm"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 
                         focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Folder Path Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
              Folder Group
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Folder size={16} />
              </div>
              <input
                type="text"
                placeholder="e.g. Algorithms/Python"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 
                         focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setShowSaveModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              handleModalSave();
              setShowSaveModal(false);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm shadow-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
          >
            Save File
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainCompilerLight;

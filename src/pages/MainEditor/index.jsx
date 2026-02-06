import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
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
  Menu,
  Keyboard,
  MoreVertical,
  LayoutTemplate
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
    // On Desktop, switch tab
    setActiveTab("Output");
    // On Mobile, auto-switch to output view
    setMobileTab("output");
    
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
    // Mobile logic: always open if triggered
    if (window.innerWidth < 768) {
      setIsFilePanelOpen(true);
      setActiveTab(tabName);
    } else {
      // Desktop logic
      if (isFilePanelOpen && activeTab === tabName) {
        setIsFilePanelOpen(false);
      } else {
        setIsFilePanelOpen(true);
        setActiveTab(tabName);
      }
    }
    
    if (
      tabName === "My Codes" &&
      (!userCodes?.codes || userCodes.codes.length === 0)
    ) {
      dispatch(getUserCodes());
    }
  };

  const detectLanguageFromExtension = (filename) => {
    if (!filename) return null;
    const ext = filename.split(".").pop().toLowerCase();
    const extensionMap = {
      py: "python", js: "javascript", jsx: "javascript", ts: "javascript",
      java: "java", cpp: "cpp", c: "cpp", cc: "cpp",
    };
    return extensionMap[ext] || null;
  };

  const handleCodeClick = async (code_id) => {
    if (isCodeLoading) return;
    setIsCodeLoading(true);
    try {
      const res = await axios.get(
        `/codes/${code_id}`,
        { withCredentials: true }
      );
      const fetchedTitle = res.data.title || "Untitled";
      setCodeName(fetchedTitle);
      setCode(res.data.code);
      setActiveCodeId(code_id);
      const detectedLang = detectLanguageFromExtension(fetchedTitle);
      if (detectedLang) setLanguage(detectedLang);
      
      // Close mobile drawer after selection
      if(window.innerWidth < 768) setIsFilePanelOpen(false);

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
      title: codeName, language, code, description: "",
      input, lastOutput: output || "", folderPath: "/",
    };
    dispatch(saveCode({ code_id: activeCodeId, payload }))
      .unwrap()
      .then(() => showNotification("Saved successfully."))
      .catch((err) => showNotification("Failed to save."));
  };

  const handleCreateCode = () => {
    dispatch(createCode({
      title: codeName, language, code, description: "",
      input: input || "", folderPath: "",
    }));
  };

  // --- Monaco Setup ---
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Add custom completions here if needed (omitted for brevity)
  };

  return (
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
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 group relative">
              {isEditingName ? (
                 <input
                 ref={titleInputRef}
                 type="text"
                 value={codeName}
                 onChange={(e) => setCodeName(e.target.value)}
                 onBlur={() => setIsEditingName(false)}
                 onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                 autoFocus
                 className="text-sm font-bold text-gray-800 bg-gray-50 border border-blue-300 rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-blue-100 w-32 md:w-48"
               />
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-100 px-1.5 py-0.5 -ml-1.5 rounded transition-colors"
                >
                   <span className="text-sm font-bold text-gray-800 truncate max-w-[120px] md:max-w-[200px]">
                    {codeName}
                   </span>
                   <FileCode2 size={12} className="text-gray-400 opacity-0 group-hover:opacity-100" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Desktop Tools */}
        <div className="hidden md:flex items-center gap-2">
            <HeaderButton icon={<FolderOpen size={15}/>} label="My Codes" active={isFilePanelOpen && activeTab === "My Codes"} onClick={() => toggleFilePanel("My Codes")} />
            <div className="h-4 w-px bg-gray-300 mx-1"></div>
            <HeaderButton icon={<Save size={15}/>} label="Save" onClick={handleSave} />
            <HeaderButton icon={<FileCode size={15}/>} label="New" onClick={handleCreateCode} />
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
                <span className="capitalize md:hidden">{language === 'javascript' ? 'JS' : language === 'python' ? 'PY' : 'C++'}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95">
                  {["python", "javascript", "java", "cpp"].map((lang) => (
                    <div key={lang} onClick={() => handleLanguageSelect(lang)} className="px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 cursor-pointer capitalize flex items-center justify-between group">
                      {lang === "cpp" ? "C++" : lang}
                      {language === lang && <Check size={14} className="text-blue-600"/>}
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
              {status === "running" ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
              <span className="hidden md:inline">{status === "running" ? "Running" : "Run Code"}</span>
            </button>
            
            {/* Mobile More Menu */}
            <div className="md:hidden relative">
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                  <MoreVertical size={20} />
               </button>
               {isMobileMenuOpen && (
                 <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Actions</div>
                    <button onClick={() => { handleSave(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex gap-3"><Save size={16}/> Save File</button>
                    <button onClick={() => { handleCreateCode(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex gap-3"><FileCode size={16}/> New File</button>
                 </div>
               )}
            </div>
        </div>
      </header>

      {/* ================= BODY CONTENT ================= */}
      
      {/* 1. DESKTOP LAYOUT (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 relative overflow-hidden" ref={containerRef}>
         {/* ... Existing Sidebar Code ... */}
         {isFilePanelOpen && (
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
             <SidebarContent 
                activeTab={activeTab} 
                userCodes={userCodes} 
                activeCodeId={activeCodeId} 
                handleCodeClick={handleCodeClick} 
                dispatch={dispatch} 
                close={() => setIsFilePanelOpen(false)}
             />
          </div>
        )}

        {/* Desktop Split Panes */}
        <div className="flex flex-col h-full bg-white relative" style={{ width: `${leftWidth}%` }}>
            {/* Editor Wrapper */}
            <div className="h-full w-full relative">
               <Editor 
                 height="100%" 
                 language={language === "c++" ? "cpp" : language} 
                 value={code} 
                 theme="light" 
                 onChange={setCode} 
                 onMount={handleEditorDidMount} 
                 options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true, padding: { top: 16 } }} 
               />
            </div>
        </div>

        {/* Vertical Drag Handle */}
        <div className="w-1 bg-gray-100 hover:bg-blue-500 cursor-col-resize z-10 transition-colors" onMouseDown={() => setIsDraggingVert(true)} />

        {/* IO Panel */}
        <div className="flex flex-col h-full bg-white min-w-0" style={{ width: `${100 - leftWidth}%` }}>
            <div className="flex flex-col flex-1 min-h-0">
               <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-b">INPUT</div>
               <textarea value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-3 resize-none outline-none font-mono text-sm" placeholder="Input here..." />
            </div>
            <div className="h-1 bg-gray-100 hover:bg-blue-500 cursor-row-resize z-10" onMouseDown={() => setIsDraggingHorz(true)} />
            <div className="flex flex-col" style={{ height: `${ioHeight}%` }}>
                <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-b flex justify-between">
                   <span>OUTPUT</span>
                   {status === "running" && <span className="text-blue-500 animate-pulse">Processing...</span>}
                </div>
                <div className={`flex-1 p-3 font-mono text-sm overflow-auto whitespace-pre-wrap ${error ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-800'}`}>
                   {output || error || <span className="text-gray-400 italic">No output yet</span>}
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
                  userCodes={userCodes} 
                  activeCodeId={activeCodeId} 
                  handleCodeClick={handleCodeClick} 
                  dispatch={dispatch} 
                  close={() => setIsFilePanelOpen(false)}
                  isMobile
                />
             </div>
             <div className="w-1/5 h-full bg-black/20 backdrop-blur-sm" onClick={() => setIsFilePanelOpen(false)}></div>
          </div>
        )}

        {/* Tab Content Area */}
        <div className="flex-1 relative overflow-hidden">
           {/* EDITOR TAB */}
           <div className={`absolute inset-0 flex flex-col ${mobileTab === 'editor' ? 'z-10 visible' : 'z-0 invisible'}`}>
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
                    padding: { top: 10 } 
                 }} 
              />
           </div>

           {/* INPUT TAB */}
           <div className={`absolute inset-0 flex flex-col bg-white ${mobileTab === 'input' ? 'z-20 visible' : 'z-0 invisible'}`}>
               <div className="p-4 flex-1 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2">Standard Input (Stdin)</label>
                  <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    className="flex-1 w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50"
                    placeholder="Enter input for your program here..."
                  />
               </div>
           </div>

           {/* OUTPUT TAB */}
           <div className={`absolute inset-0 flex flex-col bg-white ${mobileTab === 'output' ? 'z-20 visible' : 'z-0 invisible'}`}>
               <div className="flex-1 flex flex-col p-4 overflow-hidden">
                  <div className="flex justify-between items-center mb-2">
                     <label className="text-xs font-bold text-gray-500 uppercase">Console Output</label>
                     {status === 'running' && <span className="text-xs text-blue-600 font-medium animate-pulse">Running...</span>}
                  </div>
                  
                  <div className={`flex-1 rounded-lg border p-3 font-mono text-xs sm:text-sm overflow-auto whitespace-pre-wrap ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-900 border-gray-800 text-green-400'}`}>
                     {status === "running" ? "..." : (output || error || "Run code to see output")}
                  </div>
                  
                  {/* Quick stat info */}
                  <div className="mt-2 flex gap-4 text-[10px] text-gray-400">
                     <span>Job ID: {jobId ? jobId.slice(0, 8) : 'N/A'}</span>
                     <span>Lang: {language}</span>
                  </div>
               </div>
           </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="h-14 bg-white border-t border-gray-200 flex justify-around items-center shrink-0 pb-safe">
           <MobileNavButton 
             active={mobileTab === 'editor'} 
             onClick={() => setMobileTab('editor')} 
             icon={<FileCode2 size={20} />} 
             label="Editor" 
           />
           <MobileNavButton 
             active={mobileTab === 'input'} 
             onClick={() => setMobileTab('input')} 
             icon={<Keyboard size={20} />} 
             label="Input" 
           />
           <MobileNavButton 
             active={mobileTab === 'output'} 
             onClick={() => setMobileTab('output')} 
             icon={<Terminal size={20} />} 
             label="Output" 
             hasIndicator={status === 'running' || (output && mobileTab !== 'output')}
           />
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const SidebarContent = ({ activeTab, userCodes, activeCodeId, handleCodeClick, dispatch, close, isMobile }) => (
  <>
    <div className="p-3 border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-500 uppercase bg-gray-50">
      <span className="flex items-center gap-2">
        {activeTab}
        {activeTab === "My Codes" && (
          <RefreshCw size={12} className="cursor-pointer hover:text-blue-600 active:rotate-180 transition-all" onClick={() => dispatch(getUserCodes())} />
        )}
      </span>
      <button onClick={close} className="p-1 hover:bg-gray-200 rounded"><X size={14}/></button>
    </div>
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {activeTab === "My Codes" ? (
        userCodes?.map((item) => (
          <div
            key={item._id}
            onClick={() => handleCodeClick(item._id)}
            className={`flex items-center gap-3 px-3 py-3 md:py-2 text-sm cursor-pointer rounded-lg transition-colors border ${activeCodeId === item._id ? "bg-blue-50 text-blue-700 border-blue-200" : "border-transparent text-gray-600 hover:bg-gray-100"}`}
          >
            <div className={`p-1.5 rounded ${activeCodeId === item._id ? 'bg-blue-100' : 'bg-gray-200'}`}>
              <FileCode size={16} className="shrink-0" />
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className="truncate font-medium">{item.title || "Untitled"}</span>
               <span className="text-[10px] text-gray-400">{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-400 text-sm">No files found</div>
      )}
    </div>
  </>
);

const HeaderButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${active ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent"}`}>
    {icon} <span>{label}</span>
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label, hasIndicator }) => (
  <button onClick={onClick} className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
    {hasIndicator && <span className="absolute top-2 right-8 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>}
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
    {active && <span className="absolute bottom-0 w-8 h-1 bg-blue-600 rounded-t-full"></span>}
  </button>
);

export default MainCompilerLight;
import { useState, useEffect, useRef } from 'react';
import { Play, Code2, Terminal, Settings, Sparkles, GripVertical } from 'lucide-react';

const GuestEditor = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('print("Hello, World!")');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('Output will appear here...');
  const [isRunning, setIsRunning] = useState(false);
  const [editorWidth, setEditorWidth] = useState(65); // percentage
  const [outputHeight, setOutputHeight] = useState(50); // percentage of right panel
  
  const editorRef = useRef(null);
  const horizontalResizerRef = useRef(null);
  const verticalResizerRef = useRef(null);
  const containerRef = useRef(null);

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'bash', label: 'Bash' },
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
    bash: '#!/bin/bash\necho "Hello, World!"'
  };

  // Horizontal resizer (editor vs output/input panels)
  useEffect(() => {
    const resizer = horizontalResizerRef.current;
    const container = containerRef.current;
    if (!resizer || !container) return;

    let isResizing = false;

    const handleMouseDown = () => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      if (newWidth > 30 && newWidth < 80) {
        setEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    resizer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      resizer.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Vertical resizer (output vs input)
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
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const rightPanel = resizer.parentElement;
      const panelHeight = rightPanel.getBoundingClientRect().height;
      const deltaY = e.clientY - startY;
      const deltaPercent = (deltaY / panelHeight) * 100;
      const newHeight = startHeight + deltaPercent;
      
      if (newHeight > 20 && newHeight < 80) {
        setOutputHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    resizer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      resizer.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [outputHeight]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(templates[newLang] || '');
    setOutput('Output will appear here...');
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('🚀 Executing code...');
    
    // Simulate code execution (replace with actual API call)
    setTimeout(() => {
      setOutput(`✅ Code executed successfully!\n\nOutput:\nHello, World!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nExecution completed in 0.05s`);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header Toolbar - Matching Navbar Style */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#0652e9]" />
                <span className="text-[#0652e9] font-semibold text-sm sm:text-base">
                  Guest Mode - Try Without Login
                </span>
              </div>
              <div className="hidden md:block text-gray-500 text-sm">
                Code won't be saved. 
                <a href="/register" className="text-[#0652e9] hover:underline ml-1">
                  Sign up
                </a> to save your work!
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0652e9] focus:border-transparent transition-all cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <button
                onClick={runCode}
                disabled={isRunning}
                className={`px-6 py-2 rounded-lg text-sm font-semibold text-white flex items-center space-x-2 transition-all shadow-md ${
                  isRunning
                    ? 'bg-orange-500 cursor-not-allowed'
                    : 'bg-[#0652e9] hover:bg-[#0547d1] hover:shadow-lg hover:shadow-[#0652e9]/30'
                }`}
              >
                <Play className="w-4 h-4" fill="white" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Warning */}
      <div className="md:hidden bg-blue-50 border-b border-blue-200 px-4 py-2">
        <p className="text-xs text-gray-600">
          Code won't be saved. <a href="/register" className="text-[#0652e9] font-medium">Sign up</a> to save!
        </p>
      </div>

      {/* Editor Container with Resizable Panels */}
      <div 
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row overflow-hidden"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        {/* Code Editor Panel */}
        <div 
          className="flex flex-col border-r border-gray-200 bg-white"
          style={{ width: `${editorWidth}%` }}
        >
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-[#0652e9]" />
            <span className="text-sm font-semibold text-gray-700">Code Editor</span>
          </div>
          <div className="flex-1 p-4 overflow-auto bg-white">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0652e9] resize-none"
              spellCheck="false"
              style={{ tabSize: 4, minHeight: '100%' }}
            />
          </div>
        </div>

        {/* Horizontal Resizer */}
        <div
          ref={horizontalResizerRef}
          className="hidden lg:block w-1 bg-gray-200 hover:bg-[#0652e9] cursor-col-resize transition-colors relative group"
        >
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
            <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-[#0652e9]" />
          </div>
        </div>

        {/* Right Panel - Output & Input */}
        <div 
          className="flex flex-col"
          style={{ width: `${100 - editorWidth}%` }}
        >
          {/* Output Panel */}
          <div 
            className="flex flex-col border-b border-gray-200 bg-white overflow-hidden"
            style={{ height: `${outputHeight}%` }}
          >
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Output</span>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
                {output}
              </pre>
            </div>
          </div>

          {/* Vertical Resizer */}
          <div
            ref={verticalResizerRef}
            className="h-1 bg-gray-200 hover:bg-[#0652e9] cursor-row-resize transition-colors relative group"
          >
            <div className="absolute inset-x-0 -top-1 -bottom-1 flex items-center justify-center">
              <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-[#0652e9] rotate-90" />
            </div>
          </div>

          {/* Input Panel */}
          <div 
            className="flex flex-col bg-white overflow-hidden"
            style={{ height: `${100 - outputHeight}%` }}
          >
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Input (stdin)</span>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for your program (Every input in a new line)"
                className="w-full h-full p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0652e9] focus:border-transparent resize-none"
                style={{ minHeight: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestEditor;
import { useState, useEffect, useRef } from "react";
import { ArrowRight, CheckCircle, Play, Terminal, FileCode, Settings, Search, GitBranch } from "lucide-react";

const CodeCompilerSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const containerRef = useRef(null);

  const features = [
    "Support for 10+ programming languages",
    "Real-time code execution",
    "Instant feedback and results",
    "No setup required - code instantly",
  ];

  // The code broken into "Tokens" for syntax highlighting preservation
  const codeTokens = [
    { text: "const ", color: "text-purple-400" },
    { text: "twoSum ", color: "text-blue-400" },
    { text: "= ", color: "text-white" },
    { text: "(", color: "text-yellow-400" },
    { text: "nums", color: "text-orange-400" },
    { text: ", ", color: "text-white" },
    { text: "target", color: "text-orange-400" },
    { text: ") ", color: "text-yellow-400" },
    { text: "=> ", color: "text-purple-400" },
    { text: "{\n", color: "text-yellow-400" },
    
    { text: "  const ", color: "text-purple-400" },
    { text: "map ", color: "text-white" },
    { text: "= ", color: "text-white" },
    { text: "new ", color: "text-purple-400" },
    { text: "Map", color: "text-yellow-300" },
    { text: "();\n\n", color: "text-white" },

    { text: "  for ", color: "text-purple-400" },
    { text: "(", color: "text-yellow-400" },
    { text: "let ", color: "text-purple-400" },
    { text: "i ", color: "text-white" },
    { text: "= ", color: "text-white" },
    { text: "0", color: "text-green-300" },
    { text: "; ", color: "text-white" },
    { text: "i ", color: "text-white" },
    { text: "< ", color: "text-white" },
    { text: "nums", color: "text-orange-400" },
    { text: ".", color: "text-white" },
    { text: "length", color: "text-blue-300" },
    { text: "; ", color: "text-white" },
    { text: "i", color: "text-white" },
    { text: "++", color: "text-white" },
    { text: ") ", color: "text-yellow-400" },
    { text: "{\n", color: "text-yellow-400" },

    { text: "    const ", color: "text-purple-400" },
    { text: "compl ", color: "text-white" },
    { text: "= ", color: "text-white" },
    { text: "target ", color: "text-orange-400" },
    { text: "- ", color: "text-white" },
    { text: "nums", color: "text-orange-400" },
    { text: "[", color: "text-yellow-400" },
    { text: "i", color: "text-white" },
    { text: "];\n", color: "text-yellow-400" },

    { text: "    if ", color: "text-purple-400" },
    { text: "(", color: "text-yellow-400" },
    { text: "map", color: "text-white" },
    { text: ".", color: "text-white" },
    { text: "has", color: "text-blue-400" },
    { text: "(", color: "text-yellow-400" },
    { text: "compl", color: "text-white" },
    { text: ")) ", color: "text-yellow-400" },
    { text: "{\n", color: "text-yellow-400" },
    
    { text: "      return ", color: "text-purple-400" },
    { text: "[", color: "text-blue-400" },
    { text: "map", color: "text-white" },
    { text: ".", color: "text-white" },
    { text: "get", color: "text-blue-400" },
    { text: "(", color: "text-yellow-400" },
    { text: "compl", color: "text-white" },
    { text: "), ", color: "text-yellow-400" },
    { text: "i", color: "text-white" },
    { text: "];\n", color: "text-blue-400" },
    
    { text: "    }\n", color: "text-yellow-400" },
    { text: "    map", color: "text-white" },
    { text: ".", color: "text-white" },
    { text: "set", color: "text-blue-400" },
    { text: "(", color: "text-yellow-400" },
    { text: "nums", color: "text-orange-400" },
    { text: "[", color: "text-purple-400" },
    { text: "i", color: "text-white" },
    { text: "], ", color: "text-purple-400" },
    { text: "i", color: "text-white" },
    { text: ");\n", color: "text-yellow-400" },
    { text: "  }\n", color: "text-yellow-400" },
    { text: "};", color: "text-yellow-400" },
  ];

  // Logic: Flatten tokens to count total chars, then render based on charIndex
  const totalChars = codeTokens.reduce((acc, token) => acc + token.text.length, 0);

  // 1. Detect when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 } // Start when 30% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. Typing Timer
  useEffect(() => {
    if (!isVisible || charIndex >= totalChars) return;

    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + 1);
    }, 25); // Speed: 25ms per character (adjust for faster/slower typing)

    return () => clearTimeout(timeout);
  }, [isVisible, charIndex, totalChars]);


  // 3. Render Helper: Reconstructs the colored HTML up to the current character count
  const renderCode = () => {
    let currentCount = 0;
    const result = [];

    for (let i = 0; i < codeTokens.length; i++) {
      const token = codeTokens[i];
      const remainingNeeded = charIndex - currentCount;

      if (remainingNeeded <= 0) break;

      if (remainingNeeded >= token.text.length) {
        // Render full token
        result.push(<span key={i} className={token.color}>{token.text}</span>);
        currentCount += token.text.length;
      } else {
        // Render partial token (split string)
        result.push(<span key={i} className={token.color}>{token.text.slice(0, remainingNeeded)}</span>);
        currentCount += remainingNeeded;
        break; // Stop loop once we caught up to the cursor
      }
    }
    return result;
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <div className="order-2 lg:order-1 relative z-10">
            <span className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full mb-6 text-sm font-semibold tracking-wide">
              <Terminal className="w-4 h-4 mr-2 text-green-400" />
              Online IDE
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Build. Run. Debug. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0652e9] to-blue-500">
                Directly in your browser.
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Zero setup required. Spin up a powerful environment in seconds. 
              Whether you're solving algorithms or building full-stack apps, 
              our editor handles the heavy lifting so you can focus on the logic.
            </p>

            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="mt-1 p-0.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <CheckCircle className="w-4 h-4 text-[#0652e9]" />
                  </div>
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>

            <a
              href="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1"
            >
              Start Coding
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* RIGHT CONTENT: INTERACTIVE IDE */}
          <div className="order-1 lg:order-2 relative perspective-1000" ref={containerRef}>
            
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0652e9]/10 rounded-full blur-3xl" />

            {/* The IDE Window */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] border border-gray-800 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              
              {/* Window Header */}
              <div className="bg-[#252526] px-4 py-3 flex items-center justify-between border-b border-[#333]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-gray-400 text-xs font-mono flex items-center gap-2">
                   <FileCode className="w-3 h-3 text-blue-400" />
                   main.js
                </div>
                <div className="w-16"></div>
              </div>

              <div className="flex h-[340px]"> {/* Fixed height prevents jumping */}
                {/* Sidebar */}
                <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-6 border-r border-[#444]">
                    <FileCode className="w-5 h-5 text-gray-100 cursor-pointer" />
                    <Search className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                    <GitBranch className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                    <div className="flex-grow" />
                    <Settings className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                </div>

                {/* Main Code Area */}
                <div className="flex-1 flex flex-col">
                  {/* Tabs */}
                  <div className="flex bg-[#252526] text-sm shrink-0">
                    <div className="px-4 py-2 bg-[#1e1e1e] text-gray-200 border-t-2 border-blue-500 flex items-center gap-2">
                      <span className="text-yellow-400">JS</span> main.js
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 p-4 font-mono text-sm leading-relaxed overflow-hidden bg-[#1e1e1e] relative">
                    <div className="flex gap-4 h-full">
                      {/* Line Numbers */}
                      <div className="text-gray-600 text-right select-none flex flex-col w-6 shrink-0">
                        {Array.from({ length: 14 }).map((_, i) => (
                           <span key={i}>{i + 1}</span>
                        ))}
                      </div>
                      
                      {/* Dynamic Typing Area */}
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {renderCode()}
                        
                        {/* Blinking Cursor */}
                        <span className="inline-block w-2 h-4 bg-blue-400 align-middle ml-0.5 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Terminal Status Bar */}
                  <div className="bg-[#0652e9] text-white p-1.5 flex justify-between items-center text-[10px] font-mono shrink-0">
                     <div className="flex gap-4 px-2">
                        <span>Ln {Math.min(14, Math.ceil(charIndex / 25))}, Col {charIndex % 30}</span>
                        <span>UTF-8</span>
                        <span>JavaScript</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Success Badge (Only appears after typing finishes) */}
              <div 
                className={`absolute bottom-16 right-8 bg-[#1e1e1e] border border-green-500/30 text-green-400 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 transition-all duration-700 transform ${
                  charIndex >= totalChars ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Output</p>
                   <p className="font-mono text-sm font-bold">[0, 1] <span className="text-gray-500 text-xs ml-2">52ms</span></p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CodeCompilerSection;
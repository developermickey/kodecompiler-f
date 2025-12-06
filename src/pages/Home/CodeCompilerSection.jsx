import { ArrowRight, Play, Code, CheckCircle } from "lucide-react";

const CodeCompilerSection = () => {
  const codeSnippet = `#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>

using namespace std;

int solveMeFirst(int a, int b) {
    // Hint: Type return a+b; below:
    
}

int main() {
    int num1, num2;
    int sum;
    cin>>num1>>num2;
    sum = solveMeFirst(num1,num2);
    cout<<sum;
    return 0;
}`;

  const features = [
    "Support for 10+ programming languages",
    "Real-time code execution",
    "Instant feedback and results",
    "No setup required - code instantly",
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full mb-6 text-sm font-medium">
              Online Code Editor
            </div>

            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              A Powerful Online Code Editor for Every Developer
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience a fast, modern, and intuitive online code editor built
              for developers of all skill levels. Write, run, and debug your
              code directly in the browser without installing any software. With
              support for multiple programming languages, real-time results, and
              a clean UI, our editor helps you focus on learning, practicing,
              and building — all in one place.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-[#0652e9]" />
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>

            <a
              href="/learn-more"
              className="w-[200px] flex items-center justify-center gap-1 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl hover:bg-[#0547d1] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105 transform"
            >
              <span>Learn more</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Right Side - Code Editor Window */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Code Editor Window */}
              <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
                {/* Window Header */}
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-xs">Language</span>
                    <select className="bg-gray-700 text-white text-xs px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0652e9] cursor-pointer">
                      <option>C</option>
                      <option>C++</option>
                      <option>Python</option>
                      <option>Java</option>
                    </select>
                    <a
                      href="#"
                      className="text-[#0652e9] text-xs hover:underline hidden sm:block"
                    >
                      Environment details
                    </a>
                  </div>
                </div>

                {/* Code Content */}
                <div className="flex max-h-96 overflow-auto">
                  {/* Line Numbers */}
                  <div className="bg-gray-800 px-3 py-4 text-gray-500 text-xs font-mono select-none">
                    {codeSnippet.split("\n").map((_, i) => (
                      <div key={i} className="leading-5 text-right">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Code */}
                  <div className="flex-1 px-4 py-4 overflow-x-auto">
                    <pre className="text-xs font-mono leading-5">
                      <code>
                        <span className="text-purple-400">#include</span>{" "}
                        <span className="text-green-400">&lt;cmath&gt;</span>
                        {"\n"}
                        <span className="text-purple-400">#include</span>{" "}
                        <span className="text-green-400">&lt;cstdio&gt;</span>
                        {"\n"}
                        <span className="text-purple-400">#include</span>{" "}
                        <span className="text-green-400">&lt;vector&gt;</span>
                        {"\n"}
                        <span className="text-purple-400">#include</span>{" "}
                        <span className="text-green-400">&lt;iostream&gt;</span>
                        {"\n"}
                        <span className="text-purple-400">#include</span>{" "}
                        <span className="text-green-400">
                          &lt;algorithm&gt;
                        </span>
                        {"\n\n"}
                        <span className="text-purple-400">
                          using namespace
                        </span>{" "}
                        <span className="text-blue-400">std</span>;{"\n\n"}
                        <span className="text-blue-400">int</span>{" "}
                        <span className="text-yellow-300">solveMeFirst</span>
                        <span className="text-gray-300">(</span>
                        <span className="text-blue-400">int</span> a,{" "}
                        <span className="text-blue-400">int</span> b
                        <span className="text-gray-300">)</span> {"{"}
                        {"\n    "}
                        <span className="text-gray-500">
                          // Hint: Type return a+b; below:
                        </span>
                        {"\n    \n}"}
                        {"\n\n"}
                        <span className="text-blue-400">int</span>{" "}
                        <span className="text-yellow-300">main</span>
                        <span className="text-gray-300">()</span> {"{"}
                        {"\n    "}
                        <span className="text-blue-400">int</span> num1, num2;
                        {"\n    "}
                        <span className="text-blue-400">int</span> sum;
                        {"\n    "}
                        <span className="text-gray-300">
                          cin&gt;&gt;num1&gt;&gt;num2;
                        </span>
                        {"\n    "}
                        sum ={" "}
                        <span className="text-yellow-300">solveMeFirst</span>
                        (num1,num2);
                        {"\n    "}
                        <span className="text-gray-300">cout&lt;&lt;sum;</span>
                        {"\n    "}
                        <span className="text-purple-400">return</span> 0;
                        {"\n}"}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Run Button Bar */}
                <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 flex items-center justify-end">
                  <button className="flex items-center space-x-2 bg-[#0652e9] hover:bg-[#0547d1] text-white px-6 py-2 rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-[#0652e9]/30">
                    <Play className="w-4 h-4" fill="white" />
                    <span>Run Code</span>
                  </button>
                </div>
              </div>

              {/* Floating Success Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 hidden lg:block animate-bounce-slow">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Code Executed!
                    </p>
                    <p className="text-xs text-gray-600">Output: Success</p>
                  </div>
                </div>
              </div>

              {/* Floating Language Badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-xl border border-gray-200 px-4 py-2 hidden lg:block">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-[#0652e9]" />
                  <span className="text-sm font-semibold text-gray-900">
                    10+ Languages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CodeCompilerSection;

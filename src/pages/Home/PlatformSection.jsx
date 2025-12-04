import { ArrowRight, Code, Award, Book, Briefcase, CheckCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const PlatformSection = () => {
  const features = [
    {
      icon: Code,
      title: 'Code Compiler',
      description: 'Practice coding in 10+ languages with our powerful online compiler',
    },
    {
      icon: Book,
      title: 'Interview Preparation',
      description: 'Access 500+ real interview questions from top tech companies',
    },
    {
      icon: Award,
      title: 'Weekly Contests',
      description: 'Compete with developers worldwide and improve your ranking',
    },
    {
      icon: Briefcase,
      title: 'Land Your Dream Job',
      description: 'Get hired by top companies with proven coding skills',
    },
  ];

  const codeExample = `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int solveTwoSum(vector<int>& nums, int target) {
    // Write your solution here
    // Hint: Use hash map for O(n) solution
    
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    int result = solveTwoSum(nums, target);
    cout << "Result: " << result << endl;
    
    return 0;
}`;

  const stats = [
    { number: '100K+', label: 'Active Students' },
    { number: '500+', label: 'Coding Problems' },
    { number: '10+', label: 'Languages' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full mb-6 text-sm font-medium">
            KODECOMPILER PLATFORM
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Developers Build Skills 
            <br/>
            That Get Them Hired
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          {/* Left Side - Content */}
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Build your skills, boost your confidence, and land your dream job.
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Over 100,000 students have joined the KodeCompiler community to 
              practice coding, master algorithms, and prepare for technical interviews. 
              Our powerful code compiler and curated problem sets help you build 
              real-world skills that get you hired.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#0652e9] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-zinc-50" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <NavLink
              href="/learn-more"
              className="w-[200px] flex items-center justify-center gap-1 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl hover:bg-[#0547d1] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105 transform"
            >
              <span>Learn more</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>

          {/* Right Side - Code Editor Demo */}
          <div className="relative">
            {/* Main Code Editor Window */}
            <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm">Language</span>
                  <select className="bg-gray-700 text-white text-sm px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0652e9]">
                    <option>C++</option>
                    <option>Python</option>
                    <option>Java</option>
                    <option>JavaScript</option>
                  </select>
                  <button className="bg-[#0652e9] hover:bg-[#0547d1] text-white text-sm px-4 py-1 rounded transition-colors">
                    ▶ Run
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="flex">
                {/* Line Numbers */}
                <div className="bg-gray-800 px-4 py-4 text-gray-500 text-sm font-mono select-none">
                  {codeExample.split('\n').map((_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Code */}
                <div className="flex-1 px-4 py-4 overflow-x-auto">
                  <pre className="text-sm font-mono">
                    <code className="text-gray-300">
                      <span className="text-purple-400">#include</span>{' '}
                      <span className="text-green-400">&lt;iostream&gt;</span>
                      {'\n'}
                      <span className="text-purple-400">#include</span>{' '}
                      <span className="text-green-400">&lt;vector&gt;</span>
                      {'\n'}
                      <span className="text-purple-400">#include</span>{' '}
                      <span className="text-green-400">&lt;algorithm&gt;</span>
                      {'\n\n'}
                      <span className="text-purple-400">using namespace</span>{' '}
                      <span className="text-blue-400">std</span>;
                      {'\n\n'}
                      <span className="text-blue-400">int</span>{' '}
                      <span className="text-yellow-300">solveTwoSum</span>
                      <span className="text-gray-300">(</span>
                      <span className="text-blue-400">vector</span>
                      <span className="text-gray-300">&lt;</span>
                      <span className="text-blue-400">int</span>
                      <span className="text-gray-300">&gt;&amp;</span> nums,{' '}
                      <span className="text-blue-400">int</span> target
                      <span className="text-gray-300">)</span> {'{'}
                      {'\n  '}
                      <span className="text-gray-500">
                        // Write your solution here
                      </span>
                      {'\n  '}
                      <span className="text-gray-500">
                        // Hint: Use hash map for O(n) solution
                      </span>
                      {'\n  \n}'}
                      {'\n\n'}
                      <span className="text-blue-400">int</span>{' '}
                      <span className="text-yellow-300">main</span>
                      <span className="text-gray-300">()</span> {'{'}
                      {'\n  '}
                      <span className="text-blue-400">vector</span>
                      <span className="text-gray-300">&lt;</span>
                      <span className="text-blue-400">int</span>
                      <span className="text-gray-300">&gt;</span> nums = {'{'}2, 7, 11, 15{'}'};
                      {'\n  '}
                      <span className="text-blue-400">int</span> target = 9;
                      {'\n  \n  '}
                      <span className="text-blue-400">int</span> result ={' '}
                      <span className="text-yellow-300">solveTwoSum</span>
                      (nums, target);
                      {'\n  '}
                      <span className="text-gray-300">cout</span> &lt;&lt;{' '}
                      <span className="text-green-400">"Result: "</span> &lt;&lt; result &lt;&lt;{' '}
                      <span className="text-gray-300">endl</span>;
                      {'\n  \n  '}
                      <span className="text-purple-400">return</span> 0;
                      {'\n}'}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Output Panel */}
              <div className="border-t border-gray-700 bg-gray-800 px-6 py-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-xs font-medium">OUTPUT</span>
                </div>
                <pre className="text-green-400 font-mono text-sm">
                  Result: [0, 1]
                  {'\n'}
                  <span className="text-gray-500">Executed successfully in 0.05s</span>
                </pre>
              </div>
            </div>

            {/* Floating Badge - Desktop Only */}
            <div className="absolute -right-4 top-8 bg-white rounded-lg shadow-xl border border-gray-200 p-4 hidden lg:block">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Problem Solved!</p>
                  <p className="text-xs text-gray-600">+50 XP earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0652e9] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformSection;
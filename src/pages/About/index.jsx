import React from 'react';
import { 
  Terminal, 
  Cpu, 
  Code2, 
  Globe, 
  Zap, 
  Layout, 
  GitBranch, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import CTASection from '../../components/CtaSection';

const About = () => {
  // Stats emphasizing scale and technical reliability
  const stats = [
    { label: 'Submissions', value: '10M+', sub: 'Processed' },
    { label: 'Latency', value: '<50ms', sub: 'Execution time' },
    { label: 'Languages', value: '40+', sub: 'Supported' },
    { label: 'Hired', value: '15k+', sub: 'Developers' },
  ];

  // Features focusing on the "IDE" experience
  const features = [
    {
      icon: Terminal,
      title: "Browser-Based IDE",
      desc: "A full-featured Monaco editor environment with IntelliSense, debugging, and VIM mode support directly in your browser."
    },
    {
      icon: Cpu,
      title: "Real-time Execution",
      desc: "Code runs on isolated micro-VMs ensuring security and consistent runtime environments matching industry standards."
    },
    {
      icon: GitBranch,
      title: "System Design",
      desc: "Beyond algorithms. We provide interactive whiteboards and architecture diagrams to master system design interviews."
    }
  ];

  return (
    <div className="bg-white font-sans selection:bg-[#0652e9] selection:text-white">
      

      <div className="relative bg-gradient-to-b from-white to-gray-50 pt-20 pb-32 overflow-hidden">
        {/* Background Grid Pattern for Tech Vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-8">
            <span className="text-[#0652e9] text-sm font-medium flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Built by engineers, for engineers
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            From <span className="text-[#0652e9]">Hello World</span> to <br />
            your <span className="bg-gradient-to-r from-[#0652e9] to-blue-600 bg-clip-text text-transparent">Dream Job</span>.
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            We aren't just a question bank. We are a complete technical interview ecosystem designed to simulate real-world engineering challenges.
          </p>
        </div>
      </div>
      <div className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat, index) => (
              <div key={index} className="py-8 text-center group hover:bg-gray-50 transition-colors duration-300">
                <div className="text-4xl font-bold text-[#0652e9] mb-1 font-mono tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-gray-900">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Text Content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The gap between <br/>
                <span className="text-[#0652e9]">Algorithms</span> and <span className="text-[#0652e9]">Industry</span>.
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Traditional CS degrees teach you theory. Bootcamps teach you frameworks. But technical interviews test your ability to apply logic under pressure.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We built a platform that treats interview prep like a sport. You need a gym, a coach, and a scoreboard. We provide all three with our state-of-the-art compiler and curated problem sets.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['ACID compliant DBs', 'O(n) Complexity Focus', 'Unit Testing Suites', 'Mock Interviews'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0652e9]" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Abstract Code UI Graphic */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-xl bg-gray-900 p-2 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Window Controls */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-t-lg">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs text-gray-400 font-mono">solution.js</div>
                </div>
                {/* Code Content */}
                <div className="p-6 font-mono text-sm overflow-hidden">
                  <div className="text-purple-400">const <span className="text-blue-400">optimizeSolution</span> = <span className="text-yellow-300">(arr)</span> {`=> {`}</div>
                  <div className="pl-4 text-gray-400">// Time Complexity: O(n)</div>
                  <div className="pl-4 text-gray-400">// Space Complexity: O(1)</div>
                  <div className="pl-4 text-purple-400">let <span className="text-white">left</span> = <span className="text-orange-400">0</span>;</div>
                  <div className="pl-4 text-purple-400">let <span className="text-white">right</span> = <span className="text-white">arr.length</span> - <span className="text-orange-400">1</span>;</div>
                  <div className="pl-4 text-gray-500 my-2">...</div>
                  <div className="pl-4 text-purple-400">return <span className="text-green-400">"Hired"</span>;</div>
                  <div className="text-purple-400">{"};"}</div>
                  
                  {/* Floating Success Badge */}
                  <div className="absolute bottom-8 right-8 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Test Passed</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- TECH STACK / FEATURES --- 
          Cards matching the Home Page logic 
      */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Under the Hood</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We engineered a platform that keeps up with your speed of thought.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-xl p-8 hover:border-[#0652e9] hover:shadow-xl hover:shadow-[#0652e9]/10 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-[#0652e9]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <CTASection 
      title="Ready to compile your success?"
      para="Join the platform where the world's best developers sharpen their skills."
      />

    </div>
  );
};

export default About;
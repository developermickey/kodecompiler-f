import React from 'react';
import { Code2, Trophy, Users, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import GOOGLE from "../../assets/google.png";
import MICROSOFT from "../../assets/microsoft.png";
import ORACLE from "../../assets/oracle.png";
import UBER from "../../assets/uber.png";
import ATLASSIAN from "../../assets/atlassian.png";
import AMAZON from "../../assets/amazon.png";
import ADOBE from "../../assets/adobe.png";
import { useSelector } from 'react-redux';

const HeroSection = () => {
  const features = [
    { icon: Code2, text: '500+ Coding Problems' },
    { icon: Trophy, text: 'Weekly Contests' },
    { icon: Users, text: '100K+ Developers' },
    { icon: Zap, text: 'Real Interview Questions' },
  ];

  const user = useSelector((state)=>state.auth.user);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      <div className="absolute right-0 top-0 -z-10 h-full w-full bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
        
        {/* Main Hero Content */}
        <div className="text-center max-w-5xl mx-auto">
          
          {/* Animated Badge */}
          <div className="group relative inline-flex items-center gap-2 px-6 py-2 mb-8 bg-blue-50/50 border border-blue-100/50 rounded-full cursor-pointer hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[#0652e9] text-sm font-semibold tracking-wide">
              🚀 Join 10,000+ developers preparing for success
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-[1.1]">
            <span className="relative inline-block">
              Master
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span> the next generation <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#0652e9] via-blue-600 to-indigo-600 bg-clip-text text-transparent pb-2">
              coding interview
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            We help thousands of developers ace their coding interviews with 
            <span className="font-semibold text-gray-700"> real-world problems</span>, 
            <span className="font-semibold text-gray-700"> expert solutions</span>, and 
            <span className="font-semibold text-gray-700"> hands-on practice</span> from top tech companies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            {user? <a
              href="/editor"
              className="group relative w-full sm:w-auto px-8 py-4 bg-[#0652e9] text-white text-lg font-bold rounded-2xl hover:bg-[#0547d1] transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(6,82,233,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(6,82,233,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Start Practicing Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-[#0547d1]/50"></div>
            </a>:
            <a
              href="/register"
              className="group relative w-full sm:w-auto px-8 py-4 bg-[#0652e9] text-white text-lg font-bold rounded-2xl hover:bg-[#0547d1] transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(6,82,233,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(6,82,233,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Start Practicing Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-[#0547d1]/50"></div>
            </a>}
            
            {user?<></>:<a
              href="/guest-editor"
              className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 text-lg font-semibold rounded-2xl border border-gray-200 hover:border-blue-200 hover:text-[#0652e9] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              Try guest compiler
            </a>}
            
          </div>

          {/* Trust Indicators (Redesigned) */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500 mb-16 border-b border-gray-100 pb-12">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
              <div className="flex -space-x-1">
                 {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                 ))}
              </div>
              <span className="text-gray-700">4.8/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <span>Free forever plan</span>
            </div>
          </div>

          {/* Feature Cards with Glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl p-6 hover:border-blue-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#0652e9] group-hover:text-white transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-[#0652e9] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm md:text-base font-semibold text-gray-700 group-hover:text-gray-900">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Companies Section */}
          <div className="relative">
            <p className="text-sm text-gray-400 mb-8 uppercase tracking-[0.2em] font-bold">
              Trusted by developers at
            </p>
            
            {/* Scrolling Container */}
            <div className="relative overflow-hidden w-full group">
              {/* Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
              
              <div className="flex animate-scroll hover:[animation-play-state:paused] py-4">
                {/* Logo Set 1 */}
                <div className="flex items-center justify-around min-w-full px-8 gap-16 flex-shrink-0">
                  {[GOOGLE, MICROSOFT, ORACLE, UBER, ATLASSIAN, AMAZON, ADOBE].map((logo, idx) => (
                    <img key={idx} src={logo} alt="company logo" className="h-8 md:h-10 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110 object-contain cursor-pointer" />
                  ))}
                </div>
                
                {/* Logo Set 2 */}
                <div className="flex items-center justify-around min-w-full px-8 gap-16 flex-shrink-0">
                  {[GOOGLE, MICROSOFT, ORACLE, UBER, ATLASSIAN, AMAZON, ADOBE].map((logo, idx) => (
                    <img key={`dup-${idx}`} src={logo} alt="company logo" className="h-8 md:h-10 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110 object-contain cursor-pointer" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 35s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
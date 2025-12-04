import { Code2, Trophy, Users, Zap } from 'lucide-react';
import GOOGLE from "../../assets/google.png";
import MICROSOFT from "../../assets/microsoft.png";
import ORACLE from "../../assets/oracle.png";
import UBER from "../../assets/uber.png";
import ATLASSIAN from "../../assets/atlassian.png";
import AMAZON from "../../assets/amazon.png";
import ADOBE from "../../assets/adobe.png";
const HeroSection = () => {
  const features = [
    {
      icon: Code2,
      text: '500+ Coding Problems',
    },
    {
      icon: Trophy,
      text: 'Weekly Contests',
    },
    {
      icon: Users,
      text: '100K+ Developers',
    },
    {
      icon: Zap,
      text: 'Real Interview Questions',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <span className="text-[#0652e9] text-sm font-medium">
              🚀 Join 10,000+ developers preparing for success
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-[#0652e9]">Master</span> the next generation
            <br />
            <span className="bg-gradient-to-r from-[#0652e9] to-[#0652e9] bg-clip-text text-transparent">
              coding interview
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            We help thousands of developers ace their coding interviews with 
            real-world problems, expert solutions, and hands-on practice from 
            top tech companies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl hover:bg-[#0547d1] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105 transform"
            >
              Start practicing free
            </a>
            <a
              href="/guest-editor"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-[#0652e9] hover:text-[#0652e9] hover:bg-gray-50 transition-all duration-200"
            >
              Try guest compiler
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span>4.8/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Free forever plan</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#0652e9] transition-all duration-200 group"
              >
                <feature.icon className="w-8 h-8 text-[#0652e9] mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                <p className="text-sm md:text-base font-medium text-gray-900">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Companies Section */}
          <div className="mt-16 pt-12">
            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wide font-medium">
              Practice problems from top companies
            </p>
            
            {/* Scrolling Container with Fade Effect */}
            <div className="relative overflow-hidden ">
              {/* Left Fade */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
              
              {/* Right Fade */}
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrolling Animation Container */}
              <div className="flex animate-scroll mt-8">
                {/* First Set of Logos */}
                <div className="flex items-center justify-around min-w-full px-8 gap-12 flex-shrink-0">
                  <img src={GOOGLE} alt='' className="w-32 grayscale hover:grayscale-0 object-cover h-auto company-logo-filter" width={120} height={120} />
                  <img src={MICROSOFT} alt='' className="w-32 grayscale hover:grayscale-0 object-cover h-auto company-logo-filter" width={120} height={120}/>
                  <img src={ORACLE} alt='' className="w-32 grayscale hover:grayscale-0 object-cover h-auto company-logo-filter" width={120} height={120}/>
                  <img src={UBER} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                  <img src={ATLASSIAN} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                  <img src={AMAZON} alt='' className="w-32 grayscale hover:grayscale-0 object-cover h-auto company-logo-filter" width={120} height={120}/>
                  <img src={ADOBE} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                </div>
                
                {/* Duplicate Set for Seamless Loop */}
                <div className="flex items-center justify-around min-w-full px-8 gap-12 flex-shrink-0">
                  <img src={GOOGLE} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                  <img src={MICROSOFT} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                  <img src={ORACLE} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                  <img src={UBER} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                  <img src={ATLASSIAN} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                  <img src={AMAZON} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                  <img src={ADOBE} alt='' className="w-32 grayscale hover:grayscale-0 object-cover  h-auto company-logo-filter" width={120} height={120}/>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
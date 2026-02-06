import { Code2, Trophy, Users, Zap, ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  const features = [
    { icon: Code2, text: '500+ Coding Problems', sub: 'From Easy to Hard' },
    { icon: Trophy, text: 'Weekly Contests', sub: 'Global Leaderboards' },
    { icon: Users, text: '100K+ Developers', sub: 'Active Community' },
    { icon: Zap, text: 'Real Interview Qs', sub: 'FAANG Verified' },
  ];

  
  
  return (
    <section className="relative bg-white py-20 lg:py-32 overflow-hidden">
      
      {/* --- ACETERNITY UI GRID BACKGROUND START --- */}
      <div className="absolute inset-0 h-full w-full bg-white">
        {/* 1. The Grid Layer: 
            We use two linear gradients to create the vertical and horizontal lines.
            Changed color to #80808012 (very light gray) for subtle visibility.
            Size set to 24px squares.
        */}
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* 2. The Mask Layer:
            This radial gradient hides the harsh edges of the grid.
            It makes the grid visible in the center top and fades out to white at the bottom/sides.
        */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#0652e9] opacity-20 blur-[100px]"></div>
      </div>
       {/* --- ACETERNITY UI GRID BACKGROUND END --- */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO CONTENT */}
        <div className="text-center max-w-5xl mx-auto pt-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full mb-8 cursor-pointer hover:bg-blue-100 transition-colors group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide">New: System Design Course Live</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
            Master the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0652e9] via-blue-600 to-indigo-600">
              Technical Interview
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 100,000+ developers using our battle-tested curriculum to crack interviews at top tech companies. Code, compile, and conquer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-[#0652e9] text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-500/20 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start Practicing Free
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/guest-editor"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 text-lg font-bold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Try Code Editor
            </a>
          </div>

          {/* Feature Grid (Glass Effect with Blur) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-[#0652e9] transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-[#0652e9] group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="font-bold text-gray-900">{feature.text}</p>
                <p className="text-sm text-gray-500">{feature.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TRUST SECTION: Infinite Scroll with INLINE SVGs */}
        <div className="border-t border-gray-100 pt-10 relative z-10">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
            Hired by engineering teams at
          </p>
          
          <div className="relative overflow-hidden w-full mask-linear-fade">
             {/* Left/Right Fade Masks */}
             <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
             <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

             {/* The Marquee */}
             <div className="flex w-max animate-scroll">
               <LogoSet />
               <LogoSet />
             </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

// Sub-component for clean code: The SVG Logos
const LogoSet = () => (
  <div className="flex items-center gap-16 px-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
    <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
    <svg className="h-8 w-auto" viewBox="0 0 23 23" fill="currentColor">
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H12z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
    <svg className="h-8 w-auto text-gray-900" viewBox="0 0 100 30" fill="currentColor">
       <path d="M13.7 16.6c-2.9 2.1-4.7 4.9-4.7 7.7 0 3.8 3.1 5.4 6.7 5.4 3.7 0 6.1-2.1 7.2-5.7h.2v5.3h3.7V11.2c0-5-2.7-7.6-7.8-7.6-4.4 0-7.3 2.1-7.8 5.7h3.8c.4-1.6 1.8-2.5 3.9-2.5 2.1 0 3.8 1.1 3.8 3.5v.9c-6.8.2-12.7 1.8-12.7 7.3 0 1.9.5 3.1 1.5 3.1zm6-6.6l.3 4.2c-.8 1.6-2.3 2.6-4.3 2.6-1.6 0-2.8-.8-2.8-2.4 0-2.2 2.8-3.6 6.8-4.4zm16.5-6.3h-4.2v19h4.2V22.7zM69 22.7h4.2v-8.4c0-2.2 1.2-3.4 3.1-3.4.6 0 1.1.1 1.6.3l.2.1 1.2-3.8-.2-.1c-.6-.2-1.3-.3-2.1-.3-2.6 0-4.6 1.6-5.4 4.1h-.2V11.2H69v11.5z" />
       <path d="M51.1 23c4 0 6.6-3 7.3-6.6h-4c-.5 1.7-1.8 3-3.3 3-2.3 0-3.9-1.8-3.9-4.7 0-2.9 1.6-4.7 3.9-4.7 1.5 0 2.8 1.2 3.3 3h4c-.7-3.6-3.3-6.6-7.3-6.6-4.7 0-8.2 3.6-8.2 8.3 0 4.7 3.5 8.3 8.2 8.3z" />
    </svg>
    <svg className="h-6 w-auto text-black" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.6c-5.3 0-9.6-4.3-9.6-9.6S6.7 2.4 12 2.4s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm0-20.4C6 1.2 1.2 6 1.2 12S6 22.8 12 22.8 22.8 18 22.8 12 18 1.2 12 1.2zm6.6 9.6h-2.4v4.8h-2.4V8.4H9V18H6.6V6h12v4.8z"/>
    </svg>
    <svg className="h-5 w-auto text-[#C74634]" viewBox="0 0 100 24" fill="currentColor">
      <path d="M12.3 2.1H.5v19.8h11.8c6.6 0 11.2-4.5 11.2-10S18.9 2.1 12.3 2.1zM12 18.2H4.4V5.8H12c4.1 0 7.2 2.7 7.2 6.2 0 3.5-3.1 6.2-7.2 6.2zM33.8 2.1h-7.6v19.8h3.9v-7.9h3.7l4.3 7.9h4.5l-4.9-8.4c2.8-.7 4.5-2.8 4.5-5.7 0-3.3-2.6-5.7-8.4-5.7zm-.3 8.5h-3.4V5.8h3.4c1.8 0 3.1 1 3.1 2.4s-1.3 2.4-3.1 2.4z"/>
    </svg>
    <svg className="h-7 w-auto text-[#635BFF]" viewBox="0 0 60 25" fill="currentColor">
      <path d="M9.9 10.4c0-1.2.9-2 2.6-2 1.1 0 2.2.3 3 .8l.8-3.4C15.2 5.3 13.9 5 12.5 5 8.2 5 5 7.2 5 10.7c0 4.8 6.5 4 6.5 6.1 0 .6-.7 1-1.8 1-1.4 0-3-.5-4.1-1.3l-.9 3.5c1.3.8 2.9 1.2 4.6 1.2 4.6 0 7.6-2.2 7.6-5.7.1-4.8-6.5-4-6.5-6.1h-.5zM24 6.5h-4.6V12c0 1.8 1.2 2.1 2.3 2.1.8 0 1.3-.1 1.7-.2v-3.7h.6v7.3c-.9.2-2.1.4-3.2.4-3.5 0-5.8-1.7-5.8-5.7V6.5H12V3h3V.3l4.5-.9V3H24v3.5z"/>
    </svg>
  </div>
);

export default HeroSection;
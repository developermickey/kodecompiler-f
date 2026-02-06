import { ArrowRight, CheckCircle, Star, Briefcase, Building2, User } from "lucide-react";

const InterviewExperience = () => {
  const features = [
    "Community-Submitted Real Stories",
    "Insights from Top Tech Companies",
    "Step-by-Step Breakdown of Rounds",
    "Tips, Strategies, and Common Mistakes",
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <div className="order-2 lg:order-1 relative z-10">
            <span className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full mb-6 text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Interview Experience
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Don't just practice. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0652e9] to-blue-500">
                Learn from the winners.
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Read detailed breakdowns of real interview rounds at MAANG and high-growth startups. 
              Find out exactly what questions were asked and how successful candidates answered them.
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
              href="/learn-more"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1"
            >
              Read Experiences
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* RIGHT CONTENT: CSS UI CONSTRUCTION */}
          <div className="order-1 lg:order-2 relative perspective-1000">
            
            {/* Background Decor Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0652e9]/5 rounded-full blur-3xl" />
            
            {/* The "Card Stack" Visualization */}
            <div className="relative w-full max-w-md mx-auto">
              
              {/* Back Card (Background Context) */}
              <div className="absolute top-0 left-8 right-8 bg-gray-100 rounded-2xl h-64 transform -translate-y-12 scale-90 opacity-60 border border-gray-200" />
              <div className="absolute top-0 left-4 right-4 bg-gray-50 rounded-2xl h-64 transform -translate-y-6 scale-95 opacity-80 border border-gray-200 shadow-sm" />

              {/* Main Card (Hero UI) */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                
                {/* Card Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">SDE II Interview</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>Amazon</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full"/>
                        <span>Seattle</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Offer Accepted
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-6">
                  {/* Stats Row */}
                  <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Rounds</p>
                      <p className="text-xl font-bold text-gray-900">4</p>
                    </div>
                    <div className="text-center border-l border-gray-100 pl-6">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Difficulty</p>
                      <div className="flex text-yellow-400 mt-1">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                    <div className="text-center border-l border-gray-100 pl-6">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Compensation</p>
                      <p className="text-xl font-bold text-gray-900">$180k+</p>
                    </div>
                  </div>

                  {/* Snippet Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Briefcase className="w-4 h-4 text-[#0652e9]" />
                      <span>System Design Round</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        "The interviewer asked me to design a URL shortener like bit.ly. We focused heavily on the database schema and handling high concurrency..."
                      </p>
                    </div>
                  </div>

                  {/* User Profile */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                         <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">Alex Chen</p>
                        <p className="text-gray-500 text-xs">Posted 2 days ago</p>
                      </div>
                    </div>
                    <span className="text-[#0652e9] text-sm font-medium hover:underline cursor-pointer">
                      Read full story
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge (Decorative) */}
              <div className="absolute -right-4 top-20 bg-white p-3 rounded-lg shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce duration-[3000ms]">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                  <p className="text-sm font-bold text-gray-900">Hired</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InterviewExperience;
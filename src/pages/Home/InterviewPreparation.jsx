import { ArrowRight, CheckCircle, Lock, Play, Code, Brain, MessageSquare } from "lucide-react";

const InterviewPreparation = () => {
  const features = [
    "1500+ Real Interview Questions",
    "Step-by-Step Explanations",
    "Real-Time Code Execution",
    "Covers All Interview Rounds",
  ];

  const roadmapSteps = [
    {
      title: "Online Assessment",
      subtitle: "Arrays, Strings & HashMaps",
      status: "completed",
      icon: Code,
    },
    {
      title: "Technical Round I",
      subtitle: "Trees, Graphs & DP",
      status: "completed",
      icon: Brain,
    },
    {
      title: "System Design",
      subtitle: "Scalability & HLD/LLD",
      status: "active", // This is the current focus
      icon: MessageSquare,
    },
    {
      title: "HR & Offer Negotiation",
      subtitle: "Behavioral & Salary",
      status: "locked",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="order-2 lg:order-1 relative z-10">
            <span className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full mb-6 text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Interview Roadmap
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Prepare Smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0652e9] to-blue-500">
                Land the Offer.
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Don't practice randomly. Follow a structured path designed by FAANG engineers. 
              From the first coding challenge to the final system design round, we guide 
              you through every step of the interview lifecycle.
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
              href="/roadmap"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* RIGHT CONTENT: CSS ROADMAP UI */}
          <div className="order-1 lg:order-2 relative perspective-1000">
            
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0652e9]/5 rounded-full blur-3xl" />

            {/* The Dashboard Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
              
              {/* Header */}
              <div className="bg-gray-900 p-6 flex justify-between items-center border-b border-gray-800">
                <div>
                   <h3 className="text-white font-bold text-lg">My Learning Path</h3>
                   <p className="text-gray-400 text-sm">Target: Senior SDE @ Google</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center">
                   <span className="text-green-400 font-bold text-xs">75%</span>
                </div>
              </div>

              {/* Roadmap List */}
              <div className="p-8 relative">
                {/* Vertical Connector Line */}
                <div className="absolute left-[3.25rem] top-10 bottom-10 w-0.5 bg-gray-100" />

                <div className="space-y-8 relative">
                  {roadmapSteps.map((step, index) => (
                    <div key={index} className={`flex items-center gap-4 group ${step.status === 'locked' ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                      
                      {/* Icon Bubble */}
                      <div className={`
                        relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-110
                        ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}
                        ${step.status === 'active' ? 'bg-[#0652e9] text-white' : ''}
                        ${step.status === 'locked' ? 'bg-gray-200 text-gray-400' : ''}
                      `}>
                        {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                        
                        {/* Pulse effect for active item */}
                        {step.status === 'active' && (
                          <span className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 animate-ping"></span>
                        )}
                      </div>

                      {/* Content Box */}
                      <div className={`
                        flex-1 p-4 rounded-xl border transition-all duration-300
                        ${step.status === 'active' ? 'bg-blue-50 border-blue-200 shadow-sm translate-x-2' : 'bg-white border-gray-100'}
                      `}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-bold ${step.status === 'active' ? 'text-[#0652e9]' : 'text-gray-900'}`}>
                              {step.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
                          </div>
                          
                          {/* Action Button/Status */}
                          {step.status === 'active' && (
                             <button className="bg-[#0652e9] text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors">
                               Resume <Play className="w-3 h-3 fill-current" />
                             </button>
                          )}
                          {step.status === 'locked' && <Lock className="w-4 h-4 text-gray-300" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Stat Card (Gamification) */}
              <div className="absolute top-24 right-6 bg-white p-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 animate-float hidden md:block">
                 <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Trophy className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Preparation Score</p>
                      <p className="text-lg font-bold text-gray-900">Top 5%</p>
                    </div>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// Helper component for the trophy icon
const Trophy = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

export default InterviewPreparation;
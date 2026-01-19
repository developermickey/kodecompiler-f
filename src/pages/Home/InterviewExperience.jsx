import { ArrowRight, CheckCircle } from "lucide-react";
import Interview_experience from "../../assets/interview_experience.svg";

const InterviewExperience = () => {
  const features = [
    "Community-Submitted Real Stories",
    "Insights from Top Tech Companies",
    "Step-by-Step Breakdown of Rounds",
    "Tips, Strategies, and Common Mistakes",
  ];

  return (
    <>
      {/* Floating animation (local to this component) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT CONTENT */}
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full mb-6 text-sm font-medium">
                Interview Experience
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Real Interview Experiences Shared by Developers
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                Learn from the journeys of candidates who have interviewed at top
                tech companies. Explore real interview stories, challenges,
                strategies, and mistakes that helped them grow. Gain insights
                into what companies look for, how interviews are structured, and
                how you can prepare more effectively for your own opportunities.
              </p>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0652e9] mt-1" />
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>

              <a
                href="/learn-more"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105"
              >
                Learn more
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* RIGHT IMAGE */}
            <div className="order-1 lg:order-2">
              <div className="relative">

                {/* Glow shadow */}
                <div className="absolute -inset-6 bg-[#0652e9]/25 blur-3xl rounded-2xl" />

                {/* Floating image container */}
                <div className="relative animate-float bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/40">
                  <img
                    src={Interview_experience}
                    alt="Community sharing interview experiences and stories"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />

                  {/* Depth overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 text-center lg:text-left">
                Real stories from developers who cleared interviews at FAANG and top tech companies
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewExperience;

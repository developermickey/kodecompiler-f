import { ArrowRight, Code, Award, Book, Briefcase, CheckCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import platform_section_image from "../../assets/platform_section_image.svg";

const PlatformSection = () => {
  const features = [
    {
      icon: Code,
      title: "Code Compiler",
      description: "Practice coding in 10+ languages with our powerful online compiler",
    },
    {
      icon: Book,
      title: "Interview Preparation",
      description: "Access 500+ real interview questions from top tech companies",
    },
    {
      icon: Award,
      title: "Weekly Contests",
      description: "Compete with developers worldwide and improve your ranking",
    },
    {
      icon: Briefcase,
      title: "Land Your Dream Job",
      description: "Get hired by top companies with proven coding skills",
    },
  ];

  const stats = [
    { number: "100K+", label: "Active Students" },
    { number: "500+", label: "Coding Problems" },
    { number: "10+", label: "Languages" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <>
      {/* Local animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full mb-6 text-sm font-medium">
              KODECOMPILER PLATFORM
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
              Where Developers Build Skills
              <br />
              That Get Them Hired
            </h2>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">

            {/* Left Content */}
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Build your skills, boost your confidence, and land your dream job.
              </h3>

              <p className="text-lg text-gray-600 mb-8">
                Over 100,000 students have joined the KodeCompiler community to
                practice coding, master algorithms, and prepare for technical interviews.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[#0652e9]/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-[#0652e9] stroke-[2.5]" />
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
                to="/learn-more"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0652e9] text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0652e9]/30 hover:scale-105"
              >
                Learn more
                <ArrowRight className="w-5 h-5" />
              </NavLink>
            </div>

            {/* Right Image */}
            <div className="relative">
              {/* Glow shadow */}
              <div className="absolute -inset-6 bg-[#0652e9]/25 blur-3xl rounded-2xl" />

              {/* Floating image */}
              <div className="relative animate-float bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/40">
                <img
                  src={platform_section_image}
                  alt="KodeCompiler platform interface"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
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
    </>
  );
};

export default PlatformSection;

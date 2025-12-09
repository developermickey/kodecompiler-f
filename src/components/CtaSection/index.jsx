import { ArrowRight } from 'lucide-react';
import CTAIMG from "../../assets/img-cta-option-bgr.png"
import { NavLink } from 'react-router-dom';

const CTASection = ({title, para}) => {
  return (
    <div className="relative bg-gradient-to-br from-[#0652e9] via-[#0547d1] to-[#0652e9] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-end pb-0">
          {/* Left Content */}
          <div className="text-white pt-16 md:pt-20 lg:pt-24 pb-8 lg:pb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
             {title} 
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed max-w-xl">
              {para} </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <NavLink
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0652e9] rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NavLink>
              <NavLink
                to="/guest-editor"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white hover:text-[#0652e9] transition-all duration-200"
              >
                Try Guest Compiler
              </NavLink>
            </div>
          </div>

          {/* Right Side - PNG Image touching bottom */}
         <div className="hidden lg:flex relative items-end justify-center lg:justify-end">
            <img
              src={CTAIMG}
              alt="Developer coding illustration"
              className="w-full h-[550px] max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
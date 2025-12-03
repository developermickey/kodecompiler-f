import { useState } from 'react';
import { ChevronDown, Link } from 'lucide-react';
import LOGO from "../../assets/logo.png"
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200"
          >
            <img src={LOGO} alt='Kode Compiler'className='mt-0 w-10' />
            <span>KodeCompiler</span>
          </NavLink>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 flex-1 justify-center">
            <div className="relative group">
              <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 flex items-center">
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                <NavLink to="/guest-editor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                  <span className="font-medium">Guest-Compiler</span>
                  <p className="text-xs text-gray-500 mt-0.5">Code without signing up</p>
                </NavLink>
                <NavLink to="/problems" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="font-medium">Arena</span>
                  <p className="text-xs text-gray-500 mt-0.5">Practice problems</p>
                </NavLink>
              </div>
            </div>

            <div className="relative group">
              <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 flex items-center">
                Solutions
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                <NavLink to="/weekly-challenges" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="font-medium">Contests</span>
                  <p className="text-xs text-gray-500 mt-0.5">Weekly challenges</p>
                </NavLink>
                <NavLink to="/interview-experiences" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="font-medium">Interviews</span>
                  <p className="text-xs text-gray-500 mt-0.5">Real experiences</p>
                </NavLink>
              </div>
            </div>

            <NavLink
              to="/about-us"
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              About Us
            </NavLink>
            <NavLink
              to="/pricing"
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              Pricing
            </NavLink>
            <NavLink
              to="https://interview.kodecompiler.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              For Recruiters
            </NavLink>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border border-gray-300"
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200 shadow-sm"
            >
              Create a free account
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300 transition-colors duration-200"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span 
                className={`h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span 
                className={`h-0.5 w-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span 
                className={`h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100">
          {/* Products Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown('products')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              Products
              <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${openDropdown === 'products' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${openDropdown === 'products' ? 'max-h-40' : 'max-h-0'}`}>
              <NavLink to="/guest-editor" className="block px-6 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md ml-3 my-1">
                Guest-Compiler
              </NavLink>
              <NavLink to="/problems" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md ml-3 my-1">
                Arena
              </NavLink>
            </div>
          </div>

          {/* Solutions Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown('solutions')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              Solutions
              <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${openDropdown === 'solutions' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${openDropdown === 'solutions' ? 'max-h-40' : 'max-h-0'}`}>
              <NavLink to="/weekly-challenges" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md ml-3 my-1">
                Contests
              </NavLink>
              <NavLink to="/interview-experiences" className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md ml-3 my-1">
                Interviews
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/about-us"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
          >
            About Us
          </NavLink>
          <NavLink
            to="/pricing"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
          >
            Pricing
          </NavLink>
          <NavLink
            to="https://interview.kodecompiler.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
          >
            For Recruiters
          </NavLink>

          {/* Mobile CTA Buttons */}
          <div className="pt-4 space-y-2 border-t border-gray-100 mt-4">
            <NavLink
              to="/login"
              className="block w-full px-4 py-2.5 rounded-lg text-center text-base font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-300"
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className="block w-full px-4 py-2.5 rounded-lg text-center text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200 shadow-sm"
            >
              Create a free account
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar
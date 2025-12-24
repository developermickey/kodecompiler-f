import { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  User,
  Settings,
  Lock,
  Bell,
  HelpCircle,
  Moon,
  LogOut,
  Rocket,
} from "lucide-react";
import LOGO from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
  const toggleMobileDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = async () => {
  await dispatch(logoutUser());
  window.location.href = '/login';
};


  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MAIN HEADER */}
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <NavLink
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            <img
              src={LOGO}
              alt="KodeCompiler"
              className="w-10 h-10 object-contain"
            />
            <span>KodeCompiler</span>
          </NavLink>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center z-50">
            {/* PRODUCTS */}
            <div className="relative group">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1 rounded-md transition-all">
                Products <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                {user ? (
                  <NavLink
                    to="/compiler"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <span className="font-medium">Compiler</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Code your way to your dream company
                    </p>
                  </NavLink>
                ) : (
                  <NavLink
                    to="/guest-editor"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <span className="font-medium">Guest-Compiler</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Code without signing up
                    </p>
                  </NavLink>
                )}
                <NavLink
                  to="/problems"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Arena</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Practice problems
                  </p>
                </NavLink>
              </div>
            </div>

            {/* SOLUTIONS */}
            <div className="relative group">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1 rounded-md transition-all">
                Solutions <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                <NavLink
                  to="/weekly-challenges"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Contests</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Weekly challenges
                  </p>
                </NavLink>
                <NavLink
                  to="/interview-experiences"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Interviews</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Real experiences
                  </p>
                </NavLink>
              </div>
            </div>

            <NavLink
              to="/about-us"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-all"
            >
              About Us
            </NavLink>

            {/* <NavLink
              to="https://interview.kodecompiler.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-all"
            >
              For Recruiters
            </NavLink> */}

            <NavLink
              to="https://interview.kodecompiler.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg hover:scale-105 rounded-full transition-all duration-300"
            >
              <span>For Recruiters</span>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </NavLink>
          </div>

          {/* RIGHT SIDE AUTH / PROFILE */}
          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-[#0652e9] hover:bg-[#0547d1] shadow-sm transition-all"
                >
                  Create Account
                </NavLink>
              </>
            ) : (
              <div className="relative">
                {/* PROFILE AVATAR */}
                <div
                  onClick={toggleDropdown}
                  className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold cursor-pointer shadow-md ring-2 ring-blue-200 hover:ring-blue-400 transition-all"
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>

                {/* DROPDOWN */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                    {/* HEADER */}
                    <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-t-2xl border-b border-gray-200">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center text-gray-800 text-lg font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {user.username}
                        </h4>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {/* OPTIONS */}
                    <div className="py-2">
                      <NavLink
                        to="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={18} /> Account
                      </NavLink>
                      <NavLink
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={18} /> Settings
                      </NavLink>
                      <NavLink
                        to="/privacy"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Lock size={18} /> Privacy
                      </NavLink>
                      <NavLink
                        to="/notifications"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Bell size={18} /> Notifications
                      </NavLink>
                      <NavLink
                        to="/help"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <HelpCircle size={18} /> Help Center
                      </NavLink>

                      {/* DARK MODE TOGGLE */}
                      <div className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700">
                        <div className="flex items-center gap-3">
                          <Moon size={18} /> Dark Mode
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-[#0652e9] transition-all"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                        </label>
                      </div>

                      <hr className="border-gray-200 my-2" />

                      <NavLink
                        to="/upgrade"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Rocket size={18} /> Upgrade to PRO
                      </NavLink>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300 transition-all duration-200"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white border-t border-gray-100">
          {/* Products Dropdown */}
          <div>
            <button
              onClick={() => toggleMobileDropdown("products")}
              className="w-full flex items-center justify-between px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
            >
              Products
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  openDropdown === "products" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openDropdown === "products" ? "max-h-32" : "max-h-0"
              }`}
            >
              <NavLink
                to="/guest-editor"
                className="block px-6 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md ml-3 my-1 font-medium"
              >
                Guest-Compiler
              </NavLink>
              <NavLink
                to="/problems"
                className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md ml-3 my-1 font-medium"
              >
                Arena
              </NavLink>
            </div>
          </div>

          {/* Solutions Dropdown */}
          <div>
            <button
              onClick={() => toggleMobileDropdown("solutions")}
              className="w-full flex items-center justify-between px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
            >
              Solutions
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  openDropdown === "solutions" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openDropdown === "solutions" ? "max-h-32" : "max-h-0"
              }`}
            >
              <NavLink
                to="/weekly-challenges"
                className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md ml-3 my-1 font-medium"
              >
                Contests
              </NavLink>
              <NavLink
                to="/interview-experiences"
                className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md ml-3 my-1 font-medium"
              >
                Interviews
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/about-us"
            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
          >
            About Us
          </NavLink>

          <NavLink
            to="https://interview.kodecompiler.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg hover:scale-105 rounded-full transition-all duration-300"
          >
            <span>For Recruiters</span>
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </NavLink>

          {!user ? (
            <div className="pt-4 space-y-3 border-t border-gray-100">
              <NavLink
                to="/login"
                className="block w-full px-4 py-3 rounded-xl text-center text-base font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-300 shadow-sm"
              >
                Log In
              </NavLink>
              <NavLink
                to="/register"
                className="block w-full px-4 py-3 rounded-xl text-center text-base font-semibold text-white bg-[#0652e9] hover:bg-[#0547d1] transition-all duration-200 shadow-lg"
              >
                Create Account
              </NavLink>
            </div>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full px-3 py-3 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 text-left border-b border-gray-100"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { loginUser, googleLogin, clearMessages } from '../../redux/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success, user } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/welcome');
    }
  }, [user, navigate]);

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Handle successful login
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/welcome');
      }, 1000);
    }
  }, [success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  // Format error message based on status
  const getErrorMessage = () => {
    if (!error) return '';

    const detail = error.detail || '';
    const detailLower = detail.toLowerCase();

    if (error.status === 403 && detailLower.includes('verify')) {
      return '📧 <strong>Email Not Verified!</strong><br>Please verify your email to login.';
    } else if (error.status === 429) {
      return '🔒 <strong>Too many attempts!</strong><br>Please try again later.';
    } else if (error.status === 401 && (detailLower.includes('not found') || detailLower.includes('not registered'))) {
      return '🆕 <strong>This email is not registered!</strong><br><a href="/register" style="color: #0652e9; text-decoration: underline; font-weight: 600;">Click here to Sign Up →</a>';
    } else if (detail) {
      return detail;
    }
    return 'Login failed. Please try again.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-red-700" dangerouslySetInnerHTML={{ __html: getErrorMessage() }} />
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start space-x-3 animate-slide-down">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-700">
                  <strong>Login successful!</strong><br />
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6">

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-0 h-5 w-5 text-gray-400 ml-3 my-auto pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0652e9] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 h-5 w-5 text-gray-400 ml-3 my-auto pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0652e9] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <NavLink
                to="/forgot-password"
                className="text-sm font-medium text-[#0652e9] hover:text-[#0547d1] transition-colors"
              >
                Forgot Password?
              </NavLink>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#0652e9] hover:bg-[#0547d1] hover:shadow-lg hover:shadow-[#0652e9]/30 hover:scale-105 transform'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center space-x-3"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </button>

          {/* OTP Login */}
          <NavLink
            to="/login-otp"
            className="mt-4 w-full py-3 px-4 border border-[#0652e9] rounded-lg font-medium text-[#0652e9] hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
          >
            <span>🔐</span>
            <span>Login with OTP (Email)</span>
          </NavLink>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <NavLink to="/register" className="font-semibold text-[#0652e9] hover:text-[#0547d1] transition-colors">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>

      {/* Slide Animation */}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, googleLogin, clearMessages } from '../../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { isLoading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Clear Redux messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Redirect after successful registration
  useEffect(() => {
    if (success) {
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'password' && passwordError) {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    // Password validation
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    dispatch(registerUser(formData));
  };

  const handleGoogleSignup = () => {
    dispatch(googleLogin());
  };

  const getErrorMessage = () => {
    if (!error) return null;
    const detail = error.detail || error.message || "Registration failed. Please try again.";
    
    return (
      <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-sm text-red-700 font-medium">{detail}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="bg-white w-full max-w-[440px] shadow-xl rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300">
        
        {/* --- Header --- */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Join thousands of developers today
          </p>
        </div>

        <div className="px-8 pb-8">

          {/* Messages */}
          {getErrorMessage()}
          
          {passwordError && (
             <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
               <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
               <div className="text-sm text-yellow-700 font-medium">{passwordError}</div>
             </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-sm text-green-700 font-medium">
                Registration successful! Redirecting...
              </p>
            </div>
          )}

          {/* --- FORM --- */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0652e9] hover:bg-[#0547d1] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>

          </form>

          {/* --- Common Footer --- */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              type="button"
              className="mt-6 w-full bg-white border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 text-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <NavLink to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Sign in
              </NavLink>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, Loader2, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Clear Redux messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Redirect after successful registration
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error on type
    if (e.target.name === 'password') {
      if (passwordError) setPasswordError('');
      calculateStrength(e.target.value);
    }
  };

  // Simple Password Strength Logic
  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return setPasswordStrength(0);
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    setPasswordStrength(score);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

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
    const detail = error.detail || error.message || "Registration failed.";
    return (
      <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-sm text-red-700 font-medium">{detail}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* --- LEFT SIDE: Feature/Marketing (Hidden on Mobile) --- */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        {/* Brand */}
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-[#0652e9] rounded-lg flex items-center justify-center">
            <span className="text-white font-mono text-lg">K</span>
          </div>
          KodeCompiler
        </div>

        {/* Testimonial / Social Proof */}
        <div className="relative z-10 max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Join the community of top 1% developers.
            </h2>
            <p className="text-gray-400 text-lg">
              Master algorithms, compete in weekly contests, and get hired by your dream company.
            </p>
          </div>

          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <div className="flex gap-1 text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-gray-200 italic mb-4">
              "This platform completely changed how I prepare for interviews. The compiler is fast, and the community is incredibly supportive."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400"></div>
              <div>
                <p className="font-bold text-sm">Alex Chen</p>
                <p className="text-xs text-gray-400">Software Engineer @ Google</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-sm text-gray-500">
          © 2024 KodeCompiler Inc.
        </div>
      </div>

      {/* --- RIGHT SIDE: Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p className="text-gray-600">Enter your details below to create your account</p>
          </div>

          {getErrorMessage()}
          
          {passwordError && (
             <div className="mb-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
               <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
               <div className="text-sm text-yellow-700 font-medium">{passwordError}</div>
             </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-sm text-green-700 font-medium">Account created! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0652e9] transition-colors" />
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0652e9]/20 focus:border-[#0652e9] outline-none transition-all text-sm font-medium"
                  placeholder="johndoe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0652e9] transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0652e9]/20 focus:border-[#0652e9] outline-none transition-all text-sm font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0652e9] transition-colors" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0652e9]/20 focus:border-[#0652e9] outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="flex gap-1 mt-2 h-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= level 
                          ? level <= 2 ? 'bg-red-400' : level === 3 ? 'bg-yellow-400' : 'bg-green-500'
                          : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Confirm Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0652e9] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0652e9]/20 focus:border-[#0652e9] outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0652e9] hover:bg-[#0547d1] text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-3 text-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <NavLink to="/login" className="font-bold text-[#0652e9] hover:text-blue-700 transition-colors">
              Log in
            </NavLink>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
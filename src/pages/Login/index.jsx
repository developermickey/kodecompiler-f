import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, 
  CheckCircle, AlertCircle, Edit2, KeyRound, ShieldAlert,
  Zap, Code2, Globe
} from 'lucide-react';
import { 
  loginUser, 
  googleLogin, 
  getOTP, 
  verifyOTP, 
  clearMessages 
} from '../../redux/slices/authSlice';

const Login = ({ isModal = false, wallTitle = "", wallMessage = "" }) => {
  const [authMethod, setAuthMethod] = useState('password'); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success, user, otpSent, verifyingOTP } = useSelector((state) => state.auth);

  const isBusy = isLoading || verifyingOTP;

  // --- LOGIC ---
  useEffect(() => {
    if (user && !isModal) {
      navigate('/welcome');
    }
  }, [user, navigate, isModal]);

  useEffect(() => {
    return () => { dispatch(clearMessages()); };
  }, [dispatch]);

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  const handleOtpRequest = (e) => {
    e.preventDefault();
    if (otpSent) {
      dispatch(verifyOTP({ email: otpEmail, otp: otpCode }));
    } else {
      dispatch(getOTP({ email: otpEmail }));
    }
  };

  const handleEditOtpEmail = () => {
    // We can dispatch a reset action here if Redux supports it, 
    // or just reload for simplicity as per original logic, 
    // but ideally we just reset local state if the backend allows.
    window.location.reload(); 
  };

  const getErrorMessage = () => {
    if (!error) return null;
    const detail = error.detail || error.message || 'Authentication failed';
    return (
      <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-sm text-red-700 font-medium">{detail}</div>
      </div>
    );
  };

  // --- UI HELPERS ---
  const displayTitle = wallTitle 
    ? wallTitle 
    : 'Welcome back';

  const displaySubtitle = wallMessage 
    ? wallMessage 
    : 'Enter your credentials to access your account';

  // --- RENDER CONTENT (Reused for both Modal and Page layouts) ---
  const LoginFormContent = () => (
    <div className="w-full max-w-[400px] mx-auto">
      
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        {wallTitle ? (
           <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-full mb-4">
             <ShieldAlert className="w-8 h-8" />
           </div>
        ) : null}
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{displayTitle}</h2>
        <p className="text-gray-600">{displaySubtitle}</p>
      </div>

      {/* Method Tabs */}
      <div className="mb-8 p-1 bg-gray-100/80 rounded-xl grid grid-cols-2 gap-1">
        <button
          onClick={() => { setAuthMethod('password'); dispatch(clearMessages()); }}
          className={`text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            authMethod === 'password' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <Lock className="w-4 h-4" /> Password
        </button>
        <button
          onClick={() => { setAuthMethod('otp'); dispatch(clearMessages()); }}
          className={`text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            authMethod === 'otp' 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <Mail className="w-4 h-4" /> OTP Login
        </button>
      </div>

      {getErrorMessage()}
      
      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-700 font-medium">Success! Redirecting...</p>
        </div>
      )}

      {/* --- PASSWORD FORM --- */}
      {authMethod === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0652e9] transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0652e9]/20 focus:border-[#0652e9] outline-none transition-all text-sm font-medium"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-900">Password</label>
              <NavLink to="/forgot-password" className="text-xs font-semibold text-[#0652e9] hover:text-blue-700">
                Forgot password?
              </NavLink>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0652e9] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full bg-[#0652e9] hover:bg-[#0547d1] text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      )}

      {/* --- OTP FORM --- */}
      {authMethod === 'otp' && (
        <form onSubmit={handleOtpRequest} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">Email Address</label>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${otpSent ? 'text-gray-300' : 'text-gray-400 group-focus-within:text-[#0652e9]'}`} />
              <input
                type="email"
                required
                disabled={otpSent}
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 border rounded-xl outline-none transition-all text-sm font-medium ${
                  otpSent 
                    ? 'bg-gray-100 border-gray-200 text-gray-500' 
                    : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0652e9]/20 focus:border-[#0652e9]'
                }`}
                placeholder="name@company.com"
              />
              {otpSent && (
                <button type="button" onClick={handleEditOtpEmail} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0652e9] hover:text-blue-700 bg-white rounded p-1 shadow-sm border border-gray-100">
                  <Edit2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${otpSent ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-1 pt-2">
              <label className="text-sm font-medium text-gray-900">Verification Code</label>
              <div className="relative group">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0652e9] transition-colors" />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0652e9]/20 focus:border-[#0652e9] outline-none transition-all text-sm font-mono tracking-widest font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full bg-[#0652e9] hover:bg-[#0547d1] text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isBusy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : otpSent ? (
              <>Verify & Login <CheckCircle className="h-4 w-4" /></>
            ) : (
              <>Get Code <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      )}

      {/* --- FOOTER --- */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-3 text-sm"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
        Sign in with Google
      </button>

      {!isModal && (
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <NavLink to="/register" className="font-bold text-[#0652e9] hover:text-blue-700 transition-colors">
            Sign up
          </NavLink>
        </p>
      )}
    </div>
  );

  // --- RETURN LOGIC ---
  
  // 1. If it's a Modal (Wall), render just the form nicely
  if (isModal) {
    return (
      <div className="bg-white p-2 w-full">
        <LoginFormContent />
      </div>
    );
  }

  // 2. If it's a standalone Page, render Split Screen
  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE (Marketing) */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        {/* Brand */}
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-[#0652e9] rounded-lg flex items-center justify-center">
            <span className="text-white font-mono text-lg">K</span>
          </div>
          KodeCompiler
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 max-w-md space-y-8">
           <h2 className="text-4xl font-bold leading-tight">
             Welcome back to your coding journey.
           </h2>
           
           <div className="space-y-4">
             <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Code2 className="w-6 h-6" /></div>
                <div>
                   <h4 className="font-bold">Resume Practice</h4>
                   <p className="text-sm text-gray-400">Pick up exactly where you left off.</p>
                </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Zap className="w-6 h-6" /></div>
                <div>
                   <h4 className="font-bold">Weekly Contest</h4>
                   <p className="text-sm text-gray-400">Next contest starts in 2 days.</p>
                </div>
             </div>
           </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-sm text-gray-500">
          <Globe className="w-4 h-4" />
          <span>Connecting developers worldwide</span>
        </div>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12">
        <LoginFormContent />
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, 
  CheckCircle, AlertCircle, Edit2, KeyRound, ShieldAlert 
} from 'lucide-react';
import { 
  loginUser, 
  googleLogin, 
  getOTP, 
  verifyOTP, 
  clearMessages 
} from '../../redux/slices/authSlice';

// Added props: wallTitle, wallMessage
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
    window.location.reload(); 
  };

  const getErrorMessage = () => {
    if (!error) return null;
    const detail = error.detail || error.message || 'Authentication failed';
    return (
      <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-sm text-red-700 font-medium">{detail}</div>
      </div>
    );
  };

  // --- DYNAMIC HEADER LOGIC ---
  // If it's a "Wall" (wallTitle exists), use that. Otherwise use dynamic Login/OTP titles.
  const displayTitle = wallTitle 
    ? wallTitle 
    : (authMethod === 'password' ? 'Welcome Back' : 'Passwordless Login');

  const displaySubtitle = wallMessage 
    ? wallMessage 
    : (authMethod === 'password' ? 'Enter your credentials to access your account' : 'Secure login via email verification code');

  return (
    <div className={`flex items-center justify-center font-sans ${isModal ? '' : 'min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'}`}>
      
      <div className={`bg-white w-full max-w-[440px] ${isModal ? 'shadow-none' : 'shadow-xl rounded-2xl border border-gray-100'} overflow-hidden transition-all duration-300`}>
        
        {/* --- Header --- */}
        <div className="px-8 pt-8 pb-6 text-center">
          
          {/* If it's a Wall, show a Shield/Lock Icon */}
          {wallTitle && (
            <div className="flex justify-center mb-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <ShieldAlert className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {displayTitle}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {displaySubtitle}
          </p>
        </div>

        {/* --- Tabs --- */}
        <div className="px-8 mb-6">
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => { setAuthMethod('password'); dispatch(clearMessages()); }}
              className={`text-sm font-medium py-2 rounded-md transition-all duration-200 ${
                authMethod === 'password' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => { setAuthMethod('otp'); dispatch(clearMessages()); }}
              className={`text-sm font-medium py-2 rounded-md transition-all duration-200 ${
                authMethod === 'otp' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              One-Time Code
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          
          {/* Messages */}
          {getErrorMessage()}
          {success && (
            <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-md flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-sm text-green-700 font-medium">Success! Redirecting...</p>
            </div>
          )}

          {/* --- PASSWORD FORM --- */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <NavLink to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                    Forgot?
                  </NavLink>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="w-full bg-[#0652e9] hover:bg-[#0547d1] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>
          )}

          {/* --- OTP FORM --- */}
          {authMethod === 'otp' && (
            <form onSubmit={handleOtpRequest} className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative group">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${otpSent ? 'text-gray-300' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    required
                    disabled={otpSent}
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none transition-all text-sm ${
                      otpSent 
                        ? 'bg-gray-50 border-gray-200 text-gray-500' 
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                    }`}
                    placeholder="name@company.com"
                  />
                  {otpSent && (
                    <button type="button" onClick={handleEditOtpEmail} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible OTP Input */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${otpSent ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-1.5 pt-1">
                  <label className="text-sm font-medium text-gray-700">Verification Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm tracking-widest"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="w-full bg-[#0652e9] hover:bg-[#0547d1] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
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
              onClick={handleGoogleLogin}
              type="button"
              className="mt-6 w-full bg-white border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 text-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <NavLink to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Sign up
              </NavLink>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
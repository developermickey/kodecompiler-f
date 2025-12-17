import React, { useState, useEffect } from 'react';
import { Mail, Lock, Loader2, CheckCircle, Edit2, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router
import { getOTP, verifyOTP, clearMessages } from '../../redux/slices/authSlice';

const LoginWithOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select state from Redux store
  const { 
    isLoading, 
    otpSent, 
    verifyingOTP, 
    error, 
    user 
  } = useSelector((state) => state.auth);

  // Clear messages on unmount or when email changes to prevent stale errors
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Navigate after successful login
  useEffect(() => {
    if (user) {
      navigate('/welcome'); // Change this to your desired route
    }
  }, [user, navigate]);

  // Handlers
  const handleAction = async (e) => {
    e.preventDefault();
    
    // Clear previous errors before new action
    if (error) dispatch(clearMessages());

    if (!otpSent) {
      // Step 1: Send OTP
      if (!email) return;
      // The slice handles loading state automatically via pending/fulfilled
      dispatch(getOTP({ email }));
    } else {
      // Step 2: Verify OTP
      if (!otp) return;
      dispatch(verifyOTP({ email, otp }));
      
    }
  };

  const handleEditEmail = () => {
    // We need to reset the Redux state because "otpSent" is global in your slice
    // You might need a specific action to reset otpSent if you don't want to clear everything
    // For now, clearMessages is the closest, but purely UI reset is needed.
    // Since otpSent is in Redux, we ideally need an action to set it false.
    // However, looking at your slice, 'getOTP.pending' sets otpSent=false.
    // Re-dispatching getOTP or reloading page is one way, but standard practice
    // would be adding a reducer like 'resetAuthStep' or just reloading the page context.
    
    // Quick fix: Just reload or separate component logic. 
    // Ideally, add a reducer `resetOTP` to your slice.
    // For this implementation, I will treat it as a fresh start.
    window.location.reload(); 
  };

  // Derived loading state for UI (either sending OTP or Verifying)
  const isBusy = isLoading || verifyingOTP;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-[450px] rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] p-8 sm:p-10 border border-gray-100">
        
        {/* --- Header --- */}
        <div className="text-center mb-8">
          <h1 className="text-[26px] font-bold text-[#111827] mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-[15px]">
            {otpSent ? 'Enter the code sent to your email' : 'Sign in to your account'}
          </p>
        </div>

        {/* --- Error Message Display --- */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">
              {error.detail || error.message || "An error occurred"}
            </span>
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-5">
          
          {/* --- Email Input --- */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-medium text-gray-700">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 ${otpSent ? 'text-gray-400' : 'text-gray-400 group-focus-within:text-blue-600'} transition-colors`} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent || isBusy}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-10 py-3 text-[15px] border rounded-lg outline-none transition-all duration-200 
                  ${otpSent 
                    ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed' 
                    : 'text-gray-900 border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white placeholder:text-gray-400'
                  }`}
                required
              />
              {/* Edit Icon (Shows when OTP is sent) */}
              {otpSent && !isBusy && (
                <button 
                  type="button" 
                  onClick={handleEditEmail}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-blue-600 hover:text-blue-700"
                  title="Change email"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* --- OTP Input (Conditionally Rendered Inline) --- */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${otpSent ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-1.5 pt-1">
              <label className="block text-[14px] font-medium text-gray-700">One-Time Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isBusy}
                  placeholder="Enter 6-digit code"
                  className="w-full pl-10 pr-4 py-3 text-[15px] text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-400 bg-white"
                  autoFocus={otpSent} 
                />
              </div>
            </div>
          </div>

          {/* --- Main Action Button --- */}
          <button
            type="submit"
            disabled={isBusy}
            className="w-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm text-[15px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isBusy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : otpSent ? (
              <>Sign In <CheckCircle className="h-5 w-5" /></>
            ) : (
              'Get OTP'
            )}
          </button>

        </form>

        {/* --- Divider --- */}
        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs text-gray-500 uppercase tracking-wider font-medium">
              OR
            </span>
          </div>
        </div>

        {/* --- Google Button --- */}
        {/* Note: Connect this to the googleLogin action from your slice if needed */}
        <button className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 text-[15px]">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* --- Footer --- */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginWithOTP;

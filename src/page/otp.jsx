import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  // Handle individual digit change
  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    // Handle single digit or last typed character if multiple entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    // Auto-advance to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard events (Backspace navigation)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Handle paste event for full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      setError('');
      inputRefs.current[5]?.focus();
    } else {
      setError('Please paste a valid 4  -digit numeric code.');
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length < 6) {
      setError('Please enter all 4 digits of the verification code.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate backend verification
    setTimeout(() => {
      setLoading(false);
      if (otpCode === '123456' || otpCode.length === 6) {
        setVerified(true);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    }, 1200);
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '']);
    setError('');
    // Simulate code dispatch
    alert('A new security code has been sent to your email.');
    inputRefs.current[0]?.focus();
  };

  const resetFlow = () => {
    setVerified(false);
    setOtp(['', '', '', '']);
    setTimer(60);
    setCanResend(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-300 font-sans">
      
      {/* Top Branding / Logo */}
      {/* <div className="absolute top-6 left-6 flex items-center space-x-2.5">
        <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-slate-50 flex items-center justify-center text-white dark:text-slate-900 font-bold text-base shadow-sm">
          S
        </div>
        <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-tight text-sm">Acme Inc.</span>
      </div> */}

      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Error Notice */}
          {error && (
            <div className="mb-5 flex items-start space-x-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {!verified ? (
            /* OTP Input Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-2 mb-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-2 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Enter verification code
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  We've sent a 4-digit code to <span className="font-semibold text-slate-700 dark:text-slate-300">name@example.com</span>
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block text-center">
                  Verification Code
                </label>
                
                {/* 6-Digit Inputs container */}
                <div className="flex justify-center space-x-2 sm:space-x-3" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all shadow-xs"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-center text-slate-400">Tip: You can paste your 4-digit code directly.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-medium rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Verify Code</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => alert("Redirecting to email entry...")}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Change email
                </button>
                
                <div className="text-slate-400">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-slate-900 dark:text-slate-200 font-semibold hover:underline inline-flex items-center cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Resend code
                    </button>
                  ) : (
                    <span>Resend in <span className="font-semibold text-slate-700 dark:text-slate-300">{timer}s</span></span>
                  )}
                </div>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Verification successful
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Your identity has been verified. You can now proceed to reset your password.
                </p>
              </div>

              <div className="pt-2 flex flex-col space-y-3">
                <button
                  onClick={() => alert("Proceeding to password reset screen...")}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-medium rounded-xl shadow-md transition-all text-sm cursor-pointer"
                >
                  Continue to Reset Password
                </button>
                
                <button
                  onClick={resetFlow}
                  className="inline-flex items-center justify-center text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Start over
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          Protected by Acme Security &bull; Two-Factor Authentication
        </p>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';

export default function Forget() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer for resending email when submitted
  useEffect(() => {
    let interval;
    if (submitted && timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [submitted, timer, canResend]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate backend request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setEmail('');
    setTimer(60);
    setCanResend(false);
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

          {!submitted ? (
            /* Forgot Password Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-2 shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Forgot password?
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  No worries, enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-medium rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Send Reset Instructions</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => alert("Redirecting to sign-in page...")}
                  className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to log in
                </button>
              </div>
            </form>
          ) : (
            /* Success Confirmation State */
            <div className="text-center space-y-6 py-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Check your inbox
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  We've sent a password reset link to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p>Didn't receive the email? Check your spam folder or request a new one.</p>
                <div>
                  {canResend ? (
                    <button
                      onClick={() => {
                        setTimer(60);
                        setCanResend(false);
                      }}
                      className="font-semibold text-slate-900 dark:text-slate-200 hover:underline inline-flex items-center cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Resend instructions
                    </button>
                  ) : (
                    <span>Resend available in <span className="font-semibold text-slate-700 dark:text-slate-300">{timer}s</span></span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex flex-col space-y-3">
                <button
                  onClick={handleResetForm}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-medium rounded-xl shadow-md transition-all text-sm cursor-pointer"
                >
                  Try another email
                </button>
                
                <button
                  type="button"
                  onClick={() => alert("Redirecting to sign-in page...")}
                  className="inline-flex items-center justify-center text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to log in
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          Protected by Acme Security &bull; Privacy Policy
        </p> 
      </div> 
    </div>
  );
}
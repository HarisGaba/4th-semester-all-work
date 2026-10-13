import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Check, 
  X, 
  ArrowLeft 
} from 'lucide-react';

export default function Reset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password requirements criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setError('Please meet all password strength requirements below.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify and try again.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate backend password update
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setSuccess(false);
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

          {!success ? (
            /* Reset Password Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-2 shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Set new password
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Your new password must be secure and distinct from previously used credentials.
                </p>
              </div>

              {/* New Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Password requirements:</div>
                
                <div className={`flex items-center space-x-2 transition-colors ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                  <span>Minimum 8 characters long</span>
                </div>

                <div className={`flex items-center space-x-2 transition-colors ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasUppercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                  <span>At least one uppercase letter (A-Z)</span>
                </div>

                <div className={`flex items-center space-x-2 transition-colors ${hasLowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasLowercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                  <span>At least one lowercase letter (a-z)</span>
                </div>

                <div className={`flex items-center space-x-2 transition-colors ${hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasNumber ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                  <span>At least one number (0-9)</span>
                </div>

                <div className={`flex items-center space-x-2 transition-colors ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {hasSpecial ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                  <span>At least one special character (!@#$...)</span>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-red-500 font-medium">Passwords do not match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-medium rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Reset Password</span>
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
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Password updated successfully
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Your password has been changed. You can now log into your account using your new credentials.
                </p>
              </div>

              <div className="pt-2 flex flex-col space-y-3">
                <button
                  onClick={() => alert("Redirecting to login page...")}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-medium rounded-xl shadow-md transition-all text-sm cursor-pointer"
                >
                  Sign In Now
                </button>
                
                <button
                  onClick={handleResetForm}
                  className="inline-flex items-center justify-center text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Reset again
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          Protected by Acme Security &bull; Account Protection
        </p>
      </div>
    </div> 
  );
}
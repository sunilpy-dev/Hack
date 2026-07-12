import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import { Lock, Mail, Eye, EyeOff, Sparkles, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginView({ onLoginSuccess, onPasswordResetRequired }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setIsLoading(false);

      if (res.success) {
        if (res.data && res.data.passwordResetRequired) {
          // Temporarily save token for change password endpoint permission
          localStorage.setItem('token', res.data.token);
          onPasswordResetRequired({
            userId: res.data.userId,
            email: res.data.email
          });
        } else {
          onLoginSuccess(res.data.token, res.data.user);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fcf8fa]">
      {/* Left panel - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        {/* Top brand logo */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-7 h-7 flex flex-col justify-between shrink-0">
            <div className="h-1.5 w-full bg-white rounded-sm"></div>
            <div className="flex justify-between w-full">
              <div className="h-2.5 w-2 bg-[#06b6d4] rounded-sm"></div>
              <div className="h-2.5 w-2 bg-[#06b6d4] rounded-sm"></div>
            </div>
            <div className="h-1.5 w-full bg-white rounded-sm"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white font-sans">
            AssetBridge
          </span>
        </div>

        {/* Content */}
        <div className="my-auto space-y-6 relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
            <Sparkles size={12} />
            <span>Enterprise Resource Orchestration</span>
          </div>
          <h1 className="text-4xl font-extrabold font-sans leading-tight tracking-tight">
            Integrated Asset & Capacity Intelligence.
          </h1>
          <p className="text-sm text-[#76777d] font-sans leading-relaxed">
            Unify hardware lifecycle tracking, preventative maintenance schedules, and bookable corporate space resource allocation under a unified compliance dashboard.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex justify-between text-xs text-[#76777d] font-mono">
          <span>v2.1.0 • Stable Release</span>
          <span>© 2026 AssetFlow Inc.</span>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[420px] bg-white border border-[#e5e4e7] p-8 rounded-lg shadow-sm mx-auto my-auto">
          {/* Logo and Greeting */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 lg:hidden">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex flex-col justify-between shrink-0">
                  <div className="h-1.5 w-full bg-[#0F172A] rounded-sm"></div>
                  <div className="flex justify-between w-full">
                    <div className="h-2.5 w-2 bg-[#06b6d4] rounded-sm"></div>
                    <div className="h-2.5 w-2 bg-[#06b6d4] rounded-sm"></div>
                  </div>
                  <div className="h-1.5 w-full bg-[#0F172A] rounded-sm"></div>
                </div>
                <span className="font-bold text-2xl tracking-tight text-[#0F172A] font-sans">
                  AssetBridge
                </span>
              </div>
            </div>
            <h2 className="text-xl font-bold font-sans text-[#0F172A]">Welcome Back</h2>
            <p className="text-xs text-[#76777d] mt-1 font-sans">Please enter your enterprise credentials to access your dashboard.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs font-sans leading-relaxed flex items-start gap-2">
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#76777d]" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={isLoading}
                  required
                  className="w-full h-10 pl-10 pr-4 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5 flex justify-between items-center">
                <span>Account Password</span>
                <span className="text-[9px] hover:underline cursor-pointer text-[#76777d] font-normal lowercase">Forgot? Contact Admin</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#76777d]" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  required
                  className="w-full h-10 pl-10 pr-10 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#76777d] hover:text-[#0F172A] focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember device checkbox */}
            <div className="flex items-center gap-2 pt-1.5 select-none">
              <input
                id="remember"
                type="checkbox"
                className="w-3.5 h-3.5 border-[#e5e4e7] rounded text-[#0F172A] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-xs text-[#76777d] font-sans">
                Keep me signed in on this workstation
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 bg-[#0F172A] hover:bg-slate-800 text-white font-sans font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Login Securely</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

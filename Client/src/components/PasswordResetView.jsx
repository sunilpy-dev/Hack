import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import { Lock, Check, X, ShieldAlert, Loader2 } from 'lucide-react';

export default function PasswordResetView({ email, userId, onPasswordResetSuccess }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Validation States
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);
  
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
  const isFormValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch && oldPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please ensure all security requirements are met.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Reset password on backend
      await authService.changePassword(oldPassword, newPassword, userId);

      // 2. Perform regular login under the hood to fetch full access JWT and session context
      const loginRes = await authService.login(email, newPassword);
      setIsLoading(false);

      if (loginRes.success && loginRes.data && loginRes.data.token) {
        onPasswordResetSuccess(loginRes.data.token, loginRes.data.user);
      } else {
        setError('Password changed, but automatic login failed. Please reload and log in.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to update password. Please check your temporary password.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-[#fcf8fa]">
      <div className="w-full max-w-[460px] bg-white border border-[#e5e4e7] p-8 rounded-lg shadow-sm mx-auto my-auto">
        {/* Header warning */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-3 border border-amber-200">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-xl font-bold font-sans text-[#0F172A]">Password Setup Required</h2>
          <p className="text-xs text-[#76777d] mt-1 font-sans">
            Your account was provisioned with a temporary credential. For security compliance, you must configure a new unique password before proceeding.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs font-sans leading-relaxed">
              <span className="font-bold">Security Violation: </span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1">
              Temporary/Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-[#76777d]" size={16} />
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter temporary password"
                required
                disabled={isLoading}
                className="w-full h-10 pl-10 pr-4 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-[#76777d]" size={16} />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong password"
                required
                disabled={isLoading}
                className="w-full h-10 pl-10 pr-4 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-[#76777d]" size={16} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Verify new password"
                required
                disabled={isLoading}
                className="w-full h-10 pl-10 pr-4 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>
          </div>

          {/* Real-time Validation Rules list */}
          <div className="bg-[#fcf8fa] p-4 rounded border border-[#e5e4e7] space-y-2 select-none">
            <div className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase pb-1 border-b border-[#e5e4e7]">
              Strength Criteria Checklist
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-sans">
                {hasMinLength ? (
                  <Check className="text-emerald-500" size={14} />
                ) : (
                  <X className="text-gray-300" size={14} />
                )}
                <span className={hasMinLength ? 'text-emerald-700 font-medium' : 'text-[#76777d]'}>
                  Min 8 Characters
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-sans">
                {hasUppercase ? (
                  <Check className="text-emerald-500" size={14} />
                ) : (
                  <X className="text-gray-300" size={14} />
                )}
                <span className={hasUppercase ? 'text-emerald-700 font-medium' : 'text-[#76777d]'}>
                  Uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-sans">
                {hasLowercase ? (
                  <Check className="text-emerald-500" size={14} />
                ) : (
                  <X className="text-gray-300" size={14} />
                )}
                <span className={hasLowercase ? 'text-emerald-700 font-medium' : 'text-[#76777d]'}>
                  Lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-sans">
                {hasNumber ? (
                  <Check className="text-emerald-500" size={14} />
                ) : (
                  <X className="text-gray-300" size={14} />
                )}
                <span className={hasNumber ? 'text-emerald-700 font-medium' : 'text-[#76777d]'}>
                  Numeric digit
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-sans">
                {hasSpecial ? (
                  <Check className="text-emerald-500" size={14} />
                ) : (
                  <X className="text-gray-300" size={14} />
                )}
                <span className={hasSpecial ? 'text-emerald-700 font-medium' : 'text-[#76777d]'}>
                  Special char (@$!%*?&)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-sans">
                {passwordsMatch ? (
                  <Check className="text-emerald-500" size={14} />
                ) : (
                  <X className="text-gray-300" size={14} />
                )}
                <span className={passwordsMatch ? 'text-emerald-700 font-medium' : 'text-[#76777d]'}>
                  Passwords match
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-10 mt-2 bg-[#0F172A] hover:bg-slate-800 text-white font-sans font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#f0edef] disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Security Settings...</span>
              </>
            ) : (
              <span>Authorize & Save Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

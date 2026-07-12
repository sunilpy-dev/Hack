import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import { User, Lock, Check, X, ShieldCheck, Loader2 } from 'lucide-react';

export default function ProfileView({ userProfile }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
  const isFormValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch && oldPassword;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!isFormValid) {
      setErrorMsg('Please meet all password strength requirements.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword, userProfile.id);
      setIsLoading(false);
      setSuccessMsg('Your password has been changed successfully.');
      
      // Reset fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to change password. Please verify your current password.');
    }
  };

  const emp = userProfile.employee || {};

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#fcf8fa]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight flex items-center gap-2">
          <User className="text-[#06b6d4]" size={24} />
          <span>My Profile</span>
        </h1>
        <p className="text-sm text-[#45464d] mt-1 font-sans">
          Manage your personal details, designations, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-white border border-[#e5e4e7] p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center text-slate-700 text-3xl font-bold font-sans mb-4 uppercase">
            {emp.firstName ? emp.firstName[0] : ''}{emp.lastName ? emp.lastName[0] : ''}
          </div>
          <h3 className="text-lg font-bold font-sans text-[#0F172A]">
            {emp.firstName} {emp.lastName}
          </h3>
          <p className="text-xs text-[#06b6d4] font-mono mt-1 bg-cyan-50 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
            {userProfile.role}
          </p>

          <div className="w-full border-t border-[#f0edef] my-4 pt-4 space-y-3 text-left">
            <div>
              <span className="text-[9px] font-bold font-mono tracking-wider text-[#76777d] uppercase block">Designation</span>
              <span className="text-xs font-sans font-semibold text-[#0F172A]">{emp.designation || 'Staff'}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold font-mono tracking-wider text-[#76777d] uppercase block">Corporate Email</span>
              <span className="text-xs font-sans font-semibold text-[#0F172A]">{userProfile.email}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white border border-[#e5e4e7] p-6 rounded-lg shadow-sm md:col-span-2">
          <h3 className="text-sm font-bold font-mono tracking-widest text-[#0f172a] uppercase border-b border-[#f0edef] pb-3 mb-4 flex items-center gap-1.5">
            <Lock size={16} className="text-[#76777d]" />
            <span>Update Account Password</span>
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded text-xs font-sans">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs font-sans">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full h-10 px-3 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full h-10 px-3 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full h-10 px-3 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded text-xs space-y-1">
              <span className="font-bold text-[9px] font-mono tracking-wider uppercase text-[#76777d] block pb-1 border-b border-gray-200">
                New Password Strength checklist
              </span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                <div className="flex items-center gap-1">
                  {hasMinLength ? <Check className="text-emerald-500" size={12} /> : <X className="text-gray-300" size={12} />}
                  <span className={hasMinLength ? 'text-emerald-700' : 'text-[#76777d]'}>Min 8 characters</span>
                </div>
                <div className="flex items-center gap-1">
                  {hasUppercase ? <Check className="text-emerald-500" size={12} /> : <X className="text-gray-300" size={12} />}
                  <span className={hasUppercase ? 'text-emerald-700' : 'text-[#76777d]'}>Uppercase letter</span>
                </div>
                <div className="flex items-center gap-1">
                  {hasLowercase ? <Check className="text-emerald-500" size={12} /> : <X className="text-gray-300" size={12} />}
                  <span className={hasLowercase ? 'text-emerald-700' : 'text-[#76777d]'}>Lowercase letter</span>
                </div>
                <div className="flex items-center gap-1">
                  {hasNumber ? <Check className="text-emerald-500" size={12} /> : <X className="text-gray-300" size={12} />}
                  <span className={hasNumber ? 'text-emerald-700' : 'text-[#76777d]'}>Numeric digit</span>
                </div>
                <div className="flex items-center gap-1">
                  {hasSpecial ? <Check className="text-emerald-500" size={12} /> : <X className="text-gray-300" size={12} />}
                  <span className={hasSpecial ? 'text-emerald-700' : 'text-[#76777d]'}>Special char</span>
                </div>
                <div className="flex items-center gap-1">
                  {passwordsMatch ? <Check className="text-emerald-500" size={12} /> : <X className="text-gray-300" size={12} />}
                  <span className={passwordsMatch ? 'text-emerald-700' : 'text-[#76777d]'}>Passwords match</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="px-4 h-10 bg-[#0F172A] hover:bg-slate-800 text-white font-sans font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#f0edef] disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';

function passwordStrength(password) {
  const value = (password || '').trim();
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (value.length === 0) return { label: 'No password', color: '#94a3b8', width: '0%' };
  if (score <= 1) return { label: 'Weak', color: '#dc2626', width: '25%' };
  if (score === 2) return { label: 'Fair', color: '#d97706', width: '50%' };
  if (score === 3) return { label: 'Good', color: '#2563eb', width: '75%' };
  return { label: 'Strong', color: '#16a34a', width: '100%' };
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const strength = useMemo(() => passwordStrength(password), [password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Missing reset token in URL.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await authService.resetPassword(token, password);
    if (!result.ok) {
      setError(result.message || 'Unable to reset password.');
      setSubmitting(false);
      return;
    }

    setMessage(result.message || 'Password has been reset successfully.');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-linear-to-br from-[#eef6ff] to-[#f9fbff]">
      <div className="w-full max-w-md rounded-3xl bg-white border border-blue-100 shadow-[0_25px_60px_rgba(16,42,120,0.16)] p-8">
        <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
        <p className="text-slate-600 mt-2">Create a new secure password for your account.</p>

        {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium">{error}</div>}
        {message && <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-800 px-4 py-3 text-sm font-medium">{message}</div>}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="relative">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-900 px-2 py-1 rounded-lg hover:bg-indigo-50">
              {showPassword ? 'Hide' : '👁'}
            </button>
          </div>

          <div className="space-y-1">
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: strength.width, backgroundColor: strength.color }}></div>
            </div>
            <p className="text-xs font-semibold" style={{ color: strength.color }}>Password strength: {strength.label}</p>
          </div>

          <div className="relative">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-900 px-2 py-1 rounded-lg hover:bg-indigo-50">
              {showConfirmPassword ? 'Hide' : '👁'}
            </button>
          </div>

          <button disabled={submitting} className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 text-white py-3 font-semibold disabled:opacity-70" type="submit">
            {submitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <button type="button" onClick={() => navigate('/login')} className="mt-5 text-blue-700 font-semibold hover:underline">
          Back to Login
        </button>
      </div>
    </div>
  );
}

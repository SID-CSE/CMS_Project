import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPathForRole } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(email, password);

    if (!result.ok) {
      setError(result.message || 'Invalid User');
      setSubmitting(false);
      return;
    }

    navigate(getDashboardPathForRole(result.user.role));
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2ff] via-[#f0f9ff] to-white flex flex-col items-center px-6 py-12">
      <div className="self-start mb-4">
        <h1 className="text-[#1734a1] text-2xl font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/')}>Contify</h1>
      </div>

      <div className="bg-[#dcf0fb] border border-white rounded-[40px] p-10 w-full max-w-md shadow-lg flex flex-col items-center">
        <h2 className="text-[#1734a1] text-4xl font-bold mb-1 text-center">Welcome Back !</h2>
        <p className="text-[#1734a1] text-3xl font-bold mb-10">LogIn</p>

        {error && (
          <div className="mb-6 p-3 w-full text-center bg-red-100 border border-red-400 text-red-700 rounded-full font-bold">
            {error}
          </div>
        )}

        <form className="w-full space-y-6" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/60 border border-blue-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/60 border border-blue-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-500"
          />
          <button disabled={submitting} type="submit" className="w-full bg-[#1734a1] text-white py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-50">
            {submitting ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <button onClick={() => navigate('/forgot-password')} className="mt-6 text-slate-700 font-medium hover:text-[#1734a1] hover:underline">
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Login;

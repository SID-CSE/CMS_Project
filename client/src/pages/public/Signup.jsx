import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registerMockUser } from '../../services/mockAuthService';

const Signup= () => {
  const { roleName } = useParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const displayRole = useMemo(() => {
    return roleName || localStorage.getItem('selectedRole') || 'Creator';
  }, [roleName]);

  useEffect(() => {
    if (roleName) {
      localStorage.setItem('selectedRole', roleName.toLowerCase());
    }
  }, [roleName]);

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    const result = registerMockUser({
      firstName,
      lastName,
      email,
      password,
      role: displayRole,
    });

    if (!result.ok) {
      setError(result.message || 'Signup failed.');
      return;
    }

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2ff] via-[#f0f9ff] to-white flex flex-col items-center px-6 py-12">
      <div className="self-start mb-4">
        <h1 onClick={() => navigate('/')} className="text-[#1734a1] text-2xl font-black italic tracking-tighter cursor-pointer">Contify</h1>
      </div>

      <div className="bg-[#dcf0fb] border border-white rounded-[40px] p-10 w-full max-w-md shadow-lg flex flex-col items-center">
        <h2 className="text-[#1734a1] text-4xl font-bold mb-1">SignUp</h2>
        <p className="text-[#1734a1] text-xl font-semibold mb-8">Welcome {displayRole}</p>

        {error && (
          <div className="mb-4 p-3 w-full text-center bg-red-100 border border-red-400 text-red-700 rounded-full font-bold text-sm">
            {error}
          </div>
        )}

        <form className="w-full space-y-4" onSubmit={handleSignup}>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-1/2 bg-white/60 border border-blue-300 rounded-full py-2 px-6 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 bg-white/60 border border-blue-300 rounded-full py-2 px-6 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/60 border border-blue-300 rounded-full py-2 px-6 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
            className="w-full bg-white/60 border border-blue-300 rounded-full py-2 px-6 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button className="w-full bg-[#1734a1] text-white py-3 rounded-full font-bold text-lg mt-4 hover:bg-blue-800 transition shadow-md">
            Sign up
          </button>
        </form>

        <p className="mt-4 text-slate-700 font-medium">
          Have an Account? <span onClick={() => navigate('/login')} className="text-[#1734a1] font-bold cursor-pointer hover:underline">Login</span>
        </p>

        <div className="w-full flex items-center my-6">
          <div className="flex-grow border-t border-slate-400"></div>
          <span className="px-4 text-slate-600 font-medium text-sm">Or</span>
          <div className="flex-grow border-t border-slate-400"></div>
        </div>

        <button className="w-full bg-[#cce8f4] border border-slate-400 rounded-full py-3 px-6 flex items-center justify-center gap-3 hover:bg-blue-100 transition shadow-sm group">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
          <span className="font-bold text-slate-700">Sign up with Google →</span>
        </button>

        <button 
          onClick={() => navigate('/roles')}
          className="mt-6 text-[#1734a1] text-sm font-bold hover:underline"
        >
          ← Back to roles
        </button>
      </div>
    </div>
  );
};

export default Signup;

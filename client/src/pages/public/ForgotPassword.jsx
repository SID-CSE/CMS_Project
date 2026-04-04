import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2ff] via-[#f0f9ff] to-white flex flex-col items-center px-6 py-12">
      <div className="self-start mb-4">
        <h1 className="text-[#1734a1] text-2xl font-black italic tracking-tighter">Contify</h1>
      </div>

      <div className="bg-[#dcf0fb] border border-white rounded-[40px] p-12 w-full max-w-md shadow-lg flex flex-col items-center">
        <h2 className="text-[#1734a1] text-4xl font-bold mb-12">Forgot Password</h2>

        <form className="w-full space-y-8">
          <input 
            type="email" 
            placeholder="Enter your Email" 
            className="w-full bg-white/60 border border-blue-300 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-500"
          />

          <button className="w-full bg-[#1734a1] text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg">
            Reset Password
          </button>
        </form>

        <p className="mt-20 text-slate-700 font-medium">
          Remember your Password? <span onClick={() => navigate('/login')} className="text-[#1734a1] font-bold cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
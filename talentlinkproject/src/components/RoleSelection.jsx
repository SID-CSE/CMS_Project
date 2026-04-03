import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleCard = ({ icon, role, description, buttonText }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-blue-100 p-8 rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 w-full max-w-[300px]">
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className="text-[#1734a1] text-2xl font-bold mb-3">{role}</h3>
      <p className="text-slate-600 text-sm mb-8 leading-relaxed">{description}</p>
      <button 
        onClick={() => navigate(`/signup/${role}`)} // Navigate to dynamic URL
        className="w-full bg-[#1734a1] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition shadow-md mt-auto"
      >
        {buttonText}
      </button>
    </div>
  );
};

const RoleSelection = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2ff] via-[#f0f9ff] to-white flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-7xl flex justify-between items-center mb-8">
        <h1 onClick={() => navigate('/')} className="text-[#1734a1] text-3xl font-black italic tracking-tighter cursor-pointer">Contify</h1>
        <button onClick={() => navigate('/')} className="text-[#1734a1] font-bold hover:underline">← Exit</button>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-[#1734a1] text-5xl font-extrabold mb-4">Create Your Account</h2>
        <p className="text-[#1734a1] text-xl font-medium">How do you want to get started?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full justify-items-center">
        <RoleCard icon="📹" role="Creator" description="Build your portfolio and find exciting projects." buttonText="Sign up as Creator" />
        <RoleCard icon="🛡️" role="Admin" description="Manage teams and oversee platform operations." buttonText="Sign up as Admin" />
        <RoleCard icon="🤝" role="Stakeholder" description="Invest in projects and track strategic goals." buttonText="Sign up as Stakeholder" />
      </div>
    </div>
  );
};

export default RoleSelection;
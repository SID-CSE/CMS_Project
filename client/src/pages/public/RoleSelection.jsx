import React from 'react';
import { useNavigate } from 'react-router-dom';

// Updated RoleCard to accept 'image' instead of 'icon'
const RoleCard = ({ image, role, description, buttonText }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-blue-100 p-8 rounded-[40px] flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-2 w-full max-w-[320px] group">
      
      {/* Image container with a soft background circle */}
      <div className="w-32 h-32 mb-6 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-inner group-hover:scale-105 transition-transform">
        <img 
          src={image} 
          alt={role} 
          className="w-full h-full object-cover" 
        />
      </div>

      <h3 className="text-[#1734a1] text-2xl font-bold mb-3">{role}</h3>
      <p className="text-slate-600 text-sm mb-8 leading-relaxed h-12">
        {description}
      </p>
      
      <button 
        onClick={() => navigate(`/signup/${role}`)}
        className="w-full bg-[#1734a1] text-white py-3 rounded-2xl font-bold hover:bg-blue-800 transition shadow-md mt-auto"
      >
        {buttonText}
      </button>
    </div>
  );
};

const RoleSelection = () => {
  const navigate = useNavigate();

  // You can use these professional Popsy illustrations or your own local assets
  const roles = [
    {
      image: "https://illustrations.popsy.co/blue/video-call.svg",
      role: "Editor",
      description: "Build your portfolio and find exciting projects.",
      buttonText: "Sign up as Editor"
    },
    {
      image: "https://img.freepik.com/premium-vector/flat-design-illustration-female-admin-receiving-call-from-customer_608297-23864.jpg",
      role: "Admin",
      description: "Manage teams and oversee platform operations.",
      buttonText: "Sign up as Admin"
    },
    {
      image: "https://illustrations.popsy.co/blue/shaking-hands.svg",
      role: "Stakeholder",
      description: "Invest in projects and track strategic goals.",
      buttonText: "Sign up as Stakeholder"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2ff] via-[#f0f9ff] to-white flex flex-col items-center px-6 py-12 font-sans">
      
      {/* Header with Navigation */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-16">
        <h1 
          onClick={() => navigate('/')} 
          className="text-[#1734a1] text-3xl font-black italic tracking-tighter cursor-pointer"
        >
          Contify
        </h1>
        <button 
          onClick={() => navigate('/')} 
          className="text-[#1734a1] font-bold hover:underline flex items-center gap-2"
        >
          ← Exit
        </button>
      </div>

      {/* Title Section */}
      <div className="text-center mb-16">
        <h2 className="text-[#1734a1] text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Create Your Account
        </h2>
        <p className="text-[#1734a1] text-2xl font-medium opacity-80">
          How do you want to get started?
        </p>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl w-full justify-items-center">
        {roles.map((item, index) => (
          <RoleCard 
            key={index}
            image={item.image}
            role={item.role}
            description={item.description}
            buttonText={item.buttonText}
          />
        ))}
      </div>

      {/* Bottom Login Link */}
      <p className="mt-16 text-slate-500 font-medium">
        Already have an account?{' '}
        <span 
          onClick={() => navigate('/login')} 
          className="text-[#1734a1] font-bold cursor-pointer hover:underline"
        >
          Log In
        </span>
      </p>
    </div>
  );
};

export default RoleSelection;
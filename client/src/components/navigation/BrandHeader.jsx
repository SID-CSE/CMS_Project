import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BrandHeader() {
  const navigate = useNavigate();
  const handleBrandClick = () => {
    navigate('/');
  };

  return (
    <div className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={handleBrandClick}
          type="button"
          className="hover:opacity-75 transition"
        >
          <h1 className="text-2xl font-black italic text-[#1734a1]">Contify</h1>
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium text-[#1734a1] hover:underline"
          type="button"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

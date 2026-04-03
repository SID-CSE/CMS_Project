import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import ForgotPassword from './components/ForgotPassword';

// --- FULL LANDING PAGE COMPONENT ---
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f2ff] to-[#ffffff] text-slate-800 font-sans">
      
      {/* Top Utility Bar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white/30 backdrop-blur-md border-b border-blue-200">
        <div className="flex gap-6 text-[#1734a1] font-semibold">
          <a href="#" className="hover:underline">Updates</a>
          <a href="#" className="hover:underline">Legal Guide</a>
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Services</a>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="bg-black text-white px-8 py-1.5 rounded-full text-sm font-medium hover:opacity-80 transition"
          >
            LogIn
          </button>
          <button 
            onClick={() => navigate('/roles')}
            className="bg-[#1734a1] text-white px-8 py-1.5 rounded-full text-sm font-medium hover:bg-blue-800 transition"
          >
            SignUp
          </button>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="flex justify-end gap-8 px-16 py-6 font-medium text-slate-700">
        <span className="cursor-pointer hover:text-blue-600">Platform ▾</span>
        <span className="cursor-pointer hover:text-blue-600">Features ▾</span>
        <span className="cursor-pointer hover:text-blue-600">Solutions ▾</span>
        <span className="cursor-pointer hover:text-blue-600">Community</span>
      </div>

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between px-16 py-10 max-w-7xl mx-auto">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-[#1734a1] text-6xl font-black italic tracking-tighter">Contify</h1>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
            Where Content <br />  Meets Collaboration
          </h2>
          <p className="text-lg text-slate-600 max-w-md">
            The all-in-one ecosystem for stakeholders to commission, admins to manage, and creators to produce world-class video content.
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => navigate('/roles')}
              className="bg-[#1734a1] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-800 transition"
            >
              Find Top Talent
            </button>
            <button className="bg-[#4d6ecf] text-white px-6 py-3 rounded-lg font-medium shadow-md">
              Find Your Next Project
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-end">
          <img src="https://static.vecteezy.com/system/resources/previews/041/453/086/non_2x/content-creators-illustration-clip-art-template-set-digital-development-multimedia-recording-template-content-for-youtube-and-facebook-or-instagram-vector.jpg" alt="Hero" className="w-[400px]" />
        </div>
      </header>

      {/* Mid Section Text */}
      <section className="text-center py-16 px-6">
        <p className="text-2xl font-medium text-slate-800 max-w-2xl mx-auto">
          Celebrate success, encourage growth, and strengthen your workplace culture.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16 max-w-7xl mx-auto mb-20">
        <FeatureCard icon="👥" title="Creator Collaboration" desc="High Scale Video Productions" />
        <FeatureCard icon="📝" title="Give Feedback" desc="Share appreciation in seconds" />
        <FeatureCard icon="💰" title="Automated Ledger" desc="money flows without invoice headache." />
      </section>

      {/* Bottom CTA */}
      <div className="flex justify-center gap-6 mb-32">
        <button 
          onClick={() => navigate('/roles')}
          className="bg-[#1734a1] text-white px-10 py-3 rounded-lg text-xl flex items-center gap-2 hover:bg-blue-800 transition"
        >
          Get Started <span>→</span>
        </button>
      </div>

      {/* Full Footer */}
      <footer className="w-full bg-white/50 pt-16">
        <div className="max-w-7xl mx-auto px-16 grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="font-bold text-lg mb-6">New to TalentLink ?</h4>
            <ul className="space-y-2 text-[#1734a1] font-semibold">
              <li className="cursor-pointer hover:underline">What is TalentLink?</li>
              <li className="cursor-pointer hover:underline">Stakeholders</li>
              <li className="cursor-pointer hover:underline">Freelancers</li>
              <li className="cursor-pointer hover:underline">Clients</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-2 text-[#1734a1] font-semibold">
              <li className="cursor-pointer hover:underline">Home</li>
              <li className="cursor-pointer hover:underline">About Us</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-200 py-6 px-16 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 text-slate-600">
             <span>📧</span> support@talentlink.com
           </div>
           <div className="flex gap-6 text-xl text-slate-700">
             <i className="cursor-pointer hover:text-blue-600">𝕏</i>
             <i className="cursor-pointer hover:text-blue-600">Facebook</i>
             <i className="cursor-pointer hover:text-blue-600">LinkedIn</i>
           </div>
        </div>
        <div className="bg-[#1734a1] text-white py-3 text-center font-medium">
          @ 2025 TalentLink
        </div>
      </footer>
    </div>
  );
};

// Helper Card Component
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-blue-50/80 p-8 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

// --- MAIN APP ROUTING ---
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/roles" element={<RoleSelection />} />
      <Route path="/signup/:roleName" element={<SignUpForm />} />
    </Routes>
  );
};

export default App;
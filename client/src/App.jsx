import { Routes, Route } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes";
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import RoleSelection from './pages/public/RoleSelection';
import ForgotPassword from './pages/public/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/roles" element={<RoleSelection />} />
      <Route path="/signup/:roleName" element={<Signup />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
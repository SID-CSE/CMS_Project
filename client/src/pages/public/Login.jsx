import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TEMP ROLE (later from backend)
    const role = "ADMIN"; 

    localStorage.setItem("role", role);

    if (role === "ADMIN") navigate("/admin");
    else if (role === "EDITOR") navigate("/editor");
    else navigate("/stakeholder");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
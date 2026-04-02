import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">CMS Platform</h1>
      <p className="mb-6">Manage and publish content easily</p>

      <div className="space-x-4">
        <Link to="/login" className="rounded bg-blue-500 px-4 py-2 text-white">
          Login
        </Link>
        <Link to="/signup" className="rounded bg-green-500 px-4 py-2 text-white">
          Signup
        </Link>
      </div>
    </div>
  );
}

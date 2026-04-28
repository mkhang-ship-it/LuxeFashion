import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { FormEvent, useState } from "react";
import { login } from "../services/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: { email?: string; password?: string; form?: string } = {};

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      nextErrors.email = "Please enter a valid email format.";
    }

    if (password.trim().length === 0) {
      nextErrors.password = "Password is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    try {
      await login({ email, password });
      navigate("/profile");
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Login failed.",
      });
    }
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your account to continue</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email ? (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  JS Validation: Must be a valid email format
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password ? (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  JS Validation: Required field
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button type="button" className="text-sm text-pink-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Login
            </button>
            {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-pink-600 font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

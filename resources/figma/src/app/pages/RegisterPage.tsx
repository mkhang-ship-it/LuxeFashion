import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import { FormEvent, useState } from "react";
import { register } from "../services/api";

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: "", color: "" };
    if (pwd.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (pwd.length < 10) return { strength: 50, label: "Fair", color: "bg-yellow-500" };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
      return { strength: 75, label: "Good", color: "bg-blue-500" };
    }
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (fullName.trim().split(/\s+/).length < 2) {
      nextErrors.fullName = "Please enter full name (at least 2 words).";
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      nextErrors.email = "Please enter a valid email.";
    }

    const onlyDigitsPhone = phone.replace(/\D/g, "");
    if (onlyDigitsPhone.length < 10 || onlyDigitsPhone.length > 11) {
      nextErrors.phone = "Phone number must be 10-11 digits.";
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      nextErrors.password = "Min 8 chars, include uppercase and number.";
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Confirm password must match.";
    }

    if (!acceptedTerms) {
      nextErrors.terms = "Please accept Terms & Conditions.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    try {
      await register({
        full_name: fullName,
        email,
        phone,
        password,
      });
      navigate("/login");
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Register failed.",
      });
    }
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us and start shopping today</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="John Doe"
                />
              </div>
              <p className={`text-xs mt-1 ${errors.fullName ? "text-red-600" : "text-gray-500"}`}>
                {errors.fullName || "JS Validation: Required, minimum 2 words"}
              </p>
            </div>

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
              <p className={`text-xs mt-1 ${errors.email ? "text-red-600" : "text-gray-500"}`}>
                {errors.email || "JS Validation: Valid email format"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="+84 123 456 789"
                />
              </div>
              <p className={`text-xs mt-1 ${errors.phone ? "text-red-600" : "text-gray-500"}`}>
                {errors.phone || "JS Validation: Valid phone format (10-11 digits)"}
              </p>
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
                  placeholder="Create a strong password"
                />
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
              <p className={`text-xs mt-1 ${errors.password ? "text-red-600" : "text-gray-500"}`}>
                {errors.password || "JS Validation: Minimum 8 characters"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Re-enter your password"
                />
              </div>
              <p className={`text-xs mt-1 ${errors.confirmPassword ? "text-red-600" : "text-gray-500"}`}>
                {errors.confirmPassword || "JS Validation: Must match password field"}
              </p>
            </div>

            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <button type="button" className="text-pink-600 hover:underline">
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-pink-600 hover:underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-600 mt-1">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Create Account
            </button>
            {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-600 font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

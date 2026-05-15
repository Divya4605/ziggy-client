import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import { API } from "../config/api";
import { Mail, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(GlobalStateContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? API.login : API.signup;
      const body = isLogin ? { email, password } : { name, email, password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        navigate(from, { replace: true });
      } else setError(data.error);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg text-sm font-medium text-ink placeholder:text-subtle outline-none focus:border-brand/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,38,9,0.08)] transition-all";

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-ink items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand/5" />
        <div className="relative z-10 max-w-[360px]">
          <img
            src="/ziggy_nav_logo.png"
            alt="Ziggy Logo"
            className="h-40 w-auto mb-6 object-contain"
          />
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Delicious food,
            <br />
            <span className="text-brand">at your voice.</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10">
            The world&apos;s first voice-powered food delivery experience. Order
            hands-free, eat happy.
          </p>
          <div className="space-y-3">
            {[
              "500+ Restaurant Partners",
              "20 min Average Delivery",
              "50,000+ Happy Customers",
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-white/60 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[380px]">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-ink mb-1">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted text-sm">
              {isLogin
                ? "Sign in to your Ziggy account"
                : "Join us for delicious food today"}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 text-red-700 border border-red-200 p-3.5 rounded-lg text-sm mb-5">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {!isLogin && (
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputBase}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                required
              />
            </div>

            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-ink transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ink text-white font-semibold rounded-lg hover:bg-brand transition-colors mt-1 text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Loading...
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-brand cursor-pointer font-semibold ml-1.5 hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

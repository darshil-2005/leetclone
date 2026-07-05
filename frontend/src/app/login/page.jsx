"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/login", { email, password });
      if (res.status === 200) {
        router.push("/problems");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)] text-white flex flex-col justify-center items-center px-6">
      {/* Title / Logo */}
      <Link href="/" className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <span className="text-white font-bold text-lg">LC</span>
        </div>
        <span className="text-white text-3xl font-bold tracking-widest">JudgeCode</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold tracking-wide mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-sm mb-6">Enter your credentials to access the coding dashboard.</p>

        {error && (
          <div className="bg-rose-950/30 border border-rose-800/40 p-4 rounded-xl text-rose-200 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400 border-t border-white/5 pt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

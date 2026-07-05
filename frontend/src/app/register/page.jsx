"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("/api/register", { name, email, password });
      if (res.status === 200) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)] text-white flex flex-col justify-center items-center px-6">
      {/* Title / Logo */}
      <Link href="/" className="flex items-center space-x-3 mb-8">
        <span className="text-white text-3xl font-bold tracking-widest">JudgeCode</span>
      </Link>

      {/* Register Card */}
      <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold tracking-wide mb-2">Create Account</h2>
        <p className="text-gray-400 text-sm mb-6">Join JudgeCode to start solving code challenges.</p>

        {error && (
          <div className="bg-rose-950/30 border border-rose-800/40 p-4 rounded-xl text-rose-200 text-sm mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl text-emerald-200 text-sm mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Alex Dev"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="alex@example.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Password (Min 8 chars)</label>
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400 border-t border-white/5 pt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

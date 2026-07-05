"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)] text-white flex flex-col">
      {/* Navigation */}
      <nav className="relative z-50 px-8 py-5 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-white text-2xl font-bold tracking-widest">JudgeCode</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
            <Link href="/problems" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Problems</Link>
            <Link href="/create-problem" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Create Challenge</Link>
            <Link href="/profile" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Profile</Link>
            <Link href="/register" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Register</Link>
            <Link href="/login" className="bg-gradient-to-r from-orange-500 to-rose-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-rose-700 transition-all duration-200 shadow-md shadow-orange-500/10">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white hover:opacity-80 transition-opacity"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-950/95 border-b border-white/5 backdrop-blur-lg">
            <div className="px-8 py-6 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors text-sm">Features</a>
              <Link href="/problems" className="block text-gray-300 hover:text-white transition-colors text-sm">Problems</Link>
              <Link href="/create-problem" className="block text-gray-300 hover:text-white transition-colors text-sm">Create Challenge</Link>
              <Link href="/profile" className="block text-gray-300 hover:text-white transition-colors text-sm">Profile</Link>
              <Link href="/register" className="block text-gray-300 hover:text-white transition-colors text-sm">Register</Link>
              <Link href="/login" className="block bg-gradient-to-r from-orange-500 to-rose-600 text-white px-6 py-2.5 rounded-lg text-center text-sm font-semibold shadow-md">
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 py-24 md:py-36 flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="max-w-4xl mx-auto z-10">
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
              Master Coding
              <span className="block bg-gradient-to-r from-orange-400 via-rose-500 to-indigo-500 bg-clip-text text-transparent pb-2">
                One Challenge at a Time
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
              Sharpen your programming skills with our isolated sandbox runner. 
              Support for JavaScript, Python, and C++ with real-time test verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/problems" className="bg-gradient-to-r from-orange-500 to-rose-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-rose-700 transition-all duration-200 transform hover:scale-105 shadow-xl shadow-orange-500/25">
              Start Solving
            </Link>
            <Link href="/register" className="border border-white/20 hover:border-white/40 bg-white/5 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-24 border-t border-white/5 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide">
              Built for Developers
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Everything you need to practice, solve challenges, and check execution performance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-2xl border border-white/5 hover:border-orange-500/20 hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-orange-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Language Sandbox</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Run JavaScript, Python, or high-performance C++ code inside secure, resource-limited Docker containers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-2xl border border-white/5 hover:border-rose-500/20 hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-rose-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Output Execution</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Pipe standard input and output instantly. Get quick test execution results, stdout, and error traces.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-2xl border border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-indigo-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Attempt Tracking & History</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Monitor details of every code execution. Store code history and review previous solutions on your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 bg-black/30 text-center text-gray-500 text-sm">
        <p className="mb-2">&copy; 2026 JudgeCode. Built with Next.js, Docker, Drizzle and PostgreSQL.</p>
        <p className="text-xs text-gray-600 font-mono">Status: All compilation runners online.</p>
      </footer>
    </div>
  );
}

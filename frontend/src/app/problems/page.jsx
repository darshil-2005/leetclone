"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function ProblemsDashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await axios.get("/api/problems");
        setProblems(res.data.problems || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    if (filter === "all") return true;
    return problem.difficulty.toLowerCase() === filter.toLowerCase();
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)] text-white flex items-center justify-center">
        <div className="text-2xl tracking-widest animate-pulse font-light">Loading Problems...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)] text-white flex flex-col">
      {/* Navigation header */}
      <header className="flex justify-between items-center py-5 px-8 border-b border-white/5 backdrop-blur-md bg-black/20 z-10">
        <Link href="/" className="text-3xl tracking-widest font-semibold hover:opacity-85 transition-opacity">
          JudgeCode
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <div className="h-4 w-px bg-white/20"></div>
          <span className="text-gray-400 font-mono text-sm">Dashboard</span>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-8 z-1">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-wide mb-2 bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
              Problems
            </h1>
            <p className="text-gray-400 text-lg">
              Select a challenge to solve and check your submission history.
            </p>
          </div>

          <div className="flex gap-4 items-center self-start md:self-end">
            <Link
              href="/create-problem"
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              + Create Challenge
            </Link>

            {/* Filters */}
            <div className="flex gap-2 bg-black/40 p-1 border border-white/5 rounded-lg w-fit">
              {["all", "easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-4 py-1.5 rounded-md text-sm capitalize transition-all duration-250 ${
                    filter === level
                      ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-950/30 border border-rose-800/50 p-5 rounded-xl text-rose-200 mb-6">
            Error loading problems: {error}
          </div>
        )}

        {/* Problems List Table */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-5 font-semibold text-gray-300 text-sm uppercase tracking-wider w-16 text-center">ID</th>
                <th className="p-5 font-semibold text-gray-300 text-sm uppercase tracking-wider">Title</th>
                <th className="p-5 font-semibold text-gray-300 text-sm uppercase tracking-wider w-32">Difficulty</th>
                <th className="p-5 font-semibold text-gray-300 text-sm uppercase tracking-wider w-40">Limits</th>
                <th className="p-5 font-semibold text-gray-300 text-sm uppercase tracking-wider w-28 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No problems found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => (
                  <tr
                    key={prob.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-5 text-gray-400 font-mono text-center">{prob.id}</td>
                    <td className="p-5 font-medium text-white text-lg">
                      <Link href={`/problem/${prob.id}`} className="hover:text-orange-400 transition-colors">
                        {prob.title}
                      </Link>
                    </td>
                    <td className="p-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="p-5 text-gray-400 text-sm">
                      <div>{prob.timelimit} ms limit</div>
                      <div>{prob.memorylimit} MB memory</div>
                    </td>
                    <td className="p-5 text-center">
                      <Link
                        href={`/problem/${prob.id}`}
                        className="inline-block bg-white/10 hover:bg-gradient-to-r hover:from-orange-500 hover:to-rose-600 hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
                      >
                        Solve
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-gray-500 text-sm">
        &copy; 2026 JudgeCode. Built for high performance and premium experiences.
      </footer>
    </div>
  );
}

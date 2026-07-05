"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/api/profile");
        setProfileData(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to load profile data.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-rose-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!profileData) return null;

  const { user, stats, recentSubmissions, authoredProblems } = profileData;

  return (
    <div className="min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl flex items-center space-x-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg border-2 border-white/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">
              {user.name}
            </h1>
            <p className="text-fuchsia-300 font-medium text-lg">{user.email}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Submissions" value={stats.totalSubmissions} icon="📝" />
          <StatCard title="Accepted" value={stats.acceptedSubmissions} icon="✅" color="text-emerald-400" />
          <StatCard title="Acceptance Rate" value={`${stats.acceptanceRate}%`} icon="📊" color="text-sky-400" />
          <StatCard title="Created Problems" value={stats.authoredCount} icon="🛠️" color="text-fuchsia-400" />
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Submissions */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-fuchsia-100 border-b border-white/10 pb-2">Recent Submissions</h2>
            {recentSubmissions.length === 0 ? (
              <p className="text-gray-400 italic">No submissions yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentSubmissions.map((sub, idx) => (
                  <li key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 flex justify-between items-center transition hover:bg-black/60">
                    <div>
                      <Link href={`/problem/${sub.problemId}`} className="text-fuchsia-300 font-semibold hover:underline">
                        {sub.title || `Problem #${sub.problemId}`}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1 uppercase font-mono">{sub.language}</p>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${sub.status === 'accepted' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50' : 'bg-rose-950/50 text-rose-400 border border-rose-800/50'}`}>
                      {sub.status.replace("_", " ")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Authored Problems */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-fuchsia-100 border-b border-white/10 pb-2">Authored Problems</h2>
            {authoredProblems.length === 0 ? (
              <p className="text-gray-400 italic">You haven't created any problems.</p>
            ) : (
              <ul className="space-y-3">
                {authoredProblems.map((prob) => (
                  <li key={prob.id} className="bg-black/40 border border-white/5 rounded-lg p-3 flex justify-between items-center transition hover:bg-black/60">
                    <Link href={`/problem/${prob.id}`} className="text-fuchsia-300 font-semibold hover:underline">
                      {prob.title}
                    </Link>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${prob.difficulty === 'easy' ? 'bg-emerald-900/30 text-emerald-400' : prob.difficulty === 'medium' ? 'bg-amber-900/30 text-amber-400' : 'bg-rose-900/30 text-rose-400'}`}>
                      {prob.difficulty.toUpperCase()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-white" }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg flex items-center justify-between hover:bg-white/10 transition">
      <div>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  );
}

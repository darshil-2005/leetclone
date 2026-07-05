"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateProblem() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState("");
  const [timeLimit, setTimeLimit] = useState(2000);
  const [memoryLimit, setMemoryLimit] = useState(256);
  
  const [activeTab, setActiveTab] = useState("javascript");
  const [codeTemplates, setCodeTemplates] = useState({
    javascript: "",
    python: "",
    cpp: ""
  });

  const [examples, setExamples] = useState([{ input: "", output: "", explanation: "" }]);
  const [runTestcases, setRunTestcases] = useState([{ input: "", expectedOutput: "" }]);
  const [gradingTestcases, setGradingTestcases] = useState([{ input: "", expectedOutput: "" }]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };
  const addExample = () => setExamples([...examples, { input: "", output: "", explanation: "" }]);
  const removeExample = (index) => setExamples(examples.filter((_, i) => i !== index));

  const handleRunTestcaseChange = (index, field, value) => {
    const newTestcases = [...runTestcases];
    newTestcases[index][field] = value;
    setRunTestcases(newTestcases);
  };
  const addRunTestcase = () => setRunTestcases([...runTestcases, { input: "", expectedOutput: "" }]);
  const removeRunTestcase = (index) => setRunTestcases(runTestcases.filter((_, i) => i !== index));

  const handleGradingTestcaseChange = (index, field, value) => {
    const newTestcases = [...gradingTestcases];
    newTestcases[index][field] = value;
    setGradingTestcases(newTestcases);
  };
  const addGradingTestcase = () => setGradingTestcases([...gradingTestcases, { input: "", expectedOutput: "" }]);
  const removeGradingTestcase = (index) => setGradingTestcases(gradingTestcases.filter((_, i) => i !== index));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (examples.length === 0 || runTestcases.length === 0 || gradingTestcases.length === 0) {
        throw new Error("You must provide at least one Example, one Preview Testcase, and one Grading Testcase.");
      }

      const formattedExamples = examples.map((ex, idx) => ({ ...ex, id: idx + 1 }));

      const payload = {
        title,
        difficulty,
        description,
        examples: formattedExamples,
        constraints: constraints.trim(),
        defaultCode: JSON.stringify(codeTemplates),
        run_testcases: runTestcases,
        grading_testcases: gradingTestcases,
        timelimit: Number(timeLimit),
        memorylimit: Number(memoryLimit),
      };

      const res = await axios.post("/api/create_problem", payload);
      if (res.status === 200) {
        setSuccess("Problem created successfully! Redirecting to problems board...");
        setTimeout(() => {
          router.push("/problems");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to create problem. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)] text-white flex flex-col">
      <nav className="relative z-50 px-8 py-5 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-white text-2xl font-bold tracking-widest">JudgeCode</span>
          </Link>
          <Link href="/problems" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            &larr; Back to Problems
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent mb-3">
            Create Custom Challenge
          </h1>
          <p className="text-gray-400 text-lg">
            Design a new coding problem with custom instructions, runtime constraints, and grading testcases.
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/30 border border-rose-800/40 p-4 rounded-xl text-rose-200 text-sm mb-8">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl text-emerald-200 text-sm mb-8">
            {success}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-8 bg-white/[0.02] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Challenge Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Find First Unique Character"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Time Limit (milliseconds)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                required
                placeholder="2000"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Memory Limit (Megabytes)</label>
              <input
                type="number"
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(e.target.value)}
                required
                placeholder="256"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Problem Description (Markdown supported)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              placeholder="Provide a clear description of the problem, parameters, and return outputs..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Constraints (One per line)</label>
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              rows={3}
              placeholder="e.g.&#10;1 <= nums.length <= 10^4&#10;-10^9 <= nums[i] <= 10^9"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors font-mono"
            />
          </div>

          {/* Code Templates Section */}
          <div className="bg-black/20 p-5 rounded-xl border border-white/5">
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-4">Initial Code Templates</label>
            <div className="flex space-x-2 mb-3">
              {['javascript', 'python', 'cpp'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === lang ? 'bg-orange-500 text-white shadow-md' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/15'}`}
                >
                  {lang === 'cpp' ? 'C++' : lang}
                </button>
              ))}
            </div>
            <textarea
              value={codeTemplates[activeTab]}
              onChange={(e) => setCodeTemplates({ ...codeTemplates, [activeTab]: e.target.value })}
              rows={6}
              placeholder={`Write the initial template code for ${activeTab === 'cpp' ? 'C++' : activeTab}...`}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors font-mono"
            />
          </div>

          {/* Examples Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider">Examples</label>
              <button type="button" onClick={addExample} className="text-orange-400 hover:text-orange-300 text-sm font-medium">+ Add Example</button>
            </div>
            <div className="space-y-4">
              {examples.map((ex, idx) => (
                <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 relative">
                  <button type="button" onClick={() => removeExample(idx)} className="absolute top-2 right-3 text-gray-500 hover:text-rose-500 font-bold">&times;</button>
                  <div className="text-xs text-gray-500 mb-2 font-mono">Example {idx + 1}</div>
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <textarea value={ex.input} onChange={(e) => handleExampleChange(idx, 'input', e.target.value)} placeholder="Input (e.g. nums = [2,7,11,15], target = 9)" required className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-mono" rows={2}></textarea>
                    <textarea value={ex.output} onChange={(e) => handleExampleChange(idx, 'output', e.target.value)} placeholder="Output (e.g. 0 1)" required className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-mono" rows={2}></textarea>
                  </div>
                  <textarea value={ex.explanation} onChange={(e) => handleExampleChange(idx, 'explanation', e.target.value)} placeholder="Explanation (Optional)" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-mono" rows={1}></textarea>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Testcases Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider">Preview Testcases (Visible to User)</label>
              <button type="button" onClick={addRunTestcase} className="text-orange-400 hover:text-orange-300 text-sm font-medium">+ Add Testcase</button>
            </div>
            <div className="space-y-4">
              {runTestcases.map((tc, idx) => (
                <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 relative">
                  <button type="button" onClick={() => removeRunTestcase(idx)} className="absolute top-2 right-3 text-gray-500 hover:text-rose-500 font-bold">&times;</button>
                  <div className="text-xs text-gray-500 mb-2 font-mono">Testcase {idx + 1}</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <textarea value={tc.input} onChange={(e) => handleRunTestcaseChange(idx, 'input', e.target.value)} placeholder="Raw Input (e.g. 4\n2 7 11 15\n9)" required className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-mono" rows={2}></textarea>
                    <textarea value={tc.expectedOutput} onChange={(e) => handleRunTestcaseChange(idx, 'expectedOutput', e.target.value)} placeholder="Expected Output (e.g. 0 1)" required className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-mono" rows={2}></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grading Testcases Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider">Grading Testcases (Hidden)</label>
              <button type="button" onClick={addGradingTestcase} className="text-orange-400 hover:text-orange-300 text-sm font-medium">+ Add Grading Testcase</button>
            </div>
            <div className="space-y-4">
              {gradingTestcases.map((tc, idx) => (
                <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 relative">
                  <button type="button" onClick={() => removeGradingTestcase(idx)} className="absolute top-2 right-3 text-gray-500 hover:text-rose-500 font-bold">&times;</button>
                  <div className="text-xs text-gray-500 mb-2 font-mono">Grading Testcase {idx + 1}</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <textarea value={tc.input} onChange={(e) => handleGradingTestcaseChange(idx, 'input', e.target.value)} placeholder="Raw Input" required className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-mono" rows={2}></textarea>
                    <textarea value={tc.expectedOutput} onChange={(e) => handleGradingTestcaseChange(idx, 'expectedOutput', e.target.value)} placeholder="Expected Output" required className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-mono" rows={2}></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-base mt-4"
          >
            {loading ? "Creating Challenge..." : "Publish Problem"}
          </button>
        </form>
      </div>
    </div>
  );
}

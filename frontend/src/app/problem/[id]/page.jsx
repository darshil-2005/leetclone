"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { PanelResizeHandle, Panel, PanelGroup } from "react-resizable-panels";
import Editor, {loader} from "@monaco-editor/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import Example from "../example";
import Constraint from "../constraint";
import Testcase from "../testcase";
import axios from "axios";

export default function ProblemPage({ params }) {
  const { id } = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [codeMap, setCodeMap] = useState({
    javascript: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    if (input.length < 3) return;
    const n = parseInt(input[0]);
    const nums = input[1].trim().split(/\\s+/).map(Number);
    const target = parseInt(input[2]);
    
    // Write your code here
    
}

solve();`,
    python: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:n+1]]
    target = int(input_data[n+1])
    
    # Write your code here
    
if __name__ == '__main__':
    solve()`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    int target;
    cin >> target;
    
    // Write your code here
    
    return 0;
}`
  });

  const code = codeMap[language];
  const setCode = (newCode) => {
    setCodeMap(prev => ({ ...prev, [language]: newCode }));
  };

  const [testcases, setTestcases] = useState([]);
  const [user, setUser] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("problem");
  const [checkingCode, setCheckingCode] = useState(false);
  const [pastSubmissions, setPastSubmissions] = useState([]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get("/api/me");
        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  const fetchPastSubmissions = useCallback(async () => {
    if (!id) return;
    try {
      const res = await axios.get(`/api/submissions?problemId=${id}`);
      setPastSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error("Failed to fetch past submissions:", err);
    }
  }, [id]);


  useEffect(() => {
    if (!id) return;
    async function loadProblem() {
      try {
        const res = await axios.get(`/api/problem/${id}`);
        const p = res.data.problem;
        if (p) {
          const constraints = typeof p.constraints === "string"
            ? p.constraints.split(/\\n|\n/).filter(Boolean)
            : p.constraints || [];
          
          setProblem({ ...p, constraints });
          setTestcases(p.run_testcases || []);
          
          if (p.defaultCode) {
            try {
              const parsedCode = JSON.parse(p.defaultCode);
              setCodeMap(prev => ({
                ...prev,
                ...(parsedCode.javascript && { javascript: parsedCode.javascript }),
                ...(parsedCode.python && { python: parsedCode.python }),
                ...(parsedCode.cpp && { cpp: parsedCode.cpp })
              }));
            } catch {
              setCodeMap(prev => ({
                ...prev,
                javascript: p.defaultCode
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error loading problem:", err);
      }
    }
    loadProblem();
  }, [id]);

  useEffect(() => {
    loader.init().then((monaco) => {
    monaco.editor.defineTheme('transparentTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#00000000",            // transparent editor
            "editorGutter.background": "#00000000",       // transparent gutter (line numbers)
            "minimap.background": "#00000000",   
        },
    });
});
  }, []);

  const fetchSubmision = async (submissionId) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submission/${submissionId}`
    );
    return response;
  };

  function resetCode() {
    if (problem?.defaultCode) {
      try {
        const parsedCode = JSON.parse(problem.defaultCode);
        if (parsedCode[language]) {
          setCode(parsedCode[language]);
          return;
        }
      } catch {
        if (language === 'javascript') {
          setCode(problem.defaultCode);
          return;
        }
      }
    }
    
    const fallbackTemplates = {
      javascript: `// Write your JavaScript code here\n`,
      python: `# Write your Python code here\n`,
      cpp: `// Write your C++ code here\n`
    };
    setCode(fallbackTemplates[language] || "");
  }

  async function handleExecuteCode(mode) {
    if (!user) {
      alert("You must be logged in to run or submit code!");
      router.push("/login");
      return;
    }
    setSubmission(null);
    setResult(null);
    setCheckingCode(true);
    const data = {
      userId: user,
      problemId: problem.id,
      mode: mode,
      testcases: testcases,
      language: language,
      code: code,
      time_limit: problem.timelimit ?? 2000,
      memory_limit: problem.memorylimit ?? 256,
    };

    let response;
    try {
      response = await axios.post(
        `/api/check_code`,
        data
      );
    } catch (error) {
      alert(error.response?.data?.error || error.message);
      setCheckingCode(false);
      return;
    }

    if (response.status === 200) {
      const interval = setInterval(async () => {
        let submissionId = response.data.submissionId;
        if (submissionId) {
          response = await fetchSubmision(submissionId);
          if (response?.data?.result) {
            const resultObj = response.data.result;
            setSubmission(resultObj);
            setResult(JSON.parse(resultObj.result));
            setTab("submission");
            setCheckingCode(false);
            clearInterval(interval);
            clearTimeout(timeout);
            fetchPastSubmissions();
          }
        }
      }, 3000);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setCheckingCode(false);
      }, 30000);
    }
  }

  if (!problem) {
    return (
      <div className="h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)] text-white flex items-center justify-center">
        <div className="text-2xl tracking-widest animate-pulse font-light">Loading Problem...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)]

 text-white flex flex-col">

      <div className="flex justify-between items-center py-4 px-8 border-b border-white/5 bg-black/20 z-1">
        <Link href="/problems" className="text-3xl tracking-widest font-semibold hover:opacity-85 transition-opacity">
          JudgeCode
        </Link>
        <div className="flex gap-4 items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black border border-white/20 text-white rounded px-3 py-1.5 focus:outline-none text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          <button
            className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-1.5 rounded text-sm font-semibold transition-all disabled:opacity-50"
            onClick={() => handleExecuteCode("run")}
            disabled={checkingCode}
          >
            {checkingCode ? "..." : "Run"}
          </button>
          <button
            className="bg-gradient-to-r from-orange-500 to-rose-600 text-white px-5 py-1.5 rounded text-sm font-semibold shadow-lg hover:from-orange-600 hover:to-rose-700 transition-all disabled:opacity-50"
            onClick={() => handleExecuteCode("submit")}
            disabled={checkingCode}
          >
            {checkingCode ? "..." : "Submit"}
          </button>
          <button
            className="border border-white/20 hover:bg-white/5 px-4 py-1.5 rounded text-sm font-semibold transition-all"
            onClick={resetCode}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden rounded-xl p-2">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel className="flex-1">
            <div className=" border rounded-md mx-4 h-8 flex justify-evenly">
              <button
                className={`px-3 rounded-md w-1/2 text-xl tracking-wider ${
                  tab === "problem" ? "bg-white text-black" : ""
                }`}
                onClick={() => setTab("problem")}
              >
                Problem
              </button>
              <button
                className={`px-3 rounded-md w-1/2 text-xl tracking-wider ${
                  tab === "submission" ? "bg-white text-black" : ""
                }`}
                onClick={() => {
                  setTab("submission");
                  fetchPastSubmissions();
                }}
              >
                Submission
              </button>
            </div>
            {tab == "problem" && (
              <div className="h-full overflow-auto  flex flex-col p-6 pb-8">
                <p className="text-4xl mb-6 font-semibold tracking-wide">
                  {problem?.title}
                </p>
                <p className="text-2xl mb-4">Problem Statement:</p>
                <div className="mb-12">
                  <Markdown>{problem?.description}</Markdown>
                </div>
                {problem?.examples &&
                  problem?.examples.map((example, index) => (
                    <Example
                      key={index}
                      example={example}
                      exampleIndex={index}
                    />
                  ))}
                {problem?.constraints &&
                  problem?.constraints.map((constraint, index) => (
                    <Constraint key={index} constraint={constraint} />
                  ))}
              </div>
            )}

            {tab === "submission" && (
              <div className="h-full overflow-auto flex flex-col p-6 gap-6">
                {submission ? (
                  /* Detailed View of Selected Submission */
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <p className="text-2xl font-bold tracking-wide">
                        Submission Details
                      </p>
                      <button
                        onClick={() => setSubmission(null)}
                        className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium transition-all"
                      >
                        &larr; Back to History
                      </button>
                    </div>

                    <div className="text-lg space-y-1">
                      <p>
                        <strong>ID:</strong> <span className="text-gray-300 font-mono text-sm">{submission.submissionId}</span>
                      </p>
                      <p>
                        <strong>Language:</strong> <span className="text-gray-300 capitalize">{submission.language}</span>
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-sm ${
                            submission.status === "accepted"
                              ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                              : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                          }`}
                        >
                          {submission.status.toUpperCase()}
                        </span>
                      </p>
                    </div>

                    {submission.status === "wrong answer" && result && (
                      <div className="mt-4">
                        <p className="text-xl font-semibold mb-2 text-rose-400">
                          ❌ Failed Test Case Input:
                        </p>
                        <pre className="bg-rose-950/20 border border-rose-800/30 p-4 rounded-md text-rose-100 font-mono text-sm whitespace-pre-wrap">
                          {typeof result.input === "string" ? result.input : JSON.stringify(result.input)}
                        </pre>
                      </div>
                    )}

                    {submission.status === "accepted" && (
                      <div className="mt-4 bg-emerald-950/20 border border-emerald-800/30 p-4 rounded-lg">
                        <p className="text-xl font-semibold text-emerald-400">
                          ✅ All test cases passed!
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {result?.testsPassed ?? testcases.length}/{result?.totalTests ?? testcases.length} tests passed in {result?.durationMs ?? 0} ms.
                        </p>
                      </div>
                    )}

                    {result?.output && (
                      <div>
                        <div className="text-sky-400 text-lg font-semibold mb-1">📝 Output: </div>
                        <pre className="bg-sky-950/20 border border-sky-800/30 p-3 rounded-md text-sm text-sky-100 font-mono whitespace-pre-wrap">{result.output}</pre>
                      </div>
                    )}

                    {result?.expectedOutput && (
                      <div>
                        <div className="text-emerald-400 text-lg font-semibold mb-1">🧾 Expected Output: </div>
                        <pre className="bg-emerald-950/20 border border-emerald-800/30 p-3 rounded-md text-sm text-emerald-100 font-mono whitespace-pre-wrap">
                          {typeof result.expectedOutput === "string" ? result.expectedOutput : JSON.stringify(result.expectedOutput)}
                        </pre>
                      </div>
                    )}

                    {result?.stdout && (
                      <div>
                        <div className="text-amber-400 text-lg font-semibold mb-1">🧾 Standard Output: </div>
                        <pre className="bg-amber-950/20 border border-amber-800/30 p-3 rounded-md text-sm text-amber-100 font-mono whitespace-pre-wrap">{result.stdout}</pre>
                      </div>
                    )}

                    {result?.stderr && (
                      <div>
                        <div className="text-rose-400 text-lg font-semibold mb-1">🚨 Error (Stderr): </div>
                        <pre className="bg-rose-950 border border-rose-800 p-4 rounded-md text-sm text-rose-100 overflow-x-auto whitespace-pre-wrap font-mono">{result.stderr}</pre>
                      </div>
                    )}

                    {typeof result?.durationMs === "number" && (
                      <div>
                        <div className="text-violet-400 text-lg font-semibold mb-1">⏱️ Execution Time: </div>
                        <div className="bg-violet-950/20 border border-violet-800/30 px-4 py-2.5 rounded-md text-sm text-violet-200 font-mono">{result.durationMs} ms</div>
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-lg font-semibold mb-2 text-gray-300">
                        📄 Submitted Code:
                      </p>
                      <pre className="bg-black/40 border border-white/5 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
                        <code>{submission.code}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  /* Submissions History List */
                  <div className="flex flex-col gap-4">
                    <p className="text-2xl font-bold tracking-wide border-b border-white/10 pb-4">
                      Submission History
                    </p>
                    {pastSubmissions.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        You have not submitted any solutions for this problem yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {pastSubmissions.map((sub, idx) => (
                          <div
                            key={sub.submissionId || idx}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-xl flex justify-between items-center transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  sub.status === "accepted"
                                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                    : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                                }`}
                              >
                                {sub.status}
                              </span>
                              <div className="text-sm text-gray-400">
                                ID: <span className="font-mono">{sub.submissionId.slice(0, 8)}...</span> &bull; Language: <span className="capitalize">{sub.language}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSubmission(sub);
                                setResult(JSON.parse(sub.result));
                              }}
                              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Panel>
          <PanelResizeHandle className="h-24 my-auto mx-1 w-1 rounded-2xl bg-gray-300 hover:bg-sky-600 hover:h-full transition-colors" />
          {/* Monaco Editor */}
          <Panel className="flex-1">
            <PanelGroup direction="vertical" className="w-full">
              <Panel className="flex-1 rounded-sm">
                <Editor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language === "python" ? "python" : "javascript"}
                  value={code}
                  onChange={setCode}
                  theme="transparentTheme"
                  options={{
                    minimap: { enabled: false },
                    padding: {
                      top: 20,
                      bottom: 20,
                    },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: "on",
                    tabSize: 2,
                    renderLineHighlight: "none",
                  }}
                />
              </Panel>

              <PanelResizeHandle className="h-1 rounded w-24 mx-auto my-0.5 bg-gray-300 hover:bg-sky-600 hover:w-full transition-colors" />

              <Panel className="flex-1">
                <div className="overflow-y-auto h-full p-4 rounded-md">
                  <p className="text-2xl tracking-wide font-semibold mb-4">
                    Test Cases
                  </p>
                  {testcases &&
                    testcases.map((testcase, idx) => (
                      <Testcase key={idx} testcase={testcase} index={idx} />
                    ))}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

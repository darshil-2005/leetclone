"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { PanelResizeHandle, Panel, PanelGroup } from "react-resizable-panels";
import Editor, {loader} from "@monaco-editor/react";
import problem1 from "./problem";
import Markdown from "react-markdown";
import Example from "../example";
import Constraint from "../constraint";
import Testcase from "../testcase";
import axios from "axios";
import ViewSubmissionsButton from "../../components/ViewSubmissionsButton";

export default function ProblemPage({ params }) {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(problem?.defaultCode);
  const [testcases, setTestcases] = useState(problem?.testcases);
  const [user, setUser] = useState(123);
  const [submission, setSubmission] = useState(null);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("problem");
  const [checkingCode, setCheckingCode] = useState(false);

  useEffect(() => {
    setProblem(problem1);
    setCode(problem1.defaultCode);
    setTestcases(problem1.testcases);

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
    setCode(problem?.defaultCode);
  }

  async function handleSubmitCode() {
    // setSubmissionId(null);
    setSubmission(null);
    setCheckingCode(true);
    const data = {
      userId: user,
      problemId: problem.id,
      mode: "run",
      //handle testcases properly for submit case
      testcases: testcases,
      function_name: problem.function_name,
      params_types: problem.param_types,
      return_type: problem.return_type,
      code: code,
      time_limit: 2000,
      memory_limit: problem.memory_limit,
    };

    let response;
    try {
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/check_code`,
        data
      );
    } catch (error) {
      alert(error);
      setCheckingCode(false);
    }

    if (response.status === 200) {
      const interval = setInterval(async () => {
        console.log(response);
        let submissionId = response.data.submissionId;
        if (submissionId) {
          response = await fetchSubmision(submissionId);
          setSubmission(response?.data?.result);
          setResult(JSON.parse(response?.data?.result?.result));
          console.log(result);
          setCheckingCode(false);
          clearInterval(interval);
          clearTimeout(timeout);
        }
      }, 5000);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 20000);

      clearTimeout(timeout);
  }
}

  return (
    <div className="h-screen bg-[radial-gradient(ellipse_at_center,_#14001f,_#0c0015,_#000000)]

 text-white flex flex-col">

      <div className="flex justify-between items-center py-4 z-1">
        <div className="mx-8 text-4xl tracking-widest">LeetClone</div>
        <div className="flex mr-8 gap-x-8 items-center">
          {/* <button className="border px-4 py-1 rounded">Run</button> */}
          <button
            className={`border px-4 py-1 rounded ${
              checkingCode
                ? "rotate-180 transition-transform duration-1000"
                : ""
            }`}
            onClick={handleSubmitCode}
            disabled={checkingCode}
          >
            {checkingCode ? "+++" : "Submit"}
          </button>
          <button className="border px-4 py-1 rounded" onClick={resetCode}>
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
                onClick={() => setTab("submission")}
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

            {tab === "submission" && submission && (
              <div className="h-full overflow-auto  flex flex-col p-6 gap-4">
                <p className="text-2xl font-bold tracking-wide">
                  Submission ID:{" "}
                  <span className="text-gray-200">
                    {submission.submissionId}
                  </span>
                </p>

                <div className="text-lg space-y-1">
                  <p>
                    <strong>By:</strong> {submission.userId}
                  </p>
                  <p>
                    <strong>Problem ID:</strong> {submission.problemId}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold px-2 py-1 rounded ${
                        submission.status === "accepted"
                          ? "text-green-800 bg-green-200"
                          : "text-red-800 bg-red-200"
                      }`}
                    >
                      {submission.status.toUpperCase()}
                    </span>
                  </p>
                </div>

                {submission.status === "wrong answer" && submission.result && (
                  <div className="mt-4">
                    <p className="text-xl font-semibold mb-2 text-red-700">
                      ❌ Failed Test Cases:
                    </p>
                    <div className="bg-red-100 flex items-center border border-red-300 py-2 px-4 rounded-md text-red-900">
                      {/* result.input = [[0,1,2,3], 9] */}
                      <div className="flex flex-col text-lg">
                        <pre>
                          {result.input.map((d, i) => {
                            return `${d}\n`
                          })}
                        </pre>
                      </div>             
                    </div>

                  </div>
                )}

                {submission.status === "accepted" && (
                  <div className="mt-4">
                    <p className="text-xl font-semibold text-green-700">
                      ✅ All test cases passed!
                    </p>
                  </div>
                )}


                <div>
                        <div className="text-sky-400 text-xl font-semibold mb-2">📝 Output: </div>
                        <div className="bg-sky-100 border border-sky-300 h-12 flex items-center px-4 rounded-md text-lg text-sky-950">{result?.output}</div>
                </div>   

                <div>
                        <div className="text-green-400 text-xl font-semibold mb-2">🧾 Expected Output: </div>
                        <div className="bg-green-100 border border-green-300 h-12 flex items-center px-4 rounded-md text-lg text-sky-950">{JSON.stringify(result?.expectedOutput)}</div>
                </div>   

                <div>
                        <div className="text-amber-400 text-xl font-semibold mb-2">🧾 Standard Output: </div>
                        <div className="bg-amber-100 border border-amber-300 h-12 flex items-center px-4 rounded-md text-lg text-sky-950">{result?.stdout}</div>
                </div>   

                <div className="mt-6">
                  <p className="text-xl font-semibold mb-2">
                    📄 Submitted Code:
                  </p>
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
                    <code>{submission.code}</code>
                  </pre>
                </div>
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
                  language={"javascript"}
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

export { ViewSubmissionsButton };

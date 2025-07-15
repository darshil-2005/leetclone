import React from 'react'

const Testcase = ({ testcase, index }) => {
  return (
    <div className="mb-4 p-4 shadow-md rounded-lg border">
      <div className="text-lg mb-1">Test Case {index + 1}</div>
      <div>
        <span className="font-semibold">Input:</span>
        <pre className="p-2 pl-4 rounded border text-md mt-1 overflow-x-auto">{testcase.input.map((line) => `${line}`).join('\n')}</pre>
      </div>
      <div className="mt-2">
        <span className="font-semibold">Expected Output:</span>
        <pre className="p-2 rounded border text-md mt-1 overflow-x-auto">{JSON.stringify(testcase.expectedOutput)}</pre>
      </div>
    </div>
  )
}

export default Testcase
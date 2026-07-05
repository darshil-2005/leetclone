import React from 'react'

const Testcase = ({ testcase, index }) => {
  return (
    <div className="mb-5 p-5 shadow-lg rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="text-xl mb-4 font-semibold text-white">Test Case {index + 1}</div>
      <div>
        <span className="font-semibold text-fuchsia-400">Input:</span>
        <div className="p-4 rounded-lg bg-black/40 border border-white/5 text-sm font-mono mt-2 overflow-x-auto whitespace-pre-wrap text-gray-100 shadow-inner">
          {typeof testcase.input === 'string' ? testcase.input : JSON.stringify(testcase.input)}
        </div>
      </div>
      <div className="mt-4">
        <span className="font-semibold text-fuchsia-400">Expected Output:</span>
        <div className="p-4 rounded-lg bg-black/40 border border-white/5 text-sm font-mono mt-2 overflow-x-auto whitespace-pre-wrap text-gray-100 shadow-inner">
          {typeof testcase.expectedOutput === 'string' ? testcase.expectedOutput : JSON.stringify(testcase.expectedOutput)}
        </div>
      </div>
    </div>
  )
}

export default Testcase
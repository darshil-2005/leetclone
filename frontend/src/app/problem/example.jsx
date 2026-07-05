import React from 'react'

const Example = ({example, exampleIndex}) => {

    const {input, output, explanation} = example;
    return (
    <div className='mb-6'>
        <div className='text-2xl font-semibold mb-3'>Example {exampleIndex + 1}:</div>
        <div className='bg-white/5 backdrop-blur-sm rounded-lg p-5 font-mono text-sm border border-white/10 shadow-lg'>
            <div className='mb-4'>
                <span className='font-bold text-fuchsia-400'>Input:</span>
                <div className='whitespace-pre-wrap text-gray-100 mt-2 pl-3 border-l-2 border-fuchsia-500/50'>{input}</div>
            </div>
            <div className='mb-4'>
                <span className='font-bold text-fuchsia-400'>Output:</span>
                <div className='whitespace-pre-wrap text-gray-100 mt-2 pl-3 border-l-2 border-fuchsia-500/50'>{output}</div>
            </div>
            {explanation && (
                <div>
                    <span className='font-bold text-fuchsia-400'>Explanation:</span>
                    <div className='whitespace-pre-wrap text-gray-300 mt-2 pl-3'>{explanation}</div>
                </div>
            )}
        </div>
    </div>
    )
}

export default Example
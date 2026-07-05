import React from 'react'

const Constraint = ({constraint}) => {

  return (
    <div className='bg-white/5 border border-white/10 text-fuchsia-200 font-mono text-sm rounded-lg py-2 px-4 mb-3 shadow-lg backdrop-blur-sm block w-fit'>
        {constraint}
    </div>
  )
}

export default Constraint
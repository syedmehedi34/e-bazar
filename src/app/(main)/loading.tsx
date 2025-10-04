import React from 'react'

const Loader = () => {
  return (
    <div className='w-full min-h-screen flex  flex-col gap-2 justify-center items-center'>

      <span className="loading loading-bars loading-xl"></span>
      <p className="text-gray-600 text-sm font-medium">Thinking...</p>
    </div>

  )
}

export default Loader
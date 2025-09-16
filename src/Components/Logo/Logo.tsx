import React from 'react'

const Logo = ({logoColor }: any) => {
  return (
    <div>
        <h2 className='font-bold rubik '><span className={`text-3xl ${logoColor ? `text-${logoColor}`:"text-black"}`}>E</span>-bazaar</h2>
    </div>
  )
}

export default Logo
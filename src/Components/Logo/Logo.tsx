import React from 'react'

interface LogoProps {
  logoColor?: string;
}

const Logo: React.FC<LogoProps> = ({ logoColor }) => {
  return (
    <div>
        <h2 className='font-bold rubik '><span className={`text-3xl ${logoColor ? `text-${logoColor}`:""}`}>E</span>-bazaar</h2>
    </div>
  )
}

export default Logo
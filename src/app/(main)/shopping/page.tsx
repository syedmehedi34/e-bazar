import Link from 'next/link'
import React from 'react'

const Shopping = async () => {
    const res = await fetch('http://localhost:5000/shopping');
    const data = await res.json();
    
  return (
    <div className='min-h-screen'>
        <div className='w-11/12 mx-auto'>
           <div className='flex justify-between items-center py-5'>
                <div className='flex gap-2 text-sm'>
                    <Link href={'/'}>Home</Link>
                    <Link href={'/shopping'}>Shopping</Link>
                </div>
                <div className='flex items-center gap-5'>
                    <p className='flex gap-2'>Showing <span>0</span> Result</p>
                    <select name="" id="" className='select w-[300px]'>
                        <option value="latest" >Latest</option>
                        <option value="older">Older</option>
                        <option value="low-high">Low and High</option>
                        <option value="high-low">High and Low</option>
                    </select>
                </div>
           </div>
           <div>
                <div></div>
                <div>
                    {JSON.stringify(data)}
                </div>
           </div>
        </div>
    </div>
  )
}

export default Shopping
'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import { usePathname } from 'next/navigation'


const Navbar = () => {

  const [scrollY, setScrollY] = useState(0);
  const path = usePathname()


  useEffect(() => {
    const handleScrollY = () => {
      setScrollY(window.scrollY);
    }

    window.addEventListener('scroll', handleScrollY);

    return () => {
      window.removeEventListener('scroll', handleScrollY)
    }

  }, [])

  const navitem = <>
    <ul className='lg:flex items-center gap-10 rubik '>
      <Link className='text-[15px] font-medium leading-6 text-gray-950 ' href={'/'}>Home</Link>
      <Link className='text-[15px] font-medium leading-6 text-gray-950 ' href={'/'}>Shop</Link>
      <Link className='text-[15px] font-medium leading-6 text-gray-950 ' href={'/page/about'}>About Us</Link>
      <Link className='text-[15px] font-medium leading-6 text-gray-950 ' href={'/'}>Blog</Link>
      <Link className='text-[15px] font-medium leading-6 text-gray-950 ' href={'/'}>Contact</Link>
    </ul>

  </>

  return (
    <header  className={`z-100  ${path === "/"
        ? scrollY > 50
          ? "fixed-nav bg-white shadow"
          : "absolute top-0 left-0 bg-transparent w-full"
        : scrollY > 50
          ? "fixed-nav bg-white shadow"
          : "bg-white shadow"
        }`}>
      <div className="w-11/12 mx-auto flex items-center py-4  ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <div
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow ">
              {navitem}
            </div>
          </div>
          <Link href={'/'}>
            <Logo />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">

          {navitem}

        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
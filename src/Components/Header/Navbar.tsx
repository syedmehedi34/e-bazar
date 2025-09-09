'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import { usePathname } from 'next/navigation'
import { BsCartCheckFill } from "react-icons/bs";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { BsBoxArrowInRight } from "react-icons/bs";
import LoginPage from '../Login/login'

const Navbar = () => {

  const [scrollY, setScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false)
  const path = usePathname()


  const handletoggle = () => {
    setIsOpen(!isOpen)
  }

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
      <Link className='text-[15px] font-medium leading-6 ' href={'/'}>Home</Link>
      <Link className='text-[15px] font-medium leading-6 ' href={'/'}>Shop</Link>
      <Link className='text-[15px] font-medium leading-6 ' href={'/about'}>About Us</Link>
      <Link className='text-[15px] font-medium leading-6 ' href={'/'}>Blog</Link>
      <Link className='text-[15px] font-medium leading-6 ' href={'/login'}>login</Link>
    </ul>

  </>

  return (
    <header className={`z-100  ${path === "/"
      ? scrollY > 50
        ? "fixed-nav bg-gradient text-white  shadow-gray-700 shadow-sm"
        : "absolute top-0 left-0 bg-transparent w-full"
      : scrollY > 50
        ? "fixed-nav bg-white shadow"
        : "bg-gradient shadow "
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
          <div className='mr-10 flex items-center gap-5'>
            <div className='relative'>
              <Link href={'/car'}>
                <BsCartCheckFill size={24} />
              </Link>
              <div className='absolute -top-2 -right-2 font-bold'>0</div>
            </div>
            <div className='relative'>
              <Link href={'/car'}>
                <FaHeartCircleCheck size={24} />

              </Link>
              <div className='absolute -top-2 -right-2 font-bold'>0</div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <button onClick={handletoggle} className={`justify-center text-rubik font-bold ${path === '/'? "btn btn-outline rounded hover:bg-red-600 hover:text-white":"btn btn-outline rounded hover:bg-red-600 hover:text-white"}`}>
              <BsBoxArrowInRight />
              Login
            </button>
            {/* <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div> */}
            {/* <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 py-4 space-y-4 shadow cursor-pointer">
              <li>
                <Link href={'#'} className="justify-between text-rubik font-bold text-gray-900">
                  Profile

                </Link>
              </li>
              <li><Link href={"#"} className="justify-between text-rubik font-bold text-gray-900">Settings</Link></li>
              <li>
              
                </li>
            </ul> */}
          </div>
        </div>
      </div>

      {
        isOpen && <LoginPage onClose={handletoggle} />
      }
    </header>
  )
}

export default Navbar
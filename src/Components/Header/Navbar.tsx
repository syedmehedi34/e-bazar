'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import { usePathname } from 'next/navigation'
import { BsCartCheckFill } from "react-icons/bs";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { BsBoxArrowInRight } from "react-icons/bs";
import dynamic from "next/dynamic";
import Register from '../Register/Register'
import { signOut, useSession } from 'next-auth/react'
import Swal from 'sweetalert2'

const LoginPage = dynamic(() => import("@/Components/Login/login"), { ssr: false });

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Login modal
  const [isOpenRegisterPage, setIsOpenRegisterPage] = useState(false); // Register modal
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu toggle

  const path = usePathname()
  const { data: session } = useSession()
  console.log(session)

  useEffect(() => {
    const handleScrollY = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScrollY);
    return () => window.removeEventListener('scroll', handleScrollY);
  }, [])

  const handleLogout = async () => {
    try {
      await signOut();
      Swal.fire({
        icon: 'success',
        title: "Logout successfully!"
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: "Logout Failed!"
      })
    }
  }
  const navItems = (
    <>
      <Link href={'/'} className='text-[15px] font-medium leading-6'>Home</Link>
      <Link href={'/'} className='text-[15px] font-medium leading-6'>Shop</Link>
      <Link href={'/about'} className='text-[15px] font-medium leading-6'>About Us</Link>
      <Link href={'/'} className='text-[15px] font-medium leading-6'>Blog</Link>
    </>
  )

  return (
    <header className={`w-full z-100 ${path === "/" ? (scrollY > 50 ? "fixed bg-black/70 text-white shadow" : "absolute bg-transparent") : (scrollY > 50 ? "fixed bg-white shadow" : "bg-gradient shadow")}`}>
      <div className="w-11/12 mx-auto flex items-center justify-between py-4">
        <div className='flex items-center gap-4'>
          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden  cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          {/* Logo */}
          <Link href={'/'}>
            <Logo />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-10">{navItems}</nav>

        {/* Icons + Auth Buttons */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Link href={'/cart'}><BsCartCheckFill size={24} /></Link>
            <span className='absolute -top-2 -right-2 font-bold'>0</span>
          </div>
          <div className="relative">
            <Link href={'/cart'}><FaHeartCircleCheck size={24} /></Link>
            <span className='absolute -top-2 -right-2 font-bold'>0</span>
          </div>

          {/* Login / Register */}
          {!session?.user ? (
            <div className='hidden lg:block'>
              <button onClick={() => setIsOpen(true)} className="btn btn-outline hover:bg-purple-600 hover:border-none rounded-md hover:text-white transition-all duration-300 mr-2">Login</button>
              <button onClick={() => setIsOpenRegisterPage(true)} className="btn btn-outline  hover:bg-purple-600 hover:border-none rounded-md hover:text-white transition-all duration-300">Register</button>
            </div>
          ) : (
            <div className="dropdown dropdown-end ">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-gradient shadow-amber-600 text-white rounded-box w-52 mt-4 space-y-4">
                <li><Link href="#">Profile</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><button onClick={() => handleLogout()} className="btn btn-outline border-none w-full bg-purple-600 hover:bg-red-800 text-white">Logout</button></li>
              </ul>
            </div>
          )}


        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/80 text-white w-[70%]  py-10 px-4 flex flex-col gap-4 items-center">
          {navItems}
          {
            !session?.user && (
              <div className=' lg:hidden flex flex-col w-full gap-2 '>
                <button onClick={() => setIsOpen(true)} className="btn btn-outline hover:bg-purple-600 hover:border-none rounded-md hover:text-white transition-all duration-300">Login</button>
                <button onClick={() => setIsOpenRegisterPage(true)} className="btn btn-outline  hover:bg-purple-600 hover:border-none rounded-md hover:text-white transition-all duration-300">Register</button>
              </div>
            )
          }
        </div>
      )}

      {/* Modals */}
      {isOpen && <LoginPage onClose={() => setIsOpen(false)} />}
      {isOpenRegisterPage && <Register onClose={() => setIsOpenRegisterPage(false)} />}
    </header>
  )
}

export default Navbar

'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import { usePathname } from 'next/navigation'
import { BsCartCheckFill } from "react-icons/bs";
import { FaHeartCircleCheck } from "react-icons/fa6";

import Register from '../Register/Register'
import { signOut, useSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { AxiosError } from 'axios'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import SearchInput from '../SearchInput/SearchInput'
import LoginPage from '../Login/login'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import { FaArrowRightFromBracket } from "react-icons/fa6";



const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRegisterPage, setIsOpenRegisterPage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shoppingCart = useSelector((state: RootState) => state.cart.value);
  const [searchBox, setSearchBox] = useState(false)
  const path = usePathname()
  const { data: session } = useSession()

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
      const err = error as AxiosError<{ message: string }>;
      Swal.fire({
        icon: 'error',
        title: err.response?.data?.message || "Logout Failed!"
      })
    }
  }
  const navItems = (
    <>
      <Link href={'/'} className='text-[15px] font-medium leading-6'>Home</Link>
      <Link href={'/shopping'} className='text-[15px] font-medium leading-6'>Shop</Link>
      <Link href={'/about'} className='text-[15px] font-medium leading-6'>About Us</Link>
      <Link href={'/'} className='text-[15px] font-medium leading-6'>Blog</Link>
    </>
  )



  return (
    <header className={`w-full z-100  ${path === "/" ? (scrollY > 50 ? "fixed-nav bg-gray-800 text-white  shadow " : "shadow bg-white") : (scrollY > 50 ? "fixed-nav bg-gray-800 text-white  shadow " : "bg-gradient shadow")}`}>
      <div className="container-custom flex items-center justify-between py-4">
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
          <div className="">
            <button className='cursor-pointer mt-2' onClick={() => setSearchBox(!searchBox)} ><FaSearch size={20} /></button>

          </div>
          <div className="relative">
            <Link href={'/shopping-cart'}><BsCartCheckFill size={24} /></Link>
            <span className='absolute -top-2 -right-2 font-bold'>{shoppingCart?.length || 0}</span>
          </div>
          <div className="relative">
            <Link href={'/cart'}><FaHeartCircleCheck size={24} /></Link>
            <span className='absolute -top-2 -right-2 font-bold'>0</span>
          </div>

          {/* Login / Register */}
          {!session?.user ? (
            <div className='hidden lg:block'>
              <button onClick={() => setIsOpen(true)} className="btn btn-sm btn-outline border-gray-400 hover:bg-gray-800  rounded-md hover:text-white transition-all duration-300 mr-2">
                Login
                <FaArrowRightFromBracket />
              </button>
              <button onClick={() => setIsOpenRegisterPage(true)} className="btn btn-sm btn-outline  hover:bg-gray-800 rounded-md hover:text-white transition-all duration-300">
                Register
                <FaArrowRightFromBracket />

              </button>
            </div>
          ) : (
            <div className="dropdown dropdown-end ">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 h-10 rounded-full">
                  <Image src={session?.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="Avatar" fill className='rounded-full' />
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white shadow-gray-600 text-gray-800 rounded-box w-52 mt-4 space-y-4">
                <li><Link href="#">Profile</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><button onClick={() => handleLogout()} className="btn btn-outline border-none w-full bg-gray-800 hover:bg-red-800 text-white rounded-box">Logout</button></li>
              </ul>
            </div>
          )}


        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (



          <Sidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} setIsOpenRegisterPage={setIsOpenRegisterPage} isLogin={setIsOpen}  navItems={navItems} />


        )}
      </AnimatePresence>

      {/* Modals */}
      {isOpen && <LoginPage onClose={() => setIsOpen(false)} isOpen={isOpen} />}
      {isOpenRegisterPage && <Register onClose={() => setIsOpenRegisterPage(false)} isOpen ={isOpenRegisterPage} />}
      <AnimatePresence>
        {searchBox && <SearchInput setSearchBox={setSearchBox} searchBox={searchBox} />}
      </AnimatePresence>
    </header>
  )
}

export default Navbar

'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import { CiShoppingCart, CiHeart } from "react-icons/ci";
import { User, ShoppingCart, Box, LifeBuoy, LayoutDashboard } from "lucide-react";
import Register from '../Register/Register'
import { signOut, useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { AxiosError } from 'axios'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import SearchInput from '../SearchInput/SearchInput'
import LoginPage from '../Login/login'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { toast } from 'react-toastify'
import DarkMode from '../DarkMode/DarkMode';





const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRegisterPage, setIsOpenRegisterPage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shoppingCart = useSelector((state: RootState) => state.cart.value);
  const [searchBox, setSearchBox] = useState(false)
  const { data: session } = useSession()
  const dispatch = useDispatch()
  useEffect(() => {
  
    const handleScrollY = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScrollY);
    return () => window.removeEventListener('scroll', handleScrollY);
  }, [])

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout successfully!")
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(`${err.message}`)
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
    <>
      <header className={`w-full shadow dark:bg-gray-800 dark:text-white  ${scrollY > 50 ? "fixed-nav bg-white text-black dark:bg-gray-800 relative" : "relative "} `}>
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
              <button className=' bg-gray-200 p-2 rounded-full cursor-pointer dark:bg-gray-700 dark:text-white transition-all duration-300 ' onClick={() => setSearchBox(!searchBox)} ><FaSearch size={24} /></button>

            </div>
            <div className="relative bg-gray-200 p-2 rounded-full cursor-pointer dark:bg-gray-700 dark:text-white transition-all duration-300">
              <Link href={'/shopping-cart'}><CiShoppingCart size={24} /></Link>
              <span className='absolute -top-2 -right-0 font-bold'>{shoppingCart?.length || 0}</span>
            </div>
            <div className="relative bg-gray-200 p-2 rounded-full cursor-pointer dark:bg-gray-700 dark:text-white transition-all duration-300">
              <Link href={'/cart'}><CiHeart size={24} /></Link>
              <span className='absolute -top-2 -right-0 font-bold'>0</span>
            </div>
            <DarkMode />

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
                <ul tabIndex={0} className="dropdown-content  p-2 shadow bg-white dark:text-white dark:bg-gray-800  text-gray-800 rounded-box w-52 mt-4 ">
                  {
                    session?.user.role?.includes("admin") ? (
                      <>
                        <li className="flex items-center gap-2 mb-4 p-2 hover:bg-gray-600 hover:text-white dark:hover:text-white rounded-box transition-all duration-300">
                          <LayoutDashboard className="text-sm" />
                          <Link href="/dashboard">Dashboard</Link>
                        </li>
                      </>
                    ) : (
                      <div className='flex flex-col gap-4 mb-4 *:hover:bg-gray-300 dark:*:hover:bg-gray-600 *:p-2'>
                        <li className="flex items-center gap-2">
                          <User className="text-sm " />
                          <Link href="/user_profile">My Profile</Link>
                        </li>

                        <li className=" flex items-center gap-2">
                          <ShoppingCart className="text-lg text-gray-800 dark:text-white" />
                          <Link href="/shopping-cart">My Cart</Link>
                        </li>
                        <li className="flex items-center gap-2">
                          <Box className="text-sm" />
                          <Link href="/my_orders">My Orders</Link>
                        </li>
                        <li className="flex items-center gap-2">
                          <LifeBuoy className="text-sm" />
                          <Link href="#">Support</Link>
                        </li>
                      </div>
                    )
                  }


                  <li><button onClick={() => handleLogout()} className="btn btn-outline border-none w-full bg-gray-700 hover:bg-gray-600 text-white rounded-box">Logout</button></li>
                </ul>
              </div>
            )}


          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (



            <Sidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} setIsOpenRegisterPage={setIsOpenRegisterPage} isLogin={setIsOpen} navItems={navItems} />


          )}
        </AnimatePresence>


      </header>
      {/* Modals */}
      {isOpen &&

        <LoginPage onClose={() => setIsOpen(false)} isOpen={isOpen} />

      }

      {isOpenRegisterPage && <Register onClose={() => setIsOpenRegisterPage(false)} isOpen={isOpenRegisterPage} />}
      <AnimatePresence>
        {searchBox && <SearchInput setSearchBox={setSearchBox} searchBox={searchBox} />}
      </AnimatePresence>
    </>
  )
}

export default Navbar

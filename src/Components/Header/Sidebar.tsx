'use client'
import { motion } from 'framer-motion';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

import { IoClose } from 'react-icons/io5';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  navItems: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, navItems, }) => {

  const { data: session } = useSession()
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  return (

    <>


      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] lg:hidden bg-white shadow h-full w-full sm:w-[40%] py-10 px-4 flex flex-col gap-4 items-center "
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='absolute top-4 right-4 btn btn-sm'>
          <IoClose size={20} />
        </button>
        {navItems}

        {!session?.user && (
          <div className="lg:hidden flex flex-col w-full gap-2">
            <Link
              href='/auth/login'
              className="btn btn-outline hover:bg-gray-800 hover:border-none rounded-md hover:text-white transition-all duration-300"
            >
              Login
            </Link>
            <Link
              href='/auth/register'
              className="btn btn-outline hover:bg-gray-800 hover:border-none rounded-md hover:text-white transition-all duration-300"
            >
              Register
            </Link>
          </div>
        )}
      </motion.div>
    </>


  );
};

export default Sidebar;

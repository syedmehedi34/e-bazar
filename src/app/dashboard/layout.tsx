"use client"
import Sidebar from '@/Components/Dashboard/Sidebar';
import './globals.css';
import Navber from '@/Components/Dashboard/Navber';
import SessionWrapper from '@/Components/SessionWrapper/SessionWrapper';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleOpenSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <SessionWrapper>
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Sidebar */}

            <div

              className={`lg:block hidden  transition-all duration-700 fixed h-full bg-white z-[100] w-52 shadow`}>
              <Sidebar />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="fixed top-0 left-0 z-[100] h-full bg-gray-900"
                >
                  <Sidebar />
                </motion.div>
              )}
            </AnimatePresence>


            {/* Main Content */}
            <main className="flex-1 flex flex-col">
              {/* Navbar */}
              <div className="sticky top-0 z-50 lg:ml-52">
                <Navber onhandleSidebarOpen={handleOpenSidebar} sidebarOpen={sidebarOpen} />
              </div>

              {/* Page Content */}
              <div className="flex-1 p-4 overflow-auto lg:ml-52">
                {children}
              </div>
            </main>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}

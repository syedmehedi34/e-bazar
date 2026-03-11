"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

type DashboardLayoutClientProps = {
  children: React.ReactNode;
};

const DashboardLayoutClient = ({ children }: DashboardLayoutClientProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (status === "loading") {
    return (
      <div
        className="flex justify-center items-center h-screen
                      bg-white dark:bg-[#0f1117]"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2
                          border-gray-200 dark:border-teal-500/30
                          border-t-teal-500 animate-spin"
          />
          <p className="text-xs text-gray-400 dark:text-slate-600 tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const userRole = session?.user?.role ?? "user";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0e14]">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userRole={userRole}
        isMobile={isMobile}
      />

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Topbar */}
      <Topbar
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        userRole={userRole}
        session={session}
      />

      {/* Page content */}
      <motion.main
        animate={{ marginLeft: isMobile ? 64 : isSidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="pt-16 min-h-screen"
      >
        <div className="p-4 sm:p-6">{children}</div>
      </motion.main>
    </div>
  );
};

export default DashboardLayoutClient;

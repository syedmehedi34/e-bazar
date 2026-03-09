"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

type DashboardLayoutClientProps = {
  children: React.ReactNode;
};

const DashboardLayoutClient = ({ children }: DashboardLayoutClientProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session?.user.role?.[0]);

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
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const userRole = (session?.user as { role?: string[] })?.role?.[0] ?? "user";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0716]">
      {/* ── Sidebar ── always fixed, z-50 */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userRole={userRole}
        isMobile={isMobile}
      />

      {/* ── Mobile dark overlay ── only covers content, not sidebar/topbar */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* ── Topbar ── fixed, always on top of overlay */}
      <Topbar
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        userRole={userRole}
        session={session}
      />

      {/* ── Page content ── pushed right by sidebar, down by topbar */}
      <main
        className={`transition-all duration-300 pt-[80px] ${
          isMobile ? "ml-16" : isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayoutClient;

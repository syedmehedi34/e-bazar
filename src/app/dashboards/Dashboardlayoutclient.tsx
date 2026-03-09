"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

// ─────────────────────────────────────────────────────────────
// NOTE: This is a Client Component wrapper.
// Your app/dashboard/layout.tsx should import this and use it
// as the layout shell (see bottom of this file for usage hint).
// ─────────────────────────────────────────────────────────────

type DashboardLayoutClientProps = {
  children: React.ReactNode;
};

const DashboardLayoutClient = ({ children }: DashboardLayoutClientProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount & resize
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

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // ── Loading State ──────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500" />
      </div>
    );
  }

  // Don't render layout for unauthenticated (redirect in progress)
  if (status === "unauthenticated") return null;

  // ── Get role from session ──────────────────────────────────
  // Adjust this based on how you store role in your NextAuth session/token
  // e.g. session.user.role — add it to your next-auth callbacks in [...nextauth]
  const userRole = (session?.user as { role?: string })?.role ?? "employee";

  return (
    <div className="min-h-screen relative">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userRole={userRole}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isMobile ? "ml-16" : isSidebarOpen ? "ml-64" : "ml-16"
        } mt-[80px]`}
      >
        {/* Topbar */}
        <Topbar
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          userRole={userRole}
          session={session}
        />

        {/* Page Content */}
        <div className="dark:bg-[#0B0716] min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[15]"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayoutClient;

// ─────────────────────────────────────────────────────────────
// HOW TO USE:
//
// In your  app/dashboard/layout.tsx  file, write:
//
//   import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";
//
//   export default function DashboardLayout({
//     children,
//   }: {
//     children: React.ReactNode;
//   }) {
//     return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
//   }
// ─────────────────────────────────────────────────────────────

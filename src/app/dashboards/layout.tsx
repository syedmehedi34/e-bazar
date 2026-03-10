// app/dashboard/layout.tsx
// This is a Server Component (no "use client" here).
// The client-side logic lives in DashboardLayoutClient.

import DashboardLayoutClient from "./Dashboardlayoutclient";

export const metadata = {
  title: "Dashboard | E-Catalog",
  description: "E-Catalog Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}

import "./globals.css";

import ToastProvider from "@/Components/ToastProvider";
import BackButton from "@/Components/Button/BackButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="pt-4 bg-gray-50 pl-10 sm:pl-32">
        <BackButton />
      </div>
      <main>{children}</main>
      <ToastProvider />
    </div>
  );
}

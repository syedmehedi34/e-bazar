import "./globals.css";

import ToastProvider from "@/Components/ToastProvider/ToastProvider";
import BackButton from '@/Components/Button/BackButton/BackButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <div className="mt-10 container-custom">
          <BackButton />
        </div>
        <main>{children}</main>
        <ToastProvider />
      </body>
    </html>
  );
}

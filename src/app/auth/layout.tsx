// src/app/auth/layout.tsx
import ToastProvider from "@/Components/ToastProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main>{children}</main>
      <ToastProvider />
    </div>
  );
}

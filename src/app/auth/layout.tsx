

import './globals.css'
import BackButton from '@/Components/Button/BackButton/BackButton'
import { Poppins, Rubik } from "next/font/google";
import "./globals.css"


import ToastProvider from "@/Components/ToastProvider/ToastProvider";



export const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});
export const rubik = Rubik({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
});
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${rubik.variable} relative dark:bg-gray-900`}>
        <div className='mt-10 container-custom'>
          <BackButton/>
        </div>
        <main>{children}</main>
        <ToastProvider/>
      </body>
    </html>
  )
}
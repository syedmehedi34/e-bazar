
import ToastProvider from '@/Components/ToastProvider/ToastProvider'
import './globals.css'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className=''>
      
        <main>{children}</main>
        <ToastProvider/>
      </body>
    </html>
  )
}
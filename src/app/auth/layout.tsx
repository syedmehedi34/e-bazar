
import ToastProvider from '@/Components/ToastProvider/ToastProvider'
import './globals.css'
import BackButton from '@/Components/Button/BackButton/BackButton'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className=''>
        <div className='mt-10 container-custom'>
          <BackButton/>
        </div>
        <main>{children}</main>
        <ToastProvider/>
      </body>
    </html>
  )
}

import Sidebar from '@/Components/Dashboard/Sidebar'
import '../(main)/globals.css'

import Navber from '@/Components/Dashboard/Navber'
import SessionWrapper from '@/Components/SessionWrapper/SessionWrapper'


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='text-white'
        style={{ background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)", }}
      >
        <SessionWrapper>

          <div className='flex gap-2'>
            <div>
              <Sidebar/>
            </div>
            <main className='w-full'>
              <Navber/>
              
              {children}
            </main>
          </div>
        </SessionWrapper>
      </body>
    </html>
  )
}
import { ReactNode } from "react"
import Navbar from "../Header/Navbar"
import Footer from "../Footer/Footer"


type layoutProps = {
    children: ReactNode
}
const Layout = ({children }:layoutProps) => {
  return (
    <div>
      <Navbar/>
      {children}
      <Footer/>
    </div>
  )
}

export default Layout
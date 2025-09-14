import Link from "next/link";
import React from "react";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <div className="text-white rubik" style={{ background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)", }}>
      {/* Top Footer */}
      <footer className="footer sm:footer-horizontal py-10  w-11/12 mx-auto">
        {/* Logo & Description */}
        <aside className="flex flex-col items-start space-y-2">
            <Logo/>
          <p className="text-sm">
            E-Bazaar Industries Ltd.
            <br />
            Providing reliable tech since 2000
          </p>
        </aside>

        {/* Services */}
        <nav>
          <h6 className="footer-title">Services</h6>
          <Link href="#" className="link link-hover">Branding</Link>
          <Link href="#" className="link link-hover">Design</Link>
          <Link href="#" className="link link-hover">Marketing</Link>
          
        </nav>

        {/* Company */}
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link href="#" className="link link-hover">About us</Link>
          <Link href="#" className="link link-hover">Contact</Link>
          <Link href="#" className="link link-hover">Jobs</Link>
          
        </nav>

        {/* Legal */}
        <nav>
          <h6 className="footer-title">Legal</h6>
          <Link href="#" className="link link-hover">Terms of use</Link>
          <Link href="#" className="link link-hover">Privacy policy</Link>
          <Link href="#" className="link link-hover">Cookie policy</Link>
        </nav>
      </footer>

      {/* Bottom Footer */}
      <div className="footer sm:footer-horizontal footer-center  border-t border-gray-600 p-4" > 
        <aside>
          <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
        </aside>
      </div>
    </div>
  );
};

export default Footer;

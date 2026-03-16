import Link from "next/link";
import React from "react";
import Logo from "../Logo";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Men's Fashion", href: "/shopping?category=mens" },
    { label: "Women's Fashion", href: "/shopping?category=women" },
    { label: "Electronics", href: "/shopping?category=electronics" },
    { label: "New Arrivals", href: "/shopping?sort=new" },
    { label: "Sale", href: "/shopping?sale=true" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blogs" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "FAQ", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "Return Policy", href: "#" },
    { label: "Track Order", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white rubik">
      {/* ── Main footer ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* ── Brand col (wider) ── */}
          <div className="lg:col-span-2 space-y-5">
            <Logo logoColor="" />

            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Your one-stop destination for fashion, electronics, and lifestyle
              products. Quality you can trust, prices you&apos;ll love.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              {[
                { icon: MapPin, text: "Dhaka, Bangladesh" },
                { icon: Phone, text: "+880-123-222-323" },
                { icon: Mail, text: "support@e-catalog.com" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-sm text-white/50"
                >
                  <Icon size={13} className="text-teal-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-teal-500
                             flex items-center justify-center
                             text-white/50 hover:text-white
                             border border-white/[0.06] hover:border-teal-500
                             transition-all duration-200"
                >
                  <Icon size={15} />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Link columns ── */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 rounded-full bg-teal-500" />
                <h6 className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  {heading}
                </h6>
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-sm text-white/45
                                 hover:text-white transition-colors duration-200"
                    >
                      <ArrowRight
                        size={11}
                        className="opacity-0 group-hover:opacity-100 -translate-x-1
                                   group-hover:translate-x-0 transition-all duration-200
                                   text-teal-500 flex-shrink-0"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.06]">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12
                        py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} E-Catalog Industries Ltd. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

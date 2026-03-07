import type { Metadata } from "next";
import { poppins, rubik } from "@/lib/fonts";
import "./globals.css";

import Navbar from "@/Components/Header/Navbar";
import Footer from "@/Components/Footer/Footer";
import Providers from "../../Provider/providers";

export const metadata: Metadata = {
  title: "E-Catalog",
  description:
    "E-Catalog is your one-stop destination for all your shopping needs. Explore our extensive collection of products, from fashion and electronics to home essentials and more. With a user-friendly interface and secure checkout, we make online shopping easy and enjoyable. Discover great deals, exclusive offers, and a seamless shopping experience at E-Catalog.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${rubik.variable} relative dark:bg-gray-900`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

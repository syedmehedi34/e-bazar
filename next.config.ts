import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com', 
       
      },
      {
        protocol: 'https',
        hostname: "www.slazzer.com",
       
      },
      {
        protocol: 'https',
        hostname: "i.postimg.cc",
       
      },
    ],
  }
};

export default nextConfig;

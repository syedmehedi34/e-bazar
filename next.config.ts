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
      {
        protocol: 'https',
        hostname: "static.vecteezy.com",
       
      },
      {
        protocol: 'https',
        hostname: "m.media-amazon.com",
       
      },
      {
        protocol: 'https',
        hostname: "img.drz.lazcdn.com",
       
      },
      {
        protocol: 'https',
        hostname: "www.shutterstock.com",
       
      },
      {
        protocol: 'https',
        hostname: "ibb.co.com",
       
      },
      {
        protocol: 'https',
        hostname: "randomuser.me",
       
      },
    ],
  }
};

export default nextConfig;

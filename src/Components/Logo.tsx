import Link from "next/dist/client/link";
import React from "react";

interface LogoProps {
  logoColor?: string;
}

const Logo: React.FC<LogoProps> = ({ logoColor }) => {
  return (
    <Link href="/">
      <div>
        <h2 className="font-bold rubik  ">
          <span className={`text-3xl ${logoColor ? `text-${logoColor}` : ""}`}>
            E
          </span>
          -Catalog
        </h2>
      </div>
    </Link>
  );
};

export default Logo;

import Link from "next/link";
import React from "react";

interface LogoProps {
  logoColor?: string;
}

const Logo: React.FC<LogoProps> = ({ logoColor }) => {
  const gradientClass =
    "bg-gradient-to-r from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600 bg-clip-text text-transparent";

  return (
    <Link href="/">
      <h2 className="font-bold rubik">
        <span
          className={`text-3xl ${!logoColor ? gradientClass : ""}`}
          style={logoColor ? { color: logoColor } : undefined}
        >
          E
        </span>
        <span
          className={!logoColor ? gradientClass : ""}
          style={logoColor ? { color: logoColor } : undefined}
        >
          -Catalog
        </span>
      </h2>
    </Link>
  );
};

export default Logo;

import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  text?: string;
  Icon?: React.ElementType;
  className?: string;
  action?: () => void;
  variant?: "dark" | "outline" | "teal";
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  text,
  Icon,
  className = "",
  action,
  variant = "dark",
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm rubik transition-all duration-300 cursor-pointer";

  const variants = {
    dark: "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-white shadow-sm",
    teal: "bg-teal-500 hover:bg-teal-600 text-white shadow-sm shadow-teal-500/30",
    outline:
      "border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={action}
    >
      {Icon && <Icon size={15} />}
      {text}
    </button>
  );
};

export default Button;

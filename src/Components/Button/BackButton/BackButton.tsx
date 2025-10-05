"use client"
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="btn  btn-sm flex items-center gap-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    >
      <IoIosArrowRoundBack size={24} />
      Back
    </button>
  );
};

export default BackButton;

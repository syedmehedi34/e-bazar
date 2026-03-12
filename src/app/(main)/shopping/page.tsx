import { Suspense } from "react";
import Loader from "@/Components/Loader";
import ShoppingClient from "@/Components/Shopping/ShoppingClient";

export const metadata = {
  title: "Shop | E-catalog",
  description: "Browse our full collection of products.",
};

export default function ShoppingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <ShoppingClient />
    </Suspense>
  );
}

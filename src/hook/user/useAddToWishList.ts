// src/hook/user/useAddToWishList.ts
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type WishlistAction = "add" | "remove";

const useWishList = () => {
  const { data: session } = useSession();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const updateWishList = async (productId: string, action: WishlistAction) => {
    if (!session?.user?.id) {
      toast.error("Please login to manage your wishlist.");
      return false;
    }

    setLoadingId(productId);
    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist: { action, productId } }),
      });

      if (!res.ok) throw new Error();

      if (action === "add") {
        toast.success("Added to wishlist!");
      } else {
        toast.success("Removed from wishlist.");
      }

      return true;
    } catch {
      toast.error("Failed to update wishlist. Please try again.");
      return false;
    } finally {
      setLoadingId(null);
    }
  };

  const addToWishList = (productId: string) => updateWishList(productId, "add");
  const removeFromWishList = (productId: string) =>
    updateWishList(productId, "remove");

  const toggleWishList = (productId: string, isWishlisted: boolean) =>
    updateWishList(productId, isWishlisted ? "remove" : "add");

  return {
    addToWishList,
    removeFromWishList,
    toggleWishList,
    loadingId, // productId currently being updated (for spinner/disable)
    isLoading: !!loadingId,
  };
};

export default useWishList;

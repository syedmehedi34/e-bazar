import { useMemo } from "react";

export const useDeliveryDate = (daysToAdd: number = 2) => {
  return useMemo(() => {
    const today = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + daysToAdd);
    return deliveryDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [daysToAdd]);
};

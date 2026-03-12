import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

// ── Query parameter types ─────────────────────────────────────────
export interface OrderQueryParams {
  // Scope — admin only; without these all orders are returned (or own orders for users)
  orderId?: string;
  userId?: string;
  productId?: string; // matches items.productId

  // Full-text search across orderId, userId, items.productId, items.title
  search?: string;

  // Enum filters
  orderStatus?: string; // processing | confirmed | shipped | delivered | cancelled
  paymentStatus?: string; // cod_pending | pending | paid | failed
  paymentMethod?: string; // cod | sslcommerz | stripe

  // Date filters — `date` takes priority over the range params
  date?: string; // exact single date  e.g. "2025-06-15"
  createdAtFrom?: string; // range start         e.g. "2025-01-01"
  createdAtTo?: string; // range end           e.g. "2025-12-31"
}

// ── Fetcher function ──────────────────────────────────────────────
const fetchOrders = async (params: OrderQueryParams) => {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  const url = `/api/orders${queryString ? `?${queryString}` : ""}`;
  const res = await axios.get(url);
  return res.data;
  // Response shape: { orders: IOrder[], total: number }
};

// ── Hook ──────────────────────────────────────────────────────────
// overrideParams — pass directly from component; takes priority over URL search params
export const useFetchOrders = (overrideParams?: Partial<OrderQueryParams>) => {
  const searchParams = useSearchParams();

  const params: OrderQueryParams = {
    orderId:
      overrideParams?.orderId ?? searchParams.get("orderId") ?? undefined,
    userId: overrideParams?.userId ?? searchParams.get("userId") ?? undefined,
    productId:
      overrideParams?.productId ?? searchParams.get("productId") ?? undefined,
    search: overrideParams?.search ?? searchParams.get("search") ?? undefined,
    orderStatus:
      overrideParams?.orderStatus ??
      searchParams.get("orderStatus") ??
      undefined,
    paymentStatus:
      overrideParams?.paymentStatus ??
      searchParams.get("paymentStatus") ??
      undefined,
    paymentMethod:
      overrideParams?.paymentMethod ??
      searchParams.get("paymentMethod") ??
      undefined,
    date: overrideParams?.date ?? searchParams.get("date") ?? undefined,
    createdAtFrom:
      overrideParams?.createdAtFrom ??
      searchParams.get("createdAtFrom") ??
      undefined,
    createdAtTo:
      overrideParams?.createdAtTo ??
      searchParams.get("createdAtTo") ??
      undefined,
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(params),
    placeholderData: keepPreviousData,
  });

  return {
    orders: data?.orders || [],
    total: data?.total ?? 0,
    ordersLoading: isLoading,
    ordersError: isError ? error : null,
    refetchOrders: refetch,
  };
};

/*
── Usage examples ────────────────────────────────────────────────────

// 1. All own orders (non-admin — backend enforces userId from session)
const { orders, ordersLoading } = useFetchOrders();

// 2. Specific order by orderId (admin)
const { orders } = useFetchOrders({ orderId: "EB-20250101-XXXXX" });

// 3. All orders for a specific user (admin)
const { orders } = useFetchOrders({ userId: "userId_here" });

// 4. All orders containing a specific product (admin)
const { orders } = useFetchOrders({ productId: "productId_here" });

// 5. Filter by status
const { orders } = useFetchOrders({ orderStatus: "delivered", paymentStatus: "paid" });

// 6. Exact single date
const { orders } = useFetchOrders({ date: "2025-06-15" });

// 7. Date range
const { orders } = useFetchOrders({ createdAtFrom: "2025-01-01", createdAtTo: "2025-06-30" });

// 8. Search + filter combined
const { orders } = useFetchOrders({ search: "oculus", orderStatus: "shipped" });
*/

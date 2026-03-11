export async function initiateSSLCommerz(order: {
  orderId: string;
  pricing: { total: number };
  items: { title: string }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    address: string;
    district: string;
  };
}) {
  const store_id = process.env.SSLCOMMERZ_STORE_ID!;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
  const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

  const apiUrl = is_live
    ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
    : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

  const params = new URLSearchParams({
    store_id,
    store_passwd,
    total_amount: String(order.pricing.total),
    currency: "BDT",
    tran_id: order.orderId,
    success_url: `${base_url}/api/payment/sslcommerz/success`,
    fail_url: `${base_url}/api/payment/sslcommerz/fail`,
    cancel_url: `${base_url}/api/payment/sslcommerz/cancel`,
    ipn_url: `${base_url}/api/payment/sslcommerz/ipn`,
    shipping_method: "Courier",
    product_name: order.items
      .map((i) => i.title)
      .join(", ")
      .slice(0, 255),
    product_category: "General",
    product_profile: "general",
    cus_name: order.deliveryAddress.fullName,
    cus_email: "customer@ebazaar.com",
    cus_add1: order.deliveryAddress.address,
    cus_city: order.deliveryAddress.district,
    cus_country: "Bangladesh",
    cus_phone: order.deliveryAddress.phone,
    ship_name: order.deliveryAddress.fullName,
    ship_add1: order.deliveryAddress.address,
    ship_city: order.deliveryAddress.district,
    ship_country: "Bangladesh",
    ship_postcode: "1000",
  });

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await response.json();
  console.log("SSLCommerz response:", data);

  if (data?.GatewayPageURL) {
    return data.GatewayPageURL;
  }

  throw new Error("SSLCommerz init failed: " + JSON.stringify(data));
}

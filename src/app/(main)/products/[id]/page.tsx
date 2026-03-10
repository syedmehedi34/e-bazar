import ProductDetailPage from "@/Components/ProductDetail";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ProductDetailPage params={params} />;
}

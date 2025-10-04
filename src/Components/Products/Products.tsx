import Button from "../Button/Button";
import ProductsCard from "./ProductsCard";
import Link from 'next/link'
interface Product {
  _id: string;
  id: string;
  title: string;
  images: string[];
  price: number;
  discountPrice?: number;
  rating?: number;
  stock?: number;

}
const Products = async () => {
  const res = await fetch("http://localhost:5000/get-random-products")
  const products: Product[] = await res.json();
  if (products.length === 0) {
    return <div className="py-16">
      <p>Products Not Found </p>
    </div>
  }
  return (
    <div className="py-16">
      <div className="container-custom">
        <div className=" mb-10">
          <h2 className="rubik text-4xl font-bold">Just For You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {
            products?.map((product) => (
              <ProductsCard key={product._id} product={product} />
            ))}
        </div>
        <div className="flex justify-center my-4">
          <Link href={'/shopping'}>
          <Button text={"See More"} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Products
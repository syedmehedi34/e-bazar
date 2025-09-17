import Button from "../Button/Button";
import ProductsCard from "./ProductsCard";
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
  return (
    <div className="py-16">
      <div className="w-11/12 mx-auto">
        <div className=" mb-4">
          <h2 className="rubik text-4xl font-bold">Just For You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {
            products?.map((product) => (
              <ProductsCard key={product._id} product={product} />
            ))}
        </div>
        <div className="flex justify-center my-4">
          <Button text={"See More"} />
        </div>
      </div>
    </div>
  )
}

export default Products
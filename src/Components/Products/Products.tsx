import ProductsCard from "./ProductsCard";

const Products = async () => {
    const res = await fetch("http://localhost:5000/get-random-products")
    const products = await res.json();
  return (
    <div>
       <div className="w-11/12 mx-auto">
            <div className="mt-20 mb-4">
                <h2 className="rubik text-4xl font-bold">Just For You</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {
                    products?.map((product: any)=>(
                        <ProductsCard key={product._id} product={product}/>
                    ))}
            </div>
       </div>
    </div>
  )
}

export default Products
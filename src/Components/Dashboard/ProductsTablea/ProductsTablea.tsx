import React, { useState } from "react";
import ProductsUpdate from "./ProductsUpdate";
import { FolderSync, Trash } from "lucide-react";
import Image from "next/image";

interface Products {
  _id: string;
  title: string;
  category: string;
  stock: number;
  images: string[];
  price: number;
  createdAt: string;
}

// শুধু update এর জন্য দরকারি product interface
interface Product {
  _id: string;
  title: string;
  category: string;
  stock: number;
  price: number;
}

type ProductsTableProps = {
  products: Products[];
  onUpdate?: () => void
  onDelete?: (id: string) => void;
};

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onUpdate,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateProducts, setUpdateProducts] = useState<Product | null>(null);

  const handleUpdate = (product: Products) => {
    const singleProduct: Product = {
      _id: product._id,
      title: product.title,
      category: product.category,
      stock: product.stock,
      price: product.price,
    };
    setUpdateProducts(singleProduct);
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="dark:text-white">#</th>
              <th className="dark:text-white">Image</th>
              <th className="dark:text-white">Title</th>
              <th className="dark:text-white">Category</th>
              <th className="dark:text-white">Stock</th>
              <th className="dark:text-white">Price</th>
              <th className="dark:text-white">Created At</th>
              <th className="dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr key={product._id} className="dark:hover:bg-gray-700">
                <th>{index + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <Image
                        width={100}
                        height={100}
                        src={product.images[0]}
                        alt={product.title}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>${product.price}</td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button
                    title="Update"
                    onClick={() => handleUpdate(product)}
                    className="p-2 bg-gray-100 dark:bg-gray-600 cursor-pointer rounded-full hover:text-accent transition-all duration-300 "
                  >
                    <FolderSync />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => onDelete?.(product._id)}
                    className="p-2 bg-gray-100 dark:bg-gray-600 cursor-pointer rounded-full hover:text-secondary transition-all duration-300">
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && updateProducts && (
        <div className="fixed inset-0 z-100 bg-black/50 flex justify-center items-center">
          <ProductsUpdate setIsOpen={setIsOpen} updateProducts={updateProducts} onUpdate={onUpdate || (() => { })} />
        </div>
      )}
    </div>
  );
};

export default ProductsTable;

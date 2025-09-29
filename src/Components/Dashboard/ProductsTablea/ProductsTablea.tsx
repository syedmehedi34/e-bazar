import React, { useState } from "react";

interface Products {
  _id: string;
  title: string;
  category: string;
  stock: number;
  images: string[];
  price: number;
  createdAt: string;
}

type ProductsTableProps = {
  products: Products[];
  onUpdate?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onUpdate,
  onDelete,
}) => {

    const [isOpen , setIsOpen] = useState(false)

  return (
    <div>
    <div className="overflow-x-auto">
      <table className="table  w-full">
        {/* head */}
        <thead>
          <tr>
            <th className="dark:text-white" >#</th>
            <th className="dark:text-white" >Image</th>
            <th className="dark:text-white" >Title</th>
            <th className="dark:text-white" >Category</th>
            <th className="dark:text-white" >Stock</th>
            <th className="dark:text-white" >Price</th>
            <th className="dark:text-white" >Created At</th>
            <th className="dark:text-white" >Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => (
            <tr key={product._id} className="dark:hover:bg-gray-700">
              <th>{index + 1}</th>
              <td>
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img
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
                  onClick={() => onUpdate?.(product._id)}
                  className="btn btn-sm bg-gray-800 text-white rounded-box"
                >
                  Update
                </button>
                <button
                  onClick={() => onDelete?.(product._id)}
                  className="btn btn-sm bg-red-800 text-white rounded-box"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
         
    </div>
  );
};

export default ProductsTable;

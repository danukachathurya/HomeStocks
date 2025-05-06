import React, { useEffect, useState } from "react";

export default function ExpiredProduct() {
  const [expiredProducts, setExpiredProducts] = useState([]);

  useEffect(() => {
    fetchExpiredProducts();
  }, []);

  const fetchExpiredProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/product/all");
      const data = await res.json();

      const today = new Date();

      const expired = data.products.filter((product) => {
        return new Date(product.expiryDate) < today;
      });

      setExpiredProducts(expired);
    } catch (error) {
      console.error("Error fetching expired products:", error);
    }
  };

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        ❌ Expired Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {expiredProducts.length > 0 ? (
          expiredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden border border-red-300"
            >
              <img
                src={product.itemImage || "/no-image.png"}
                alt={product.itemName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {product.itemName}
                </h2>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Supplier:</span>{" "}
                  {product.supplierName}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Price:</span> ${product.price}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Quantity:</span>{" "}
                  {product.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Item Codes:</span>{" "}
                  {product.itemCode?.length > 0
                    ? product.itemCode.join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-lg text-gray-600">
            No expired products found.
          </div>
        )}
      </div>
    </div>
  );
}

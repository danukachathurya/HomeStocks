import { useState, useEffect } from "react";
import { Card } from "flowbite-react";

export default function ExpireSoon() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/product/all`);
      const data = await res.json();

      const today = new Date();
      const twoMonthsLater = new Date(today.setMonth(today.getMonth() + 2));

      const filteredProducts = data.products.filter((product) => {
        const expiryDate = new Date(product.expiryDate);
        return expiryDate >= new Date() && expiryDate <= twoMonthsLater;
      });

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        🕒 Products Expiring Soon
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-200"
            >
              <img
                src={product.itemImage || "/no-image.png"}
                alt={product.itemName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">{product.itemName}</h2>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Supplier:</span> {product.supplierName}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Price:</span> ${product.price}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Quantity:</span> {product.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Item Codes:</span>{" "}
                  {product.itemCode?.length > 0
                    ? product.itemCode.join(", ")
                    : "N/A"}
                </p>
                <p className="text-sm text-red-600 font-medium">
                  Exp: {new Date(product.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-lg text-gray-600">
            No products expiring within the next two months.
          </div>
        )}
      </div>
    </div>
  );
}

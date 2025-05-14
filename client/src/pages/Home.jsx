import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/product/all');
        setProducts(res.data.products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existing = cart.find((item) => item._id === product._id);

    const availableQty = product.quantity || product.stock || 0;

    if (!existing) {
      if (availableQty > 0) {
        cart.push({
          _id: product._id,
          itemName: product.itemName,
          price: product.price,
          quantity: 1,
          availableQuantity: availableQty,
        });
        alert(`${product.itemName} added to cart!`);
      } else {
        alert(`${product.itemName} is out of stock.`);
        return;
      }
    } else {
      if (existing.quantity < existing.availableQuantity) {
        existing.quantity += 1;
        alert(`${product.itemName} quantity updated in cart.`);
      } else {
        alert(`Only ${existing.availableQuantity} ${product.itemName} available in stock.`);
        return;
      }
    }

    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  if (loading) return <div className="text-center mt-10">Loading products...</div>;

  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Search by product name or category..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-xl">No products found</div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="border rounded-lg shadow-md p-4">
              <img
                src={product.itemImage}
                alt={product.itemName}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{product.itemName}</h2>
              <p className="text-gray-600 mb-1">Category: {product.category}</p>
              <p className="text-gray-800 font-bold mb-1">Price: ${product.price}</p>
              <p className="text-gray-600 mb-3">
                Available: {product.quantity || product.stock || 0}
              </p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleAddToCart(product)}
              >
                Add to cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

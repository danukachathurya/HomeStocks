import React, { useEffect, useState } from 'react';

const MyItems = ({ onProceedToCheckout }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(cart);
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const handleRemove = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    updateCart(updatedCart);
  };

  const handleIncrease = (productId) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === productId) {
        const maxQty = item.availableQuantity ?? 10;
        if (item.quantity < maxQty) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert(`Only ${maxQty} items are available.`);
        }
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const handleDecrease = (productId) => {
    let updatedCart = cartItems.map(item => {
      if (item._id === productId) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    updatedCart = updatedCart.filter(item => item.quantity > 0);
    updateCart(updatedCart);
  };

  if (cartItems.length === 0) {
    return <div className="text-center mt-10 text-xl">Your cart is empty</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Shopping Cart</h1>
      <div className="grid gap-6 mb-6">
        {cartItems.map(item => (
          <div
            key={item._id}
            className="border rounded-lg shadow p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{item.itemName}</h2>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => handleDecrease(item._id)}
                  className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                >
                  -
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item._id)}
                  disabled={item.quantity >= (item.availableQuantity ?? 10)}
                  className={`bg-gray-300 px-2 py-1 rounded hover:bg-gray-400 ${
                    item.quantity >= (item.availableQuantity ?? 10)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  +
                </button>
              </div>
              <p className="text-green-600 font-bold">
                Price: ${item.price * item.quantity}
              </p>
              <p className="text-sm text-gray-500">
                Available: {item.availableQuantity ?? 'N/A'}
              </p>
            </div>
            <button
              onClick={() => handleRemove(item._id)}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onProceedToCheckout}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default MyItems;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { FileText } from 'lucide-react'; // PDF icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = ({ onOrderPlaced }) => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Order Invoice", 20, 20);
    doc.setFontSize(12);

    let y = 30;
    doc.text(`Name: ${formData.name}`, 20, y);
    doc.text(`Address: ${formData.address}`, 20, y += 10);
    doc.text(`City: ${formData.city}`, 20, y += 10);
    y += 10;
    doc.text("Items:", 20, y);

    cartItems.forEach(item => {
      y += 10;
      doc.text(
        `${item.itemName} x ${item.quantity} = $${(item.quantity * item.price).toFixed(2)}`,
        25,
        y
      );
    });

    y += 10;
    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    doc.text(`Total: $${total.toFixed(2)}`, 20, y + 10);

    doc.save("invoice.pdf");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { ...formData, cartItems };

    try {
      const res = await fetch("/api/checkout/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(finalData),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || "Server error.");
        return;
      }

      localStorage.removeItem("cartItems");
      setSubmitError(null);

      // ✅ Show success toast
      toast.success("Order placed successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Notify the parent to change the tab to 'overview'
      if (onOrderPlaced) {
        onOrderPlaced();
      }

      setTimeout(() => {
        navigate('/user-dashboard');  // Redirect after order
      }, 2500); // Wait for toast to finish
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>

      {/* Cart Items */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-xl">Order Summary</h3>

          {/* PDF Download Button aligned to the right */}
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-sky-400 text-white px-4 py-2 rounded hover:bg-sky-500"
          >
            <FileText size={18} />
            Download Invoice
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in your cart.</p>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between mb-3">
                <div className="w-1/2 text-lg">{item.itemName} x {item.quantity}</div>
                <div className="w-1/2 text-right text-lg font-semibold">
                  ${((item.quantity * item.price).toFixed(2))}
                </div>
              </div>
            ))}
            <div className="font-bold text-lg mt-4">
              Total: $
              {cartItems
                .reduce((acc, item) => acc + item.quantity * item.price, 0)
                .toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Billing Information Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-1/2"
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-1/2"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white text-lg py-3 rounded-lg hover:bg-green-700 mt-6"
        >
          Place Order
        </button>
      </form>

      {submitError && <p className="text-red-500 text-center mt-4">{submitError}</p>}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Checkout;

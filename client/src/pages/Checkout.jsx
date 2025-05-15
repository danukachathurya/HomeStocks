import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { FileText } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = ({ onOrderPlaced }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    const { name, address, city, cardNumber, expiryDate, cvv } = formData;

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!city.trim()) newErrors.city = "City is required.";

    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }

    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = "CVV must be 3 digits.";
    }

    if (!expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

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
        toast.error(data.message || "Server error.", {
          position: "top-center",
        });
        return;
      }

      localStorage.removeItem("cartItems");

      toast.success("Order placed successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      if (onOrderPlaced) onOrderPlaced();

      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2500);
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
      });
    }
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

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>

      {/* Cart Items */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-xl">Order Summary</h3>
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

      {/* Billing Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleChange}
              inputMode="numeric"
              className="border p-3 rounded-lg w-full"
            />
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
          </div>

          <div className="w-1/2">
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
              inputMode="numeric"
              className="border p-3 rounded-lg w-full"
            />
            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white text-lg py-3 rounded-lg hover:bg-green-700 mt-6"
        >
          Place Order
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Checkout;


import React, { useState } from 'react';

const AddCardPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cardData = {
      cardNumber,
      cardHolderName,
      expirationDate,
      cvv,
    };

    try {
      const response = await fetch('/api/payment/add-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (response.ok) {
        alert('Card added successfully');
      } else {
        alert('Failed to add card');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Add Your Credit Card</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block mb-1 font-medium">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            className="w-full p-2 border rounded"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cardHolderName" className="block mb-1 font-medium">Cardholder Name</label>
          <input
            type="text"
            id="cardHolderName"
            className="w-full p-2 border rounded"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="expirationDate" className="block mb-1 font-medium">Expiration Date</label>
          <input
            type="month"
            id="expirationDate"
            className="w-full p-2 border rounded"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cvv" className="block mb-1 font-medium">CVV</label>
          <input
            type="password"
            id="cvv"
            className="w-full p-2 border rounded"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? 'Adding Card...' : 'Add Card'}
        </button>
      </form>
    </div>
  );
};

export default AddCardPage;

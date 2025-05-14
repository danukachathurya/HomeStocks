import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    cardNumber: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },

    // ✅ Add purchased item details
    cartItems: [
      {
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      }
    ],

    // ✅ Add total price
    totalPrice: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const Checkout = mongoose.model("Checkout", checkoutSchema);
export default Checkout;

import Checkout from "../models/checkout.model.js";
import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

// Add new checkout
export const addCheckout = async (req, res, next) => {
  try {
    const { cartItems, ...rest } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return next(errorHandler(400, "Cart items are required"));
    }

    // Check stock and update quantities
    for (const item of cartItems) {
      const product = await Product.findOne({ itemName: item.itemName });

      if (!product) {
        return next(errorHandler(404, `Product ${item.itemName} not found`));
      }

      if (product.quantity < item.quantity) {
        return next(
          errorHandler(400, `Not enough stock for ${item.itemName}. Available: ${product.quantity}`)
        );
      }
    }

    // All stock is available, now deduct
    for (const item of cartItems) {
      const product = await Product.findOne({ itemName: item.itemName });
      product.quantity -= item.quantity;
      await product.save();
    }

    // Calculate total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Save the checkout
    const newCheckout = new Checkout({
      ...rest,
      cartItems,
      totalPrice,
    });

    const savedCheckout = await newCheckout.save();

    res.status(201).json(savedCheckout);
  } catch (error) {
    next(error);
  }
};

// Get all checkouts
export const getCheckouts = async (req, res, next) => {
  try {
    const checkouts = await Checkout.find().sort({ createdAt: -1 });
    res.status(200).json({ checkouts });
  } catch (error) {
    next(error);
  }
};

// Get single checkout by ID
export const getCheckout = async (req, res, next) => {
  try {
    const checkout = await Checkout.findById(req.params.checkoutId);
    if (!checkout) {
      return next(errorHandler(404, "Checkout not found!"));
    }
    res.status(200).json(checkout);
  } catch (error) {
    next(error);
  }
};

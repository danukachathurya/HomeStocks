import Checkout from "../models/checkout.model.js";
import { errorHandler } from "../utils/error.js";

// Add new checkout
export const addCheckout = async (req, res, next) => {
  try {
    const newCheckout = new Checkout(req.body);
    const savedCheckout = await newCheckout.save();
    res.status(201).json(savedCheckout);
  } catch (error) {
    next(error);
  }
};

// Get all checkouts (you can add pagination or search here)
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

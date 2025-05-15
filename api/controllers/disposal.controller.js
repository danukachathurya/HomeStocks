import Disposal from "../models/disposal.model.js"; 
import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

export const addDisposalItem = async (req, res, next) => {
  try {
    // First find the product that contains these item codes
    const product = await Product.findOne({
      itemCode: { $in: Array.isArray(req.body.itemCode) ? req.body.itemCode : [req.body.itemCode] }
    });

    if (!product) {
      return next(errorHandler(404, "Original product not found!"));
    }

    // Create the disposal item
    const newDisposalItem = new Disposal(req.body);
    const savedDisposalItem = await newDisposalItem.save();

    // Remove the disposed item codes from the original product
    const codesToRemove = Array.isArray(req.body.itemCode) ? req.body.itemCode : [req.body.itemCode];
    const remainingCodes = product.itemCode.filter(code => !codesToRemove.includes(code));

    // Update the product with remaining codes
    await Product.findByIdAndUpdate(
      product._id,
      { $set: { itemCode: remainingCodes } },
      { new: true }
    );

    res.status(201).json(savedDisposalItem);
  } catch (error) {
    next(error);
  }
};

export const getDisposalItems = async (req, res, next) => {
  try {
    const disposalItems = await Disposal.find().sort({ createdAt: -1 });
    res.status(200).json({ disposalItems });
  } catch (error) {
    next(error);
  }
};

export const getDisposalItem = async (req, res, next) => {
  try {
    const disposalItem = await Disposal.findById(req.params.id);
    if (!disposalItem) {
      return next(errorHandler(404, "Disposal item not found!"));
    }
    res.status(200).json(disposalItem);
  } catch (error) {
    next(error);
  }
};

export const updateDisposalItem = async (req, res, next) => {
  try {
    const updatedDisposalItem = await Disposal.findByIdAndUpdate(
      req.params.disposalId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedDisposalItem) {
      return next(errorHandler(404, "Disposal item not found"));
    }
    res.status(200).json(updatedDisposalItem);
  } catch (error) {
    next(error);
  }
};

export const deleteDisposalItem = async (req, res, next) => {
  try {
    await Disposal.findByIdAndDelete(req.params.disposalId);
    res.status(200).json("Disposal item deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get total disposal count
export const getDisposalCount = async (req, res, next) => {
  try {
    const count = await Disposal.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    next(errorHandler(500, "Failed to get disposal count"));
  }
};

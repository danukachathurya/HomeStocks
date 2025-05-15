import Supply from "../models/supply.model.js";
import { errorHandler } from "../utils/error.js";

// Add supply
export const addSupply = async (req, res, next) => {
  try {
    const newSupply = new Supply(req.body);
    const savedSupply = await newSupply.save();
    res.status(201).json(savedSupply);
  } catch (error) {
    next(error);
  }
};

// Get all supplies with pagination & search
export const getSupplies = async (req, res, next) => {
  try {
    const supplys = await Supply.find().sort({ createdAt: -1 });
    res.status(200).json({ supplys });
  } catch (error) {
    next(error);
  }
};

// Get single supply by ID
export const getSupply = async (req, res, next) => {
  try {
    const supply = await Supply.findById(req.params.supplyId);
    if (!supply) {
      return next(errorHandler(404, "Supply not found!"));
    }
    res.status(200).json(supply);
  } catch (error) {
    next(error);
  }
};

// Update supply
export const updateSupply = async (req, res, next) => {
  try {
    const updatedSupply = await Supply.findByIdAndUpdate(
      req.params.supplyId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedSupply) {
      return next(errorHandler(404, "Supply not found!"));
    }
    res.status(200).json(updatedSupply);
  } catch (error) {
    next(error);
  }
};

// Delete supply
export const deleteSupply = async (req, res, next) => {
  try {
    await Supply.findByIdAndDelete(req.params.supplyId);
    res.status(200).json("Supply deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get total unique supplier count
export const getUniqueSupplierCount = async (req, res, next) => {
  try {
    const result = await Supply.aggregate([
      { 
        $group: { 
          _id: "$supplierName" 
        } 
      },
      { 
        $count: "uniqueSupplierCount" 
      }
    ]);

    // If no suppliers, result could be empty array
    const count = result.length > 0 ? result[0].uniqueSupplierCount : 0;

    res.status(200).json({ count });
  } catch (error) {
    next(errorHandler(500, "Failed to get unique supplier count"));
  }
};


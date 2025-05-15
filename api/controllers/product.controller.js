import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

// Add product
export const addProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

// Get all products with pagination & search
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};


// Get single product by ID
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(errorHandler(404, 'Product not found!'));
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedProduct) {
      return next(errorHandler(404, "Product not found"));
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json("Product deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const searchProductsByName = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(200).json([]);
    }

    const products = await Product.find({
      $or: [
        { itemName: { $regex: query.trim(), $options: 'i' } },
        { itemCode: { $elemMatch: { $regex: query.trim(), $options: 'i' } } }
      ]
    })
    .limit(10)
    .select('itemName itemCode category')
    .lean();

    const results = products.map(product => ({
      _id: product._id,
      itemName: product.itemName,
      itemCodes: product.itemCode || [], 
      category: product.category || ''
    }));

    res.status(200).json(results);
  } catch (error) {
    next(errorHandler(500, "Search failed"));
  }
};

// Get total product count
export const getProductCount = async (req, res, next) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    next(errorHandler(500, "Failed to get product count"));
  }
};

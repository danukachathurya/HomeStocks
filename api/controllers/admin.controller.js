import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Supply from "../models/supply.model.js";
import Inventory from "../models/inventory.model.js";
import Product from "../models/product.model.js";

const allowedRoles = ['inventorymanager', 'supplier', 'user'];

// Admin Login Controller
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, 'Email and password are required.'));
    }

    const user = await User.findOne({ email });

    if (!user || !user.isAdmin) {
      return next(errorHandler(401, 'Invalid admin credentials.'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, 'Invalid admin credentials.'));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: pass, ...rest } = user._doc;

    res
      .cookie('admin_token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Assign Role to a User
export const assignRole = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const roleToAssign = req.body.role?.trim().toLowerCase();

    if (!email || !roleToAssign) {
      return next(errorHandler(400, 'Email and role are required.'));
    }

    if (!allowedRoles.includes(roleToAssign)) {
      return next(errorHandler(400, 'Invalid role assignment.'));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, 'User not found with the given email.'));
    }

    user.role = roleToAssign;
    await user.save();

    const { password, ...rest } = user._doc;
    res.status(200).json({ message: 'Role assigned successfully.', user: rest });
  } catch (error) {
    next(error);
  }
};

// Get All Users (Admin only)
export const getUsers = async (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to see all users.'));
    }

    const users = await User.find({}, 'username email role createdAt');
    res.status(200).json({ users }); // ✅ Correct format
  } catch (error) {
    next(error);
  }
};

// Delete User (Admin only, can't delete admin users)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    if (user.isAdmin || user.role === 'admin') {
      return next(errorHandler(403, 'Cannot delete another admin user.'));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getAllSupplies = async (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      return next(errorHandler(403, "Only admins can view supplier orders."));
    }

    const supplies = await Supply.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({ supplies });
  } catch (error) {
    next(error);
  }
};

// Admin adds supply item to system
export const addToInventory = async (req, res, next) => {
  try {
    const { supplyId } = req.params;
    const { quantity } = req.body;

    const supplyItem = await Supply.findById(supplyId);
    if (!supplyItem) return next(errorHandler(404, "Supply item not found."));

    const finalQty = Number(quantity);
    if (!finalQty || finalQty < 1 || finalQty > supplyItem.quantity) {
      return next(errorHandler(400, "Invalid quantity provided."));
    }

    // Destructure needed fields for comparison
    const { itemName, supplierName, category } = supplyItem;

    // Check for existing item with exact match on name, supplier, and category
    const existingInventory = await Inventory.findOne({
      itemName,
      supplierName,
      category,
    });

    if (existingInventory) {
      // Update quantity only
      existingInventory.quantity += finalQty;
      await existingInventory.save();
    } else {
      // Remove _id and save as new inventory item
      const supplyData = supplyItem.toObject();
      delete supplyData._id;
      delete supplyData.__v;

      const newItem = new Inventory({
        ...supplyData,
        quantity: finalQty,
      });

      await newItem.save();
    }

    // Update or delete supply item
    if (finalQty === supplyItem.quantity) {
      await Supply.findByIdAndDelete(supplyId);
    } else {
      supplyItem.quantity -= finalQty;
      await supplyItem.save();
    }

    res.status(201).json({ message: "Item added to inventory successfully." });
  } catch (err) {
    next(err);
  }
};


// Get total user count (Admin only)
export const getUserCount = async (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      return next(errorHandler(403, 'Only admins can view user count.'));
    }

    const count = await User.countDocuments();
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    next(error);
  }
};

//get all inventories item count
export const getInventoryCount = async (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Only admins can view inventory count.' });
    }

    const count = await Inventory.countDocuments();
    res.status(200).json({ totalInventories: count });
  } catch (error) {
    next(error);
  }
};

// Get total product count (Admin only)
export const getProductCount = async (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      return next(errorHandler(403, 'Only admins can view product count.'));
    }

    const count = await Product.countDocuments();
    res.status(200).json({ totalProducts: count });
  } catch (error) {
    next(error);
  }
};









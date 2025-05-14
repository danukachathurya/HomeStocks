import Inventory from '../models/inventory.model.js';

// Get all upcoming orders
export const getAllUpcomingOrders = async (req, res, next) => {
  try {
    const upcomingOrders = await Inventory.find().sort({ createdAt: -1 }); 

    res.status(200).json(upcomingOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming orders.' });
  }
};

export const markOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Inventory.findByIdAndUpdate(
      orderId,
      { marked: true },
      { new: true }
    );

    if (!updatedOrder) {
      return next(errorHandler(404, "Order not found"));
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(errorHandler(500, "Failed to mark order"));
  }
};

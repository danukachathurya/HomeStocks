import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    category: String,
    supplierName: String,
    itemName: String,
    price: Number,
    itemImage: String,
    quantity: Number,
    purchaseDate: Date,
    expiryDate: Date,
    itemCode: [String],
    marked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;

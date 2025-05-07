import mongoose from "mongoose";

const disposalSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    itemCode: {
      type: [String], 
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Disposal = mongoose.model("Disposal", disposalSchema);

export default Disposal;

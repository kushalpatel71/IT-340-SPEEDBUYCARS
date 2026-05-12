const mongoose = require("mongoose");

const sellCarRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleYear: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    mileage: { type: String, required: true },
    condition: { type: String, required: true },
    askingPrice: { type: String, required: true },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellCarRequest", sellCarRequestSchema);
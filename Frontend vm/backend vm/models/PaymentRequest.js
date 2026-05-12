const mongoose = require("mongoose");

const paymentRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    vehicle: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    cardLast4: { type: String, default: "" },
    cardFingerprintHash: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentRequest", paymentRequestSchema);
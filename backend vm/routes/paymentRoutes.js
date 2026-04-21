const express = require("express");
const PaymentRequest = require("../models/PaymentRequest");
const { sendEmail } = require("../utils/mailer");
const {
  maskCard,
  getCardLast4,
  getCardFingerprint
} = require("../utils/crypto");
const {
  paymentUserEmail,
  paymentAdminEmail
} = require("../utils/emailTemplates");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      vehicle,
      paymentMethod,
      cardName,
      cardNumber,
      expiry,
      cvv,
      notes
    } = req.body;

    if (!fullName || !email || !phone || !address || !vehicle || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const isCardMethod = ["Credit Card", "Debit Card", "MasterCard"].includes(paymentMethod);
    let maskedCard = "";
    let cardLast4 = "";
    let cardFingerprintHash = "";

    if (isCardMethod) {
      if (!cardNumber) {
        return res.status(400).json({ success: false, message: "Card number is required." });
      }

      maskedCard = maskCard(cardNumber);
      cardLast4 = getCardLast4(cardNumber);
      cardFingerprintHash = getCardFingerprint(cardNumber);
    }

    // CVV is intentionally never stored
    // Full card number is intentionally never stored
    // cardName / expiry are also not stored here for safety

    const payload = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      vehicle: vehicle.trim(),
      paymentMethod: paymentMethod.trim(),
      cardLast4,
      cardFingerprintHash,
      notes: notes ? notes.trim() : ""
    };

    await PaymentRequest.create(payload);

    const emailData = {
      ...payload,
      maskedCard: maskedCard || "Not applicable"
    };

    await sendEmail({
      to: payload.email,
      subject: "Payment Confirmation - SpeedBuyCars",
      html: paymentUserEmail(emailData),
      text: `Hello ${payload.fullName}, your payment request for ${payload.vehicle} has been received.`
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Payment Request - SpeedBuyCars",
      html: paymentAdminEmail(emailData),
      text: `New payment request from ${payload.fullName} for ${payload.vehicle}.`
    });

    return res.json({
      success: true,
      message: "Payment request submitted. Emails sent."
    });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
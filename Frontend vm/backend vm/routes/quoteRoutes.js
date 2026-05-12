const express = require("express");
const QuoteRequest = require("../models/QuoteRequest");
const { sendEmail } = require("../utils/mailer");
const { quoteUserEmail, quoteAdminEmail } = require("../utils/emailTemplates");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, vehicle, message } = req.body;

    if (!fullName || !email || !phone || !vehicle) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      vehicle: vehicle.trim(),
      message: message ? message.trim() : ""
    };

    await QuoteRequest.create(payload);

    await sendEmail({
      to: payload.email,
      subject: "Quote Confirmation - SpeedBuyCars",
      html: quoteUserEmail(payload),
      text: `Hello ${payload.fullName}, your quote request for ${payload.vehicle} was received.`
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Quote Request - SpeedBuyCars",
      html: quoteAdminEmail(payload),
      text: `New quote request from ${payload.fullName} for ${payload.vehicle}.`
    });

    return res.json({
      success: true,
      message: "Quote request submitted. Emails sent."
    });
  } catch (error) {
    console.error("Quote error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
const express = require("express");
const SellCarRequest = require("../models/SellCarRequest");
const { sendEmail } = require("../utils/mailer");
const {
  sellCarUserEmail,
  sellCarAdminEmail
} = require("../utils/emailTemplates");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      vehicleYear,
      vehicleMake,
      vehicleModel,
      mileage,
      condition,
      askingPrice,
      notes
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !vehicleYear ||
      !vehicleMake ||
      !vehicleModel ||
      !mileage ||
      !condition ||
      !askingPrice
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      vehicleYear: vehicleYear.trim(),
      vehicleMake: vehicleMake.trim(),
      vehicleModel: vehicleModel.trim(),
      mileage: mileage.trim(),
      condition: condition.trim(),
      askingPrice: askingPrice.trim(),
      notes: notes ? notes.trim() : ""
    };

    await SellCarRequest.create(payload);

    await sendEmail({
      to: payload.email,
      subject: "Sell Car Success - SpeedBuyCars",
      html: sellCarUserEmail(payload),
      text: `Hello ${payload.fullName}, your sell-car request was submitted successfully.`
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Sell Car Request - SpeedBuyCars",
      html: sellCarAdminEmail(payload),
      text: `New sell-car request from ${payload.fullName}.`
    });

    return res.json({
      success: true,
      message: "Sell car request submitted. Emails sent."
    });
  } catch (error) {
    console.error("Sell car error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
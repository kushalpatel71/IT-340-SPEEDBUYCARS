function wrapTemplate(title, bodyHtml) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#0b0b0b; color:#ffffff; padding:30px;">
      <div style="max-width:700px; margin:auto; background:#151515; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden;">
        <div style="padding:20px; border-bottom:2px solid #c40000;">
          <h1 style="margin:0; font-size:28px;">
            <span style="color:#fff;">Speed</span><span style="color:#e11d1d;">BuyCars</span>
          </h1>
        </div>
        <div style="padding:25px;">
          <h2 style="color:#fff; margin-top:0;">${title}</h2>
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
}

function registerUserEmail(user) {
  return wrapTemplate(
    "Registration Successful",
    `
      <p>Hello <strong>${user.fullName}</strong>,</p>
      <p>Your SpeedBuyCars account has been created successfully.</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p>You can now log in to your account.</p>
      <p>Thank you,<br>SpeedBuyCars</p>
    `
  );
}

function quoteUserEmail(data) {
  return wrapTemplate(
    "Quote Request Confirmation",
    `
      <p>Hello <strong>${data.fullName}</strong>,</p>
      <p>We received your quote request successfully.</p>
      <p><strong>Vehicle:</strong> ${data.vehicle}</p>
      <p><strong>Full Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong> ${data.message || "N/A"}</p>
      <p>Our team will contact you soon.</p>
    `
  );
}

function quoteAdminEmail(data) {
  return wrapTemplate(
    "New Quote Request",
    `
      <p>A new quote request was submitted.</p>
      <p><strong>Vehicle:</strong> ${data.vehicle}</p>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong> ${data.message || "N/A"}</p>
    `
  );
}

function paymentUserEmail(data) {
  return wrapTemplate(
    "Payment Request Confirmation",
    `
      <p>Hello <strong>${data.fullName}</strong>,</p>
      <p>Your payment request has been received successfully.</p>
      <p><strong>Vehicle:</strong> ${data.vehicle}</p>
      <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Card:</strong> ${data.maskedCard || "Not applicable"}</p>
      <p><strong>Notes:</strong> ${data.notes || "N/A"}</p>
      <p>We will contact you soon.</p>
    `
  );
}

function paymentAdminEmail(data) {
  return wrapTemplate(
    "New Payment Request",
    `
      <p>A new payment request was submitted.</p>
      <p><strong>Vehicle:</strong> ${data.vehicle}</p>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
      <p><strong>Card:</strong> ${data.maskedCard || "Not applicable"}</p>
      <p><strong>Notes:</strong> ${data.notes || "N/A"}</p>
    `
  );
}

function sellCarUserEmail(data) {
  return wrapTemplate(
    "Sell Car Request Submitted",
    `
      <p>Hello <strong>${data.fullName}</strong>,</p>
      <p>Your sell-car request has been submitted successfully.</p>
      <p><strong>Vehicle:</strong> ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}</p>
      <p><strong>Mileage:</strong> ${data.mileage}</p>
      <p><strong>Condition:</strong> ${data.condition}</p>
      <p><strong>Asking Price:</strong> ${data.askingPrice}</p>
      <p><strong>Notes:</strong> ${data.notes || "N/A"}</p>
      <p>We will review your request and contact you soon.</p>
    `
  );
}

function sellCarAdminEmail(data) {
  return wrapTemplate(
    "New Sell Car Request",
    `
      <p>A new sell-car request was submitted.</p>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Vehicle:</strong> ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}</p>
      <p><strong>Mileage:</strong> ${data.mileage}</p>
      <p><strong>Condition:</strong> ${data.condition}</p>
      <p><strong>Asking Price:</strong> ${data.askingPrice}</p>
      <p><strong>Notes:</strong> ${data.notes || "N/A"}</p>
    `
  );
}

function loginPasscodeEmail(fullName, code) {
  return wrapTemplate(
    "Your Login Passcode",
    `
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Your SpeedBuyCars login passcode is:</p>
      <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#e11d1d; margin:20px 0;">
        ${code}
      </div>
      <p>This code will expire in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `
  );
}

module.exports = {
  registerUserEmail,
  quoteUserEmail,
  quoteAdminEmail,
  paymentUserEmail,
  paymentAdminEmail,
  sellCarUserEmail,
  sellCarAdminEmail,
  loginPasscodeEmail
};
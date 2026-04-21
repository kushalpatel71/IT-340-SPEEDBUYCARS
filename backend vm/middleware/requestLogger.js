function redactBody(body = {}) {
  const cloned = { ...body };

  if (cloned.password) cloned.password = "[REDACTED]";
  if (cloned.cardNumber) cloned.cardNumber = "[REDACTED]";
  if (cloned.cvv) cloned.cvv = "[REDACTED]";
  if (cloned.cardName) cloned.cardName = "[REDACTED]";
  if (cloned.expiry) cloned.expiry = "[REDACTED]";

  return cloned;
}

function requestLogger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`, redactBody(req.body));
  next();
}

module.exports = requestLogger;
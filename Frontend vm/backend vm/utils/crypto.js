const bcrypt = require("bcrypt");
const crypto = require("crypto");

const SALT_ROUNDS = 12;
const ENC_KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY || "default-demo-key")
  .digest(); // 32 bytes

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function maskCard(cardNumber = "") {
  const clean = String(cardNumber).replace(/\D/g, "");
  if (clean.length < 4) return "****";
  return `**** **** **** ${clean.slice(-4)}`;
}

function getCardLast4(cardNumber = "") {
  const clean = String(cardNumber).replace(/\D/g, "");
  return clean.slice(-4);
}

function getCardFingerprint(cardNumber = "") {
  const clean = String(cardNumber).replace(/\D/g, "");
  if (!clean) return "";
  return crypto.createHash("sha256").update(clean).digest("hex");
}

function encryptText(plainText = "") {
  if (!plainText) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(String(plainText), "utf8"),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

function decryptText(payload = "") {
  if (!payload) return "";
  const [ivHex, tagHex, encryptedHex] = payload.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    ENC_KEY,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

module.exports = {
  hashPassword,
  comparePassword,
  maskCard,
  getCardLast4,
  getCardFingerprint,
  encryptText,
  decryptText
};
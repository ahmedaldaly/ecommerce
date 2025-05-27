const cloudinary = require('cloudinary').v2;
require('dotenv').config();
if (!process.env.CLOUD_NAME || !process.env.CLOUD_KAY || !process.env.CLOUD_SECRIT) {
  console.error('Error: Missing required Cloudinary environment variables.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KAY,
  api_secret: process.env.CLOUD_SECRIT,
  secure: true,
});

module.exports = cloudinary;
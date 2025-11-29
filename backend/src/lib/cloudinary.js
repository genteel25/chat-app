import { v2 as cloudinary } from 'cloudinary'
import { ENV } from './env.js';

// Ensure credentials are properly trimmed and validated
const cloudName = ENV.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = ENV.CLOUDINARY_API_KEY?.trim();
const apiSecret = ENV.CLOUDINARY_API_SECRET?.trim();

if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Missing Cloudinary credentials in .env file');
    console.error('Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
} else {
    console.log('✅ Cloudinary credentials loaded successfully');
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
})

export default cloudinary;
import { ENV } from './src/lib/env.js';

console.log('\n🔍 Checking Cloudinary Credentials...\n');

console.log('CLOUDINARY_CLOUD_NAME:', ENV.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', ENV.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', ENV.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

console.log('\n📋 Credential Details (first/last 4 chars only):');
if (ENV.CLOUDINARY_CLOUD_NAME) {
    const name = ENV.CLOUDINARY_CLOUD_NAME.trim();
    console.log(`  Cloud Name: ${name.substring(0, 4)}...${name.substring(name.length - 4)} (length: ${name.length})`);
}
if (ENV.CLOUDINARY_API_KEY) {
    const key = ENV.CLOUDINARY_API_KEY.trim();
    console.log(`  API Key: ${key.substring(0, 4)}...${key.substring(key.length - 4)} (length: ${key.length})`);
}
if (ENV.CLOUDINARY_API_SECRET) {
    const secret = ENV.CLOUDINARY_API_SECRET.trim();
    console.log(`  API Secret: ${secret.substring(0, 4)}...${secret.substring(secret.length - 4)} (length: ${secret.length})`);
}

console.log('\n⚠️  Common Issues to Check:');
console.log('  1. No quotes around values in .env file');
console.log('  2. No spaces before or after the = sign');
console.log('  3. Using API Secret (not API Environment Variable)');
console.log('  4. Correct variable names (CLOUDINARY_CLOUD_NAME, not CLOUD_NAME)');
console.log('\n');

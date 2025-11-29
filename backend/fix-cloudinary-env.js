#!/usr/bin/env node

/**
 * Cloudinary Credentials Fixer
 * 
 * This script helps you verify and fix your Cloudinary credentials.
 * Run this script and paste your credentials when prompted.
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n🔧 Cloudinary Credentials Helper\n');
console.log('This will help you verify your Cloudinary credentials.');
console.log('Go to: https://console.cloudinary.com/\n');

const questions = [
    'Enter your CLOUDINARY_CLOUD_NAME: ',
    'Enter your CLOUDINARY_API_KEY: ',
    'Enter your CLOUDINARY_API_SECRET: '
];

const answers = [];

function ask(index) {
    if (index >= questions.length) {
        rl.close();
        processAnswers();
        return;
    }

    rl.question(questions[index], (answer) => {
        answers.push(answer.trim());
        ask(index + 1);
    });
}

function processAnswers() {
    const [cloudName, apiKey, apiSecret] = answers;

    console.log('\n✅ Credentials received:');
    console.log(`  Cloud Name: ${cloudName.substring(0, 4)}...${cloudName.substring(cloudName.length - 4)} (length: ${cloudName.length})`);
    console.log(`  API Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)} (length: ${apiKey.length})`);
    console.log(`  API Secret: ${apiSecret.substring(0, 4)}...${apiSecret.substring(apiSecret.length - 4)} (length: ${apiSecret.length})`);

    // Read existing .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add Cloudinary credentials
    const lines = envContent.split('\n');
    const updatedLines = [];
    let foundCloudName = false;
    let foundApiKey = false;
    let foundApiSecret = false;

    for (const line of lines) {
        if (line.startsWith('CLOUDINARY_CLOUD_NAME=')) {
            updatedLines.push(`CLOUDINARY_CLOUD_NAME=${cloudName}`);
            foundCloudName = true;
        } else if (line.startsWith('CLOUDINARY_API_KEY=')) {
            updatedLines.push(`CLOUDINARY_API_KEY=${apiKey}`);
            foundApiKey = true;
        } else if (line.startsWith('CLOUDINARY_API_SECRET=')) {
            updatedLines.push(`CLOUDINARY_API_SECRET=${apiSecret}`);
            foundApiSecret = true;
        } else {
            updatedLines.push(line);
        }
    }

    // Add missing credentials
    if (!foundCloudName) updatedLines.push(`CLOUDINARY_CLOUD_NAME=${cloudName}`);
    if (!foundApiKey) updatedLines.push(`CLOUDINARY_API_KEY=${apiKey}`);
    if (!foundApiSecret) updatedLines.push(`CLOUDINARY_API_SECRET=${apiSecret}`);

    // Write back to .env
    const backupPath = path.join(process.cwd(), '.env.backup');
    if (fs.existsSync(envPath)) {
        fs.copyFileSync(envPath, backupPath);
        console.log(`\n💾 Backup created: .env.backup`);
    }

    fs.writeFileSync(envPath, updatedLines.join('\n'));
    console.log(`✅ Updated .env file with clean credentials`);
    console.log(`\n🔄 Please restart your server for changes to take effect.\n`);
}

ask(0);

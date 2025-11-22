#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Determine which .env file to use
const envFile = process.env.NG_ENV_FILE || '.env';
require('dotenv').config({ path: envFile });

const firebaseApiKey = process.env.FIREBASE_API_KEY;

if (!firebaseApiKey) {
  console.error('Error: FIREBASE_API_KEY is not set in ' + envFile);
  process.exit(1);
}

// Replace in both environment files
const files = [
  { path: 'src/environments/environment.ts', placeholder: "apiKey: ''," },
  { path: 'src/environments/environment.prod.ts', placeholder: "apiKey: ''," }
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace empty apiKey with the actual key from env
  content = content.replace(
    "apiKey: '',",
    `apiKey: '${firebaseApiKey}',`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Replaced Firebase API key in ${file.path}`);
});


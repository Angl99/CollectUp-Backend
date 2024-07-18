const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load the .env.test environment variables
dotenv.config({ path: './.env.test' });

function initTestDb() {
  console.log('Initializing test database...');
  
  try {
    // Explicitly set environment variables for the command
    execSync('npx prisma migrate reset --force --skip-generate --skip-seed', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL // Explicitly set DATABASE_URL
      }
    });
    
    console.log('Test database initialized successfully.');
  } catch (error) {
    console.error('Error initializing test database:', error.message);
    process.exit(1);
  }
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in the .env.test file');
  process.exit(1);
}

initTestDb();


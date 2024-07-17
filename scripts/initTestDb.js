const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load the .env.test environment variables
dotenv.config({ path: './.env.test' });

function initTestDb() {
  console.log('Initializing test database...');
  
  // Explicitly set environment variables for the command
  execSync('npx prisma migrate reset --force --skip-generate --skip-seed', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL // Explicitly set DATABASE_URL
    }
  });
  
  console.log('Test database initialized.');
}

initTestDb();


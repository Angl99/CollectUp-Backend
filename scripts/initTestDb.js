const { execSync } = require('child_process');
const dotenv = require('dotenv');
const { Client } = require('pg');

// Load the .env.test environment variables
dotenv.config({ path: './.env.test' });

async function checkDatabaseExists() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    await client.query('SELECT 1');
    console.log('Database connection successful.');
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    return false;
  } finally {
    await client.end();
  }
}

async function initTestDb() {
  console.log('Initializing test database...');
  
  if (!(await checkDatabaseExists())) {
    console.error('ERROR: Unable to connect to the specified database. Please check your DATABASE_URL.');
    process.exit(1);
  }

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


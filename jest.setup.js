require('dotenv').config({ path: './.env.test' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { execSync } = require('child_process');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(async () => {
  console.log('Initializing test database...');
  try {
    execSync('node scripts/initTestDb.js', { stdio: 'inherit' });
    console.log('Test database initialized.');
    await delay(2000);
    console.log('Starting tests...');
  } catch (error) {
    console.error('Error during test database initialization:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

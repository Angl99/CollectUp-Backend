require('dotenv').config({ path: './.env.test' });
const { prisma } = require('./helpers/prismaDbHelper')

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(async () => {
  console.log('Initializing test database...');
  try {
    console.log('Test database initialized.');
    // await delay(2000);
    console.log('Starting tests...');
  } catch (error) {
    console.error('Error during test database initialization:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  await prisma.item.deleteMany();
  await prisma.$disconnect();
});

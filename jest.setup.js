require('dotenv').config({ path: './.env.test' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { execSync } = require('child_process');

beforeAll(async () => {
  console.log('Initializing test database...');
  execSync('node scripts/initTestDb.js', { stdio: 'inherit' });
  console.log('Test database initialized.');
  await prisma.productSeries.deleteMany();
  await prisma.series.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.showcase.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

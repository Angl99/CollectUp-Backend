require('dotenv').config({ path: './.env.test' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
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

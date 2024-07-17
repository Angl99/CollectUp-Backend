const request = require('supertest');
const app = require('../../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Item Controller', () => {
  let testUser;
  let testProduct;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        uid: 'test-uid-123',
      },
    });

    testProduct = await prisma.product.create({
      data: {
        ean: 'test-ean-123',
        data: { code: 'test-code' },
      },
    });
  });

  afterAll(async () => {
    await prisma.item.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.$disconnect();
  });

  test('should create a new item', async () => {
    const response = await request(app)
      .post('/items')
      .send({
        uid: testUser.uid,
        productEan: testProduct.ean,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(testUser.id);
    expect(response.body.productEan).toBe(testProduct.ean);
  });

  test('should fetch all items', async () => {
    const response = await request(app).get('/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('should search for an item', async () => {
    const response = await request(app)
      .get('/items/search')
      .query({ code: 'test-code' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.productEan).toBe(testProduct.ean);
  });

  test('should update an item', async () => {
    const item = await prisma.item.create({
      data: {
        userId: testUser.id,
        productEan: testProduct.ean,
      },
    });

    const response = await request(app)
      .put(`/items/${item.id}`)
      .send({
        productEan: 'updated-ean-456',
      });

    expect(response.status).toBe(200);
    expect(response.body.productEan).toBe('updated-ean-456');
  });

  test('should delete an item', async () => {
    const item = await prisma.item.create({
      data: {
        userId: testUser.id,
        productEan: testProduct.ean,
      },
    });

    const response = await request(app).delete(`/items/${item.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item deleted successfully');

    const deletedItem = await prisma.item.findUnique({
      where: { id: item.id },
    });
    expect(deletedItem).toBeNull();
  });
});

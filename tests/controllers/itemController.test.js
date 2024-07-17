const request = require('supertest');
const app = require('../../index'); // Adjust the path as necessary
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Item Controller', () => {
  let user, product;

  beforeEach(async () => {
    // Create a user
    user = await prisma.user.create({
      data: {
        uid: `testuser${Date.now()}`,
        first_name: 'Test',
        last_name: 'User',
        email: `testuser${Date.now()}@example.com`,
      },
    });

    // Create a product
    product = await prisma.product.create({
      data: {
        ean: `1234567890123${Date.now()}`, // Append timestamp to ensure uniqueness
        upc: '123456789012',
        isbn: '1234567890',
        data: { name: 'Test Product', description: 'This is a test product' },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new item', async () => {
    const response = await request(app)
      .post('/items')
      .send({
        uid: user.uid,
        productEan: product.ean
      });

    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(user.id);
    expect(response.body.productEan).toBe(product.ean);
  });

  test('should fetch all items', async () => {
    // Create an item first
    await request(app)
      .post('/items')
      .send({
        uid: user.uid,
        productEan: product.ean
      });

    const response = await request(app).get('/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('should search for an item', async () => {
    // Create an item first
    const createResponse = await request(app)
      .post('/items')
      .send({
        uid: user.uid,
        productEan: product.ean
      });

    const searchResponse = await request(app)
      .get('/items/search')
      .query({ code: product.ean });

    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.id).toBe(createResponse.body.id);
    expect(searchResponse.body.productEan).toBe(product.ean);
  });

  test('should update an item', async () => {
    // Create an item first
    const createResponse = await request(app)
      .post('/items')
      .send({
        uid: user.uid,
        productEan: product.ean
      });

    const newProduct = await prisma.product.create({
      data: {
        ean: `9876543210987${Date.now()}`, // Append timestamp to ensure uniqueness
        upc: '987654321098',
        isbn: '9876543210',
        data: { name: 'New Test Product', description: 'This is a new test product' },
      },
    });

    const updateResponse = await request(app)
      .put(`/items/${createResponse.body.id}`)
      .send({
        productEan: newProduct.ean,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.productEan).toBe(newProduct.ean);
  });

  test('should delete an item', async () => {
    // Create an item first
    const createResponse = await request(app)
      .post('/items')
      .send({
        uid: user.uid,
        productEan: product.ean
      });

    const deleteResponse = await request(app).delete(`/items/${createResponse.body.id}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Item deleted successfully');

    const deletedItem = await prisma.item.findUnique({
      where: { id: createResponse.body.id },
    });
    expect(deletedItem).toBeNull();
  });
});

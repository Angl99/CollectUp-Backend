const request = require('supertest');
const app = require('../../index'); // Adjust the path as necessary
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Product Controller', () => {
  beforeAll(async () => {
    await prisma.product.deleteMany(); // Clear the database before running tests
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        ean: '1234567890123',
        upc: '123456789012',
        isbn: '1234567890',
        data: { name: 'Test Product', description: 'This is a test product' }
      });

    expect(response.status).toBe(201);
    expect(response.body.ean).toBe('1234567890123');
  });

  test('should fetch all products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test('should fetch a product by EAN', async () => {
    const response = await request(app).get('/products/1234567890123');
    expect(response.status).toBe(200);
    expect(response.body.ean).toBe('1234567890123');
  });

  test('should update a product', async () => {
    const response = await request(app)
      .put('/products/1234567890123')
      .send({
        upc: '210987654321',
        isbn: '0987654321',
        data: { name: 'Updated Test Product', description: 'This is an updated test product' }
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Updated Test Product');
  });

  test('should delete a product', async () => {
    const response = await request(app).delete('/products/1234567890123');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product deleted!');
  });
});

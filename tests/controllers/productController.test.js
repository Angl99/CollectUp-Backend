const request = require('supertest');
const app = require('../../index');
const { prisma } = require('../../helpers/prismaDbHelper')

describe('Product Controller',  () => {
  let testEan;

  beforeAll(async () => {
    await prisma.$connect();
    testEan = `1234567890123${Math.random()}`;
  });

  beforeEach(async () => {
    await prisma.item.deleteMany();
    await prisma.product.deleteMany();
  });

  afterEach(async () => {
    await prisma.item.deleteMany();
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        ean: testEan,
        upc: '123456789012',
        isbn: '1234567890',
        data: {
          title: 'Test Product',
          description: 'This is a test product'
        }
      });

    expect(response.status).toBe(201);
    expect(response.body.ean).toBe(testEan);
  });

  test('should fetch all products', async () => {
    // Create a product first
    await request(app)
      .post('/products')
      .send({
        ean: `9876543210987${Date.now()}`,
        upc: '987654321098',
        isbn: '9876543210',
        data: {
          title: 'Another Test Product',
          description: 'This is another test product'
        }
      });

    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('should fetch a product by EAN', async () => {
    // Create a product first
    await request(app)
      .post('/products')
      .send({
        ean: testEan,
        upc: '123456789012',
        isbn: '1234567890',
        data: {
          title: 'Fetch Test Product',
          description: 'This is a fetch test product'
        }
      });

    const response = await request(app).get(`/products/${testEan}`);
    expect(response.status).toBe(200);
    expect(response.body.ean).toBe(testEan);
  });

  test('should update a product', async () => {
    // Create a product first
    await request(app)
      .post('/products')
      .send({
        ean: testEan,
        upc: '123456789012',
        isbn: '1234567890',
        data: {
          title: 'Update Test Product',
          description: 'This is an update test product'
        }
      });

    const response = await request(app)
      .put(`/products/${testEan}`)
      .send({
        upc: '210987654321',
        isbn: '0987654321',
        data: {
          title: 'Updated Test Product',
          description: 'This is an updated test product'
        }
      });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated Test Product');
  });

  test('should delete a product', async () => {
    // Create a product first
    await request(app)
      .post('/products')
      .send({
        ean: testEan,
        upc: '123456789012',
        isbn: '1234567890',
        data: {
          title: 'Delete Test Product',
          description: 'This is a delete test product'
        }
      });

    const response = await request(app).delete(`/products/${testEan}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product and associated ProductSeries entries deleted successfully');
  });
});

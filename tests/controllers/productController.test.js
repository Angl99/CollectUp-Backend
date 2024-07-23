const request = require('supertest');
const app = require('../../index');
const { prisma } = require('../../helpers/prismaDbHelper')

describe('Product Controller', () => {
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
        title: 'Test Product',
        description: 'This is a test product',
        brand: 'Test Brand',
        model: 'Test Model',
        color: 'Red',
        size: 'Medium',
        dimension: '10x10x10',
        weight: '1kg',
        category: 'Test Category',
        images: ['http://example.com/image.jpg'],
        offers: []
      });

    expect(response.status).toBe(201);
    expect(response.body.code).toBe('OK');
    expect(response.body.items[0].ean).toBe(testEan);
  });

  test('should fetch all products', async () => {
    // Create a product first
    await request(app)
      .post('/products')
      .send({
        ean: `9876543210987${Date.now()}`,
        upc: '987654321098',
        isbn: '9876543210',
        title: 'Another Test Product',
        description: 'This is another test product',
        brand: 'Test Brand',
        model: 'Test Model',
        color: 'Blue',
        size: 'Large',
        dimension: '20x20x20',
        weight: '2kg',
        category: 'Test Category',
        images: ['http://example.com/image2.jpg'],
        offers: []
      });

    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.code).toBe('OK');
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  test('should fetch a product by EAN', async () => {
    // Create a product first
    await request(app)
      .post('/products')
      .send({
        ean: testEan,
        upc: '123456789012',
        isbn: '1234567890',
        title: 'Fetch Test Product',
        description: 'This is a fetch test product',
        brand: 'Test Brand',
        model: 'Test Model',
        color: 'Green',
        size: 'Small',
        dimension: '5x5x5',
        weight: '0.5kg',
        category: 'Test Category',
        images: ['http://example.com/image3.jpg'],
        offers: []
      });

    const response = await request(app).get(`/products/${testEan}`);
    expect(response.status).toBe(200);
    expect(response.body.code).toBe('OK');
    expect(response.body.items[0].ean).toBe(testEan);
  });

  test('should update a product', async () => {
    // Create a product first
    await request(app)
      .post('/products')
      .send({
        ean: testEan,
        upc: '123456789012',
        isbn: '1234567890',
        title: 'Update Test Product',
        description: 'This is an update test product',
        brand: 'Test Brand',
        model: 'Test Model',
        color: 'Yellow',
        size: 'XL',
        dimension: '30x30x30',
        weight: '3kg',
        category: 'Test Category',
        images: ['http://example.com/image4.jpg'],
        offers: []
      });

    const response = await request(app)
      .put(`/products/${testEan}`)
      .send({
        upc: '210987654321',
        isbn: '0987654321',
        title: 'Updated Test Product',
        description: 'This is an updated test product',
        brand: 'Updated Brand',
        model: 'Updated Model',
        color: 'Purple',
        size: 'XXL',
        dimension: '40x40x40',
        weight: '4kg',
        category: 'Updated Category',
        images: ['http://example.com/updated_image.jpg'],
        offers: []
      });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe('OK');
    expect(response.body.items[0].title).toBe('Updated Test Product');
  });

  test('should delete a product', async () => {
    // Create a product first
    await request(app)
      .post('/products')
      .send({
        ean: testEan,
        upc: '123456789012',
        isbn: '1234567890',
        title: 'Delete Test Product',
        description: 'This is a delete test product',
        brand: 'Test Brand',
        model: 'Test Model',
        color: 'Black',
        size: 'One Size',
        dimension: '15x15x15',
        weight: '1.5kg',
        category: 'Test Category',
        images: ['http://example.com/image5.jpg'],
        offers: []
      });

    const response = await request(app).delete(`/products/${testEan}`);
    expect(response.status).toBe(200);
    expect(response.body.code).toBe('OK');
    expect(response.body.message).toBe('Product and associated ProductSeries entries deleted!');
  });
});

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
          description: 'This is a test product',
          brand: 'TestBrand'
        },
        searchableTitle: 'test product',
        searchableDescription: 'this is a test product',
        searchableBrand: 'testbrand'
      });

    expect(response.status).toBe(201);
    expect(response.body.ean).toBe(testEan);
    expect(response.body.searchableTitle).toBe('test product');
    expect(response.body.searchableDescription).toBe('this is a test product');
    expect(response.body.searchableBrand).toBe('testbrand');
    expect(response.body.searchableTitle).toBe('test product');
    expect(response.body.searchableDescription).toBe('this is a test product');
    expect(response.body.searchableBrand).toBe('testbrand');
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
          description: 'This is another test product',
          brand: 'AnotherTestBrand'
        },
        searchableTitle: 'another test product',
        searchableDescription: 'this is another test product',
        searchableBrand: 'anothertestbrand'
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
          description: 'This is a fetch test product',
          brand: 'FetchTestBrand'
        },
        searchableTitle: 'fetch test product',
        searchableDescription: 'this is a fetch test product',
        searchableBrand: 'fetchtestbrand'
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
          description: 'This is an update test product',
          brand: 'UpdateTestBrand'
        },
        searchableTitle: 'update test product',
        searchableDescription: 'this is an update test product',
        searchableBrand: 'updatetestbrand'
      });

    const response = await request(app)
      .put(`/products/${testEan}`)
      .send({
        upc: '210987654321',
        isbn: '0987654321',
        data: {
          title: 'Updated Test Product',
          description: 'This is an updated test product',
          brand: 'UpdatedTestBrand'
        },
        searchableTitle: 'updated test product',
        searchableDescription: 'this is an updated test product',
        searchableBrand: 'updatedtestbrand'
      });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated Test Product');
    expect(response.body.searchableTitle).toBe('updated test product');
    expect(response.body.searchableDescription).toBe('this is an updated test product');
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
          description: 'This is a delete test product',
          brand: 'DeleteTestBrand'
        },
        searchableTitle: 'delete test product',
        searchableDescription: 'this is a delete test product',
        searchableBrand: 'deletetestbrand'
      });

    const response = await request(app).delete(`/products/${testEan}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product and associated ProductSeries entries deleted successfully');
  });

  test('should search for products', async () => {
    // Create test products
    await request(app)
      .post('/products')
      .send({
        ean: `1111111111111${Date.now()}`,
        upc: '111111111111',
        isbn: '1111111111',
        data: {
          title: 'Search Test Product 1',
          description: 'This is a search test product',
          brand: 'TestBrand'
        }
      });

    await request(app)
      .post('/products')
      .send({
        ean: `2222222222222${Date.now()}`,
        upc: '222222222222',
        isbn: '2222222222',
        data: {
          title: 'Search Test Product 2',
          description: 'This is another search test product',
          brand: 'AnotherBrand'
        }
      });

    // Test search by title (case-insensitive)
    let response = await request(app).get('/products/search?query=search test');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    // Test search by description (case-insensitive)
    response = await request(app).get('/products/search?query=ANOTHER SEARCH');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);

    // Test search by brand (case-insensitive)
    response = await request(app).get('/products/search?query=testbrand');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);

    // Test search with mixed case
    response = await request(app).get('/products/search?query=SeArCh TeSt');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    // Verify searchable fields
    const searchResult = response.body[0];
    expect(searchResult.searchableTitle.toLowerCase()).toContain('search test');
    expect(searchResult.searchableDescription.toLowerCase()).toContain('search test');
    expect(searchResult.searchableBrand.toLowerCase()).toBe('testbrand');

    // Test search with no results
    response = await request(app).get('/products/search?query=NonexistentProduct');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);

    // Test search with empty query
    response = await request(app).get('/products/search');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Search query is required');
  });
});

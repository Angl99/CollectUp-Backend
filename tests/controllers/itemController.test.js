const request = require('supertest');
const app = require('../../index');
const { prisma } = require('../../helpers/prismaDbHelper')


describe('Item Controller', () => {
  let user, product;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.item.deleteMany();
    await prisma.showcase.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();

    user = await prisma.user.create({
      data: {
        uid: `testuser${Date.now()}`,
        first_name: 'Test',
        last_name: 'User',
        email: `testuser${Math.random()}@example.com`,
      },
    });

    product = await prisma.product.create({
      data: {
        ean: `1234567890123${Date.now()}`,
        upc: '123456789012',
        isbn: '1234567890',
        data: { name: 'Test Product', description: 'This is a test product' },
      },
    });
  });

  afterEach(async () => {
    await prisma.item.deleteMany();
    await prisma.showcase.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new item', async () => {
    console.log(product);
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

  test('should update an item', async () => {
    // Create an item first
    const createResponse = await request(app)
      .post('/items')
      .send({
        uid: user.uid,
        productEan: product.ean
      });

    const newImageUrl = 'https://example.com/new-image.jpg';
    const newCondition = 'Like New';
    const newUserDescription = 'This is an updated description';

    const updateResponse = await request(app)
      .put(`/items/${createResponse.body.id}`)
      .send({
        imageUrl: newImageUrl,
        condition: newCondition,
        userDescription: newUserDescription,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.imageUrl).toBe(newImageUrl);
    expect(updateResponse.body.condition).toBe(newCondition);
    expect(updateResponse.body.userDescription).toBe(newUserDescription);
    // Ensure productEan hasn't changed
    expect(updateResponse.body.productEan).toBe(product.ean);
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

  test('should search for items by associated product', async () => {
    // Create two products
    const product1 = await prisma.product.create({
      data: {
        ean: `1111111111111${Date.now()}`,
        upc: '111111111111',
        isbn: '1111111111',
        data: {
          title: 'Search Test Product 1',
          description: 'This is a search test product',
          brand: 'TestBrand'
        }
      }
    });

    const product2 = await prisma.product.create({
      data: {
        ean: `2222222222222${Date.now()}`,
        upc: '222222222222',
        isbn: '2222222222',
        data: {
          title: 'Search Test Product 2',
          description: 'This is another search test product',
          brand: 'AnotherBrand'
        }
      }
    });

    // Create items associated with these products
    await prisma.item.create({
      data: {
        userId: user.id,
        productEan: product1.ean,
      }
    });

    await prisma.item.create({
      data: {
        userId: user.id,
        productEan: product2.ean,
      }
    });

    // Test search by title (case-insensitive)
    let response = await request(app).get('/items/search?query=search test');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    // Test search by description (case-insensitive)
    response = await request(app).get('/items/search?query=ANOTHER SEARCH');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);

    // Test search by brand (case-insensitive)
    response = await request(app).get('/items/search?query=testbrand');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);

    // Test search with mixed case
    response = await request(app).get('/items/search?query=SeArCh TeSt');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    // Test search with no results
    response = await request(app).get('/items/search?query=NonexistentProduct');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);

    // Test search with empty query
    response = await request(app).get('/items/search');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Search query is required');
  });
});

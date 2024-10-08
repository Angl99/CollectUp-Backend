const request = require('supertest');
const app = require('../../index');
const { prisma } = require('../../helpers/prismaDbHelper')


describe('Series Controller', () => {
  let createdSeriesId;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.productSeries.deleteMany();
    await prisma.series.deleteMany();
    await prisma.product.deleteMany();

    // Create a test product
    const testProduct = await prisma.product.create({
      data: {
        ean: 'test-ean-123',
        data: { name: 'Test Product' },
       searchableTitle: 'asasa',
       searchableDescription: 'am',
       searchableBrand: 'iu'
      }
    });

    // Create a test series with the product
    const testSeries = await prisma.series.create({
      data: {
        name: 'Test Series',
        products: {
          create: {
            product: {
              connect: { ean: testProduct.ean }
            }
          }
        }
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });
    createdSeriesId = testSeries.id;
  });

  afterEach(async () => {
    await prisma.productSeries.deleteMany();
    await prisma.series.deleteMany();
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new series', async () => {
    const response = await request(app)
      .post('/series')
      .send({
        name: 'Another Test Series',
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Another Test Series');
  });

  test('should fetch all series', async () => {
    const response = await request(app).get('/series');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.some(series => series.id === createdSeriesId)).toBe(true);
  });

  test('should fetch a specific series by ID', async () => {
    const response = await request(app).get(`/series/${createdSeriesId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Series');
  });

  test('should update a series', async () => {
    const response = await request(app)
      .put(`/series/${createdSeriesId}`)
      .send({
        name: 'Updated Test Series',
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Test Series');
  });

  test('should add a product to a series', async () => {
    // First, create a new product different from the default one
    const newProductResponse = await request(app)
      .post('/products')
      .send({
        ean: 'new-test-ean-456',
        data: { name: 'New Test Product' }
      });

    expect(newProductResponse.status).toBe(201);

    const response = await request(app)
      .post(`/series/${createdSeriesId}/products`)
      .send({
        productEan: 'new-test-ean-456',
      });

    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(2); // Now we expect 2 products
    expect(response.body.products.some(p => p.product.ean === 'new-test-ean-456')).toBe(true);
  });

  test('should get all products for a series', async () => {
    const response = await request(app).get(`/series/${createdSeriesId}/products`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].ean).toBe('test-ean-123');
  });

  test('should remove a product from a series', async () => {
    // First, verify that the product is in the series
    let response = await request(app).get(`/series/${createdSeriesId}/products`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].ean).toBe('test-ean-123');

    // Now remove the product
    response = await request(app).delete(`/series/${createdSeriesId}/products/test-ean-123`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product removed from series');

    // Verify that the product is no longer in the series
    response = await request(app).get(`/series/${createdSeriesId}/products`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test('should delete a series', async () => {
    const response = await request(app).delete(`/series/${createdSeriesId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Series and associated ProductSeries entries deleted!');
  });
});

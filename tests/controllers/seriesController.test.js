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

    // Create a test series
    const testSeries = await prisma.series.create({
      data: {
        name: 'Test Series',
      },
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
    // First, create a product
    const productResponse = await request(app)
      .post('/products')
      .send({
        ean: 'test-ean-123',
        data: { name: 'Test Product' }
      });

    const response = await request(app)
      .post(`/series/${createdSeriesId}/products`)
      .send({
        productEan: 'test-ean-123',
      });

    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.products[0].product.ean).toBe('test-ean-123');
  });

  test('should get all products for a series', async () => {
    const response = await request(app).get(`/series/${createdSeriesId}/products`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].ean).toBe('test-ean-123');
  });

  test('should remove a product from a series', async () => {
    const response = await request(app).delete(`/series/${createdSeriesId}/products/test-ean-123`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product removed from series');
  });

  test('should delete a series', async () => {
    const response = await request(app).delete(`/series/${createdSeriesId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Series deleted!');
  });
});

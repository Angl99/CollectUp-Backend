const request = require('supertest');
const app = require('../../index'); // Adjust the path as necessary
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Collection Controller', () => {
  beforeAll(async () => {
    await prisma.collection.deleteMany(); // Clear the database before running tests
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new collection', async () => {
    const response = await request(app)
      .post('/collections')
      .send({
        name: 'Test Collection',
        showcaseId: 1 // Assuming a showcase with id 1 exists
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Collection');
  });

  test('should fetch all collections', async () => {
    const response = await request(app).get('/collections');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('should fetch a collection by ID', async () => {
    const createResponse = await request(app)
      .post('/collections')
      .send({
        name: 'Fetch Test Collection',
        showcaseId: 1
      });

    const fetchResponse = await request(app).get(`/collections/${createResponse.body.id}`);
    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body.name).toBe('Fetch Test Collection');
  });

  test('should update a collection', async () => {
    const createResponse = await request(app)
      .post('/collections')
      .send({
        name: 'Update Test Collection',
        showcaseId: 1
      });

    const updateResponse = await request(app)
      .put(`/collections/${createResponse.body.id}`)
      .send({
        name: 'Updated Collection Name',
        showcaseId: 2 // Assuming a showcase with id 2 exists
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Updated Collection Name');
  });

  test('should delete a collection', async () => {
    const createResponse = await request(app)
      .post('/collections')
      .send({
        name: 'Delete Test Collection',
        showcaseId: 1
      });

    const deleteResponse = await request(app).delete(`/collections/${createResponse.body.id}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Collection deleted!');
  });

  test('should add an item to a collection', async () => {
    const collectionResponse = await request(app)
      .post('/collections')
      .send({
        name: 'Add Item Test Collection',
        showcaseId: 1
      });

    const itemResponse = await request(app)
      .post('/items') // Assuming there's an endpoint to create items
      .send({
        userId: 1, // Assuming a user with id 1 exists
        productEan: '1234567890123' // Assuming a product with this EAN exists
      });

    const addItemResponse = await request(app)
      .post('/collections/add-item')
      .send({
        collectionId: collectionResponse.body.id,
        itemId: itemResponse.body.id
      });

    expect(addItemResponse.status).toBe(200);
    expect(addItemResponse.body.items).toContainEqual(expect.objectContaining({
      id: itemResponse.body.id
    }));
  });
});

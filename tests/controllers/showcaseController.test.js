const request = require('supertest');
const app = require('../../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Showcase Controller', () => {
  let testUser;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        uid: 'test-uid-123',
      },
    });
  });

  afterAll(async () => {
    await prisma.showcase.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('should create a new showcase', async () => {
    const response = await request(app)
      .post('/showcases')
      .send({
        name: 'Test Showcase',
        uid: testUser.uid,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Showcase');
    expect(response.body.userId).toBe(testUser.id);
  });

  test('should fetch all showcases', async () => {
    const response = await request(app).get('/showcases');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('should fetch a specific showcase', async () => {
    const showcase = await prisma.showcase.create({
      data: {
        name: 'Fetch Test Showcase',
        userId: testUser.id,
      },
    });

    const response = await request(app).get(`/showcases/${showcase.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(showcase.id);
    expect(response.body.name).toBe('Fetch Test Showcase');
  });

  test('should update a showcase', async () => {
    const showcase = await prisma.showcase.create({
      data: {
        name: 'Update Test Showcase',
        userId: testUser.id,
      },
    });

    const response = await request(app)
      .put(`/showcases/${showcase.id}`)
      .send({
        name: 'Updated Showcase Name',
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Showcase Name');
  });

  test('should add items to a showcase', async () => {
    const showcase = await prisma.showcase.create({
      data: {
        name: 'Add Items Test Showcase',
        userId: testUser.id,
      },
    });

    const product = await prisma.product.create({
      data: {
        ean: 'test-ean-123',
        data: {},
      },
    });

    const item = await prisma.item.create({
      data: {
        userId: testUser.id,
        productEan: product.ean,
      },
    });

    const response = await request(app)
      .put(`/showcases/${showcase.id}/items`)
      .send([{ type: 'Item', id: item.id }]);

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].id).toBe(item.id);
  });

  test('should delete a showcase', async () => {
    const showcase = await prisma.showcase.create({
      data: {
        name: 'Delete Test Showcase',
        userId: testUser.id,
      },
    });

    const response = await request(app).delete(`/showcases/${showcase.id}`);
    expect(response.status).toBe(204);

    const deletedShowcase = await prisma.showcase.findUnique({
      where: { id: showcase.id },
    });
    expect(deletedShowcase).toBeNull();
  });

  test('should remove items from a showcase', async () => {
    const showcase = await prisma.showcase.create({
      data: {
        name: 'Remove Items Test Showcase',
        userId: testUser.id,
      },
    });

    const product = await prisma.product.create({
      data: {
        ean: 'test-ean-456',
        data: {},
      },
    });

    const item = await prisma.item.create({
      data: {
        userId: testUser.id,
        productEan: product.ean,
        showcaseId: showcase.id,
      },
    });

    const response = await request(app)
      .delete(`/showcases/${showcase.id}/items`)
      .send([{ type: 'Item', id: item.id }]);

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(0);

    const updatedItem = await prisma.item.findUnique({
      where: { id: item.id },
    });
    expect(updatedItem.showcaseId).toBeNull();
  });
});

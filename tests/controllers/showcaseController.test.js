const request = require('supertest');
const app = require('../../index');
const { prisma } = require('../../helpers/prismaDbHelper')


describe('Showcase Controller', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.showcase.deleteMany();
    await prisma.item.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createTestUser = async () => {
    return await prisma.user.create({
      data: {
        uid: `testuser${Date.now()}`,
        first_name: 'Test',
        last_name: 'User',
        email: `testuser${Date.now()}@example.com`,
      },
    });
  };

  const createTestProduct = async () => {
    return await prisma.product.create({
      data: {
        ean: `1234567890123${Date.now()}`,
        upc: '123456789012',
        isbn: '1234567890',
        data: { name: 'Test Product', description: 'This is a test product' },
      },
    });
  };

  test('should create a new showcase', async () => {
    const testUser = await createTestUser();
    const response = await request(app)
      .post('/showcases')
      .send({
        name: 'Test Showcase',
        uid: testUser.uid,
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Showcase');
    expect(response.body.userId).toBe(testUser.id);
  });

  test('should fetch all showcases', async () => {
    // Create a showcase first
    await request(app)
      .post('/showcases')
      .send({
        name: 'Test Showcase',
        uid: user.uid,
      });

    const response = await request(app).get('/showcases');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('should fetch a specific showcase', async () => {
    const createResponse = await request(app)
      .post('/showcases')
      .send({
        name: 'Fetch Test Showcase',
        uid: user.uid,
      });

    const fetchResponse = await request(app).get(`/showcases/${createResponse.body.id}`);
    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body.id).toBe(createResponse.body.id);
    expect(fetchResponse.body.name).toBe('Fetch Test Showcase');
  });

  test('should update a showcase', async () => {
    const createResponse = await request(app)
      .post('/showcases')
      .send({
        name: 'Update Test Showcase',
        uid: user.uid,
      });

    const updateResponse = await request(app)
      .put(`/showcases/${createResponse.body.id}`)
      .send({
        name: 'Updated Showcase Name',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Updated Showcase Name');
  });

  test('should add items to a showcase', async () => {
    const showcaseResponse = await request(app)
      .post('/showcases')
      .send({
        name: 'Add Items Test Showcase',
        uid: user.uid,
      });

    const itemResponse = await request(app)
      .post('/items')
      .send({
        uid: user.uid,
        productEan: product.ean
      });

    const addItemResponse = await request(app)
      .put(`/showcases/${showcaseResponse.body.id}/items`)
      .send([{ type: 'Item', id: itemResponse.body.id }]);

    expect(addItemResponse.status).toBe(200);
    expect(addItemResponse.body.items).toContainEqual(expect.objectContaining({
      id: itemResponse.body.id
    }));
  });

  test('should delete a showcase', async () => {
    const createResponse = await request(app)
      .post('/showcases')
      .send({
        name: 'Delete Test Showcase',
        uid: user.uid,
      });

    const deleteResponse = await request(app).delete(`/showcases/${createResponse.body.id}`);
    expect(deleteResponse.status).toBe(204);

    const deletedShowcase = await prisma.showcase.findUnique({
      where: { id: createResponse.body.id },
    });
    expect(deletedShowcase).toBeNull();
  });

  test('should remove items from a showcase', async () => {
    const showcaseResponse = await request(app)
      .post('/showcases')
      .send({
        name: 'Remove Items Test Showcase',
        uid: user.uid,
      });

    const itemResponse = await request(app)
      .post('/items')
      .send({
        uid: user.uid,
        productEan: product.ean
      });

    // Add item to showcase
    await request(app)
      .put(`/showcases/${showcaseResponse.body.id}/items`)
      .send([{ type: 'Item', id: itemResponse.body.id }]);

    const removeItemResponse = await request(app)
      .delete(`/showcases/${showcaseResponse.body.id}/items`)
      .send([{ type: 'Item', id: itemResponse.body.id }]);

    expect(removeItemResponse.status).toBe(200);
    expect(removeItemResponse.body.items).toHaveLength(0);

    const updatedItem = await prisma.item.findUnique({
      where: { id: itemResponse.body.id },
    });
    expect(updatedItem.showcaseId).toBeNull();
  });
});

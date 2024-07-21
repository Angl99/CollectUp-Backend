const request = require('supertest');
const app = require('../../index');
const { prisma } = require('../../helpers/prismaDbHelper')


describe('Collection Controller', () => {
  let showcase1, showcase2, user1, user2, product, defaultCollection;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.collection.deleteMany();
    await prisma.item.deleteMany();
    await prisma.showcase.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();

    user1 = await prisma.user.create({
      data: {
        uid: `testuser123${Date.now()}`,
        first_name: 'Test',
        last_name: 'User',
        email: `testuser${Date.now()}@example.com`,
      },
    });

    user2 = await prisma.user.create({
      data: {
        uid: `testuser456${Date.now()}`,
        first_name: 'Another',
        last_name: 'User',
        email: `anotheruser${Date.now()}@example.com`,
      },
    });

    showcase1 = await prisma.showcase.create({
      data: {
        name: 'Test Showcase 1',
        user: { connect: { id: user1.id } },
      },
    });

    showcase2 = await prisma.showcase.create({
      data: {
        name: 'Test Showcase 2',
        user: { connect: { id: user2.id } },
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

    defaultCollection = await prisma.collection.create({
      data: {
        name: 'Default Collection',
        showcaseId: showcase1.id,
      },
    });
  });

  afterEach(async () => {
    await prisma.collection.deleteMany();
    await prisma.item.deleteMany();
    await prisma.showcase.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new collection', async () => {
    const response = await request(app)
      .post('/collections')
      .send({
        name: 'Test Collection',
        showcaseId: showcase1.id
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Collection');
  });

  test('should fetch all collections', async () => {
    const response = await request(app).get('/collections');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toContainEqual(expect.objectContaining({
      id: defaultCollection.id,
      name: 'Default Collection',
      showcaseId: showcase1.id
    }));
  });

  test('should fetch a collection by ID', async () => {
    const createResponse = await request(app)
      .post('/collections')
      .send({
        name: 'Fetch Test Collection',
        showcaseId: showcase1.id
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
        showcaseId: showcase1.id
      });

    const updateResponse = await request(app)
      .put(`/collections/${createResponse.body.id}`)
      .send({
        name: 'Updated Collection Name',
        showcaseId: showcase2.id
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Updated Collection Name');
  });

  test('should delete a collection', async () => {
    const createResponse = await request(app)
      .post('/collections')
      .send({
        name: 'Delete Test Collection',
        showcaseId: showcase1.id
      });

    const deleteResponse = await request(app).delete(`/collections/${createResponse.body.id}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Collection deleted!');
  });

  test('should add an item to a collection', async () => {
    const itemResponse = await request(app)
      .post('/items')
      .send({
        uid: user1.uid,
        productEan: product.ean
      });

    expect(itemResponse.status).toBe(201);
    expect(itemResponse.body.userId).toBe(user1.id);
    expect(itemResponse.body.productEan).toBe(product.ean);

    const addItemResponse = await request(app)
      .post('/collections/add-item')
      .send({
        collectionId: defaultCollection.id,
        itemId: itemResponse.body.id
      });

    expect(addItemResponse.status).toBe(200);
    expect(addItemResponse.body.items).toContainEqual(expect.objectContaining({
      id: itemResponse.body.id
    }));
  });
});

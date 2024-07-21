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

//   test('should update an item', async () => {
//     // Create an item first
//     const createResponse = await request(app)
//       .post('/items')
//       .send({
//         uid: user.uid,
//         productEan: product.ean
//       });

//     const newName = 'Updated Item Name';
//     const newDescription = 'This is an updated description';

//     const updateResponse = await request(app)
//       .put(`/items/${createResponse.body.id}`)
//       .send({
//         name: newName,
//         description: newDescription,
//       });

//     expect(updateResponse.status).toBe(200);
//     expect(updateResponse.body.name).toBe(newName);
//     expect(updateResponse.body.description).toBe(newDescription);
//     // Ensure productEan hasn't changed
//     expect(updateResponse.body.productEan).toBe(product.ean);
//   });

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
});

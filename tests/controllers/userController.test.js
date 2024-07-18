const request = require('supertest');
const app = require('../../index');
const { prisma } = require('../../helpers/prismaDbHelper')


describe('User Controller', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: `john.doe${Date.now()}@example.com`,
        uid: `unique-uid${Date.now()}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toContain('john.doe');
    expect(response.body.email).toContain('@example.com');
  });

  test('should fetch all users', async () => {
    // Create a user first
    await request(app)
      .post('/users')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: `jane.doe${Date.now()}@example.com`,
        uid: `another-unique-uid${Date.now()}`,
      });

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

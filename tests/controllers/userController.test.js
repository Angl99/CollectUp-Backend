const request = require('supertest');
const app = require('../../index'); // Adjust the path as necessary
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('User Controller', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); // Clear the database before running tests
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        uid: 'unique-uid',
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('john.doe@example.com');
  });

  test('should fetch all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
});

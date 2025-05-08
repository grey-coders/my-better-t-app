const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up the database before tests
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Disconnect Prisma Client after tests
  await prisma.$disconnect();
});

describe('User Model Integration Tests', () => {
  it('should create and retrieve a user', async () => {
    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name: 'admin',
        email: 'admin@gmail.com',
        password: 'securepassword',
      },
    });

    expect(newUser).toHaveProperty('id');
    expect(newUser.name).toBe('admin');

    // Retrieve the user
    const user = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' },
    });

    expect(user).not.toBeNull();
    expect(user.name).toBe('admin');
  });
});
import { PrismaClient } from "./generated/prisma/index.js";
const prisma = new PrismaClient()

async function testCreateUser() {
  try {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
      },
    });
    console.log("User created:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

testCreateUser();

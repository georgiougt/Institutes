const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCreate() {
  try {
    const contact = await prisma.contactRequest.create({
      data: {
        instituteId: null, // Explicitly null
        guestName: 'Test User',
        guestEmail: 'test@example.com',
        guestPhone: '99123456',
        message: 'This is a test message from a script',
      }
    });
    console.log('Success:', contact);
  } catch (e) {
    console.error('Failed with error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

testCreate();

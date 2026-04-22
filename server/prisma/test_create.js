const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.questionnaire.create({
      data: {
        name: 'Test Questionnaire',
        questions: JSON.stringify([{ id: 1, sequence: 1 }]),
        status: 'draft',
        settings: JSON.stringify({ instructions: 'test' }),
        wechatConfig: JSON.stringify({ title: 'test' }),
      }
    });
    console.log('Success:', res);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

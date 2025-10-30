import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.metric.deleteMany();
  const now = new Date();
  const categories = ['A', 'B', 'C'];
  for (let i = 0; i < 60; i++) {
    const ts = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    await prisma.metric.create({
      data: {
        name: `metric-${(i % 5) + 1}`,
        category: categories[i % categories.length],
        value: Math.round(Math.random() * 1000) / 10,
        timestamp: ts
      }
    });
  }
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
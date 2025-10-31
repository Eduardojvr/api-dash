// import request from 'supertest';
// import app from '../../src/app';
// import { prisma } from '../../src/prismaClient';
// import dotenv from 'dotenv';
// import test from 'node:test';
// dotenv.config();

// beforeAll(async () => {
//   await prisma.metric.deleteMany();
//   const now = new Date();
//   await prisma.metric.createMany({
//     data: [
//       { category: 'A', value: 1.5, timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
//       { category: 'B', value: 2.5, timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
//       { category: 'A', value: 3.0, timestamp: now }
//     ]
//   });
// });

// afterAll(async () => {
//   await prisma.$disconnect();
// });

// test('GET /api/charts returns pie data', async () => {
//   const start = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
//   const end = new Date().toISOString();
//   const res = await request(app).get('/api/charts').query({ chartType: 'pie', startDate: start, endDate: end });
//   expect(res.status).toBe(200);
//   expect(res.body.type).toBe('pie');
//   expect(res.body.labels).toBeDefined();
//   expect(res.body.values).toBeDefined();
// });

// test('Missing params -> 400', async () => {
//   const res = await request(app).get('/api/charts').query({ chartType: 'pie' });
//   expect(res.status).toBe(400);
// });

// function beforeAll(arg0: () => Promise<void>) {
//   throw new Error('Function not implemented.');
// }
// function afterAll(arg0: () => Promise<void>) {
//   throw new Error('Function not implemented.');
// }

// function expect(status: number) {
//   throw new Error('Function not implemented.');
// }


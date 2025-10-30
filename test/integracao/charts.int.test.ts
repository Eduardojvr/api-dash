import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/prismaClient';
import dotenv from 'dotenv';
dotenv.config();

beforeAll(async () => {
  await prisma.metric.deleteMany();
  const now = new Date();
  await prisma.metric.createMany({
    data: [
      { name: 'a', category: 'A', value: 1.5, timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
      { name: 'b', category: 'B', value: 2.5, timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
      { name: 'a', category: 'A', value: 3.0, timestamp: now }
    ]
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('GET /api/charts returns pie data', async () => {
  const start = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
  const end = new Date().toISOString();
  const res = await request(app).get('/api/charts').query({ chartType: 'pie', startDate: start, endDate: end });
  expect(res.status).toBe(200);
  expect(res.body.type).toBe('pie');
  expect(res.body.labels).toBeDefined();
  expect(res.body.values).toBeDefined();
});

test('Missing params -> 400', async () => {
  const res = await request(app).get('/api/charts').query({ chartType: 'pie' });
  expect(res.status).toBe(400);
});
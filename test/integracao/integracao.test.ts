import request from 'supertest';

process.env.NODE_ENV = 'test';

jest.mock('../../src/prismaClient', () => ({
  prisma: {
    metric: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { prisma } from '../../src/prismaClient';
import app from '../../src/app';

const mockedPrisma = prisma as any;

describe('Integration - charts routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/charts -> 200 e retorna dados formatados (line)', async () => {
    const mockMetrics = [
      { id: 1, category: 'A', value: 10, timestamp: new Date('2024-01-01T12:00:00Z') },
      { id: 2, category: 'A', value: 5, timestamp: new Date('2024-01-01T18:00:00Z') },
      { id: 3, category: 'B', value: 20, timestamp: new Date('2024-01-02T12:00:00Z') },
    ];
    mockedPrisma.metric.findMany.mockResolvedValue(mockMetrics);

    const res = await request(app)
      .get('/api/charts')
      .query({ chartType: 'line', startDate: '2024-01-01', endDate: '2024-01-31' });

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('line');
    expect(Array.isArray(res.body.labels)).toBe(true);
    expect(Array.isArray(res.body.datasets)).toBe(true);
    expect(res.body.datasets[0].data).toBeInstanceOf(Array);
  });

  it('GET /api/charts -> 400 quando query inválida (middleware validateChartRequest)', async () => {
    const res = await request(app).get('/api/charts');
  });

  it('POST /api/charts -> 400 quando body inválido', async () => {
    const res = await request(app).post('/api/charts').send({ category: '', value: null });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Campos obrigatórios: category e value.' });
  });

  it('POST /api/charts -> 201 cria métrica usando timestamp padrão', async () => {
    const created = { id: 10, category: 'sales', value: 100, timestamp: new Date() };
    mockedPrisma.metric.create.mockResolvedValue(created);

    const res = await request(app).post('/api/charts').send({ category: 'sales', value: 100 });

    expect(res.status).toBe(201);
   
    expect(mockedPrisma.metric.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        category: 'sales',
        value: 100,
        timestamp: expect.any(Date),
      }),
    });
    expect(res.body).toEqual({
      ...created,
      timestamp: created.timestamp.toISOString(),
    });
  });

  it('POST /api/charts -> 201 cria métrica com timestamp informado (string)', async () => {
    const tsStr = '2025-01-01T00:00:00Z';
    const tsDate = new Date(tsStr);
    const created = { id: 11, category: 'visits', value: 50, timestamp: tsDate };
    mockedPrisma.metric.create.mockResolvedValue(created);

    const res = await request(app)
      .post('/api/charts')
      .send({ category: 'visits', value: 50, timestamp: tsStr });

    expect(res.status).toBe(201);
    expect(mockedPrisma.metric.create).toHaveBeenCalledWith({
      data: {
        category: 'visits',
        value: 50,
        timestamp: tsDate,
      },
    });
    expect(res.body).toEqual({
      ...created,
      timestamp: created.timestamp.toISOString(),
    });
  });

  it('GET /api/charts -> 500 quando service lança erro', async () => {
    mockedPrisma.metric.findMany.mockRejectedValue(new Error('DB failure'));

    const res = await request(app)
      .get('/api/charts')
      .query({ chartType: 'pie', startDate: '2024-01-01', endDate: '2024-01-31' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'DB failure' });
  });
});
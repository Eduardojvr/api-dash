import { prisma } from "../../../src/prismaClient";
import { getChartData, saveMetricData } from "../../../src/service/chartsService";
import { formatByChartType } from "../../../src/utils/formatters";

jest.mock('../../../src/prismaClient', () => ({
prisma: {
metric: {
findMany: jest.fn(),
create: jest.fn(),
},
},
}));

jest.mock('../../../src/utils/formatters', () => ({
formatByChartType: jest.fn(),
}));

describe('chartsService', () => {
beforeEach(() => {
jest.clearAllMocks();
});

describe('getChartData', () => {
it('deve buscar métricas no intervalo e formatar pelo tipo de gráfico', async () => {
const mockMetrics = [
{ id: 1, category: 'A', value: 10, timestamp: new Date('2025-01-01') },
{ id: 2, category: 'B', value: 20, timestamp: new Date('2025-01-02') },
];

  (prisma.metric.findMany as jest.Mock).mockResolvedValue(mockMetrics);
  (formatByChartType as jest.Mock).mockReturnValue({ type: 'bar', data: [1, 2, 3] });

  const result = await getChartData({
    chartType: 'bar',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
  });

  expect(prisma.metric.findMany).toHaveBeenCalledWith({
    where: {
      timestamp: {
        gte: new Date('2025-01-01'),
        lte: new Date('2025-01-31'),
      },
    },
    orderBy: { timestamp: 'asc' },
  });

  expect(formatByChartType).toHaveBeenCalledWith('bar', mockMetrics);
  expect(result).toEqual({ type: 'bar', data: [1, 2, 3] });
});

it('deve propagar erro se prisma falhar', async () => {
  (prisma.metric.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

  await expect(
    getChartData({
      chartType: 'pie',
      startDate: '2025-01-01',
      endDate: '2025-01-02',
    })
  ).rejects.toThrow('DB error');
});

});

describe('saveMetricData', () => {
it('deve criar métrica com timestamp padrão quando não informado', async () => {
const mockMetric = { id: 1, category: 'sales', value: 100, timestamp: new Date() };
(prisma.metric.create as jest.Mock).mockResolvedValue(mockMetric);

  const result = await saveMetricData({ category: 'sales', value: 100 });

  expect(prisma.metric.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      category: 'sales',
      value: 100,
      timestamp: expect.any(Date),
    }),
  });
  expect(result).toEqual(mockMetric);
});

it('deve usar o timestamp informado se fornecido', async () => {
  const ts = new Date('2025-10-30T14:00:00Z');
  const mockMetric = { id: 2, category: 'visits', value: 50, timestamp: ts };
  (prisma.metric.create as jest.Mock).mockResolvedValue(mockMetric);

  const result = await saveMetricData({ category: 'visits', value: 50, timestamp: ts });

  expect(prisma.metric.create).toHaveBeenCalledWith({
    data: {
      category: 'visits',
      value: 50,
      timestamp: ts,
    },
  });
  expect(result).toEqual(mockMetric);
});

it('deve propagar erro se prisma falhar', async () => {
  (prisma.metric.create as jest.Mock).mockRejectedValue(new Error('Erro DB'));

  await expect(
    saveMetricData({ category: 'A', value: 10 })
  ).rejects.toThrow('Erro DB');
});

});
});

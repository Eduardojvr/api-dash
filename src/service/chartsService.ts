import { prisma } from '../prismaClient';
import { formatByChartType } from '../utils/formatters';
import { ChartType } from '../utils/formatters';

export async function getChartData(options: {
  chartType: ChartType;
  startDate: string;
  endDate: string;
  groupBy?: string | undefined;
}) {
  const { chartType, startDate, endDate } = options;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const metrics = await prisma.metric.findMany({
    where: {
      timestamp: {
        gte: start,
        lte: end
      }
    },
    orderBy: { timestamp: 'asc' }
  });

  return formatByChartType(chartType, metrics);
}
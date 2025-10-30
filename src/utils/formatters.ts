import { Metric } from '@prisma/client';
import { format } from 'date-fns';

export type ChartType = 'pie' | 'line' | 'bar';

export function formatForPie(data: Metric[]) {
  const map = new Map<string, number>();
  data.forEach(d => {
    map.set(d.category, (map.get(d.category) || 0) + d.value);
  });
  const labels = Array.from(map.keys());
  const values = Array.from(map.values());
  return { type: 'pie', labels, values };
}

export function formatForLine(data: Metric[]) {
  const map = new Map<string, number[]>();
  data.forEach(d => {
    const day = format(d.timestamp, 'yyyy-MM-dd');
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(d.value);
  });
  const labels = Array.from(map.keys()).sort();
  const datasets = labels.map(label => {
    const arr = map.get(label)!;
    return arr.reduce((s, v) => s + v, 0);
  });
  return {
    type: 'line',
    labels,
    datasets: [{ label: 'Soma por dia', data: datasets }]
  };
}

export function formatForBar(data: Metric[]) {
  const map = new Map<string, number>();
  data.forEach(d => {
    map.set(d.category, (map.get(d.category) || 0) + d.value);
  });
  const labels = Array.from(map.keys());
  const values = Array.from(map.values());
  return { type: 'bar', labels, values };
}

export function formatByChartType(type: ChartType, data: any) {
  if (!Array.isArray(data)) return { type, data };
  switch (type) {
    case 'pie': return formatForPie(data);
    case 'line': return formatForLine(data);
    case 'bar': return formatForBar(data);
    default: throw new Error(`Unsupported chart type: ${type}`);
  }
}
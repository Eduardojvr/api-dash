import { formatForPie, formatForLine, formatForBar } from '../../src/utils/formatters';
import { Metric } from '@prisma/client';

function makeMetric(overrides: Partial<Metric>): Metric {
  return {
    id: overrides.id ?? 1,
    name: overrides.name ?? 'm1',
    category: overrides.category ?? 'cat',
    value: overrides.value ?? 10,
    timestamp: overrides.timestamp ?? new Date()
  } as Metric;
}

describe('formatters', () => {
  test('formatForPie aggregates by category', () => {
    const data = [makeMetric({ category: 'A', value: 1 }), makeMetric({ category: 'A', value: 2 }), makeMetric({ category: 'B', value: 3 })];
    const out = formatForPie(data);
    expect(out.labels).toContain('A');
    expect(out.values).toEqual(expect.arrayContaining([3, 3]));
  });

  test('formatForLine returns labels and datasets', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const data = [
      makeMetric({ timestamp: now, value: 2 }),
      makeMetric({ timestamp: now, value: 3 }),
      makeMetric({ timestamp: yesterday, value: 5 })
    ];
    const out = formatForLine(data);
    expect(out.type).toBe('line');
    expect(Array.isArray(out.labels)).toBeTruthy();
    expect(out.datasets[0].data.length).toBeGreaterThanOrEqual(1);
  });

  test('formatForBar aggregates by name', () => {
    const data = [makeMetric({ name: 'x', value: 1 }), makeMetric({ name: 'x', value: 4 }), makeMetric({ name: 'y', value: 2 })];
    const out = formatForBar(data);
    expect(out.labels).toContain('x');
    expect(out.values).toContain(5);
  });
});
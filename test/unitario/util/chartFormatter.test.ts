import { Metric } from '@prisma/client';
import { formatForPie, formatForLine, formatForBar, formatByChartType } from '../../../src/utils/formatters';

describe('chartFormatter', () => {
    const mockMetrics: Metric[] = [
        { id: 1, category: 'A', value: 10, timestamp: new Date('2024-01-01T12:00:00Z') } as Metric,
        { id: 2, category: 'B', value: 20, timestamp: new Date('2024-01-02T12:00:00Z') } as Metric,
        { id: 3, category: 'A', value: 5, timestamp: new Date('2024-01-01T15:00:00Z') } as Metric,
    ];

    describe('formatForPie', () => {
        it('deve agrupar valores por categoria e retornar labels e values', () => {
            const result = formatForPie(mockMetrics);
            expect(result.type).toBe('pie');
            expect(result.labels).toEqual(expect.arrayContaining(['A', 'B']));
            expect(result.values).toEqual([15, 20]); 
        });
    });

    describe('formatForLine', () => {
        it('deve agrupar valores por data e somar corretamente', () => {
            const result = formatForLine(mockMetrics);
            expect(result.type).toBe('line');
            expect(result.labels).toEqual(['2024-01-01', '2024-01-02']);
            expect(result.datasets[0].data).toEqual([15, 20]);
        });

        it('deve retornar dias em ordem crescente', () => {
            const unorderedMetrics: Metric[] = [
                { id: 1, category: 'X', value: 10, timestamp: new Date('2024-01-03T12:00:00Z') } as Metric,
                { id: 2, category: 'Y', value: 5, timestamp: new Date('2024-01-01T12:00:00Z') } as Metric,
            ];
            const result = formatForLine(unorderedMetrics);
            expect(result.labels).toEqual(['2024-01-01', '2024-01-03']);
        });
    });

    describe('formatForBar', () => {
        it('deve agrupar valores por categoria e retornar formato de barra', () => {
            const result = formatForBar(mockMetrics);
            expect(result.type).toBe('bar');
            expect(result.labels).toEqual(expect.arrayContaining(['A', 'B']));
            expect(result.values).toEqual([15, 20]);
        });
    });

    describe('formatByChartType', () => {
        it('deve chamar formatForPie quando type for "pie"', () => {
            const result = formatByChartType('pie', mockMetrics);
            expect(result.type).toBe('pie');
        });

        it('deve chamar formatForLine quando type for "line"', () => {
            const result = formatByChartType('line', mockMetrics);
            expect(result.type).toBe('line');
        });

        it('deve chamar formatForBar quando type for "bar"', () => {
            const result = formatByChartType('bar', mockMetrics);
            expect(result.type).toBe('bar');
        });

        it('deve lançar erro se tipo não for suportado', () => {
            expect(() => formatByChartType('invalid' as any, mockMetrics)).toThrow('Unsupported chart type: invalid');
        });

        it('deve retornar o objeto intacto se data não for um array', () => {
            const input = { test: true };
            const result = formatByChartType('pie', input);
            expect(result).toEqual({ type: 'pie', data: input });
        });
    });
});

describe('chartFormatter - additional tests', () => {
    it('formatForLine agrupa e ordena datas usando horários no meio do dia (evita problemas de fuso)', () => {
        const metrics: Metric[] = [
            { id: 10, category: 'C', value: 7, timestamp: new Date('2024-01-01T12:00:00Z') } as Metric,
            { id: 11, category: 'D', value: 3, timestamp: new Date('2024-01-02T12:00:00Z') } as Metric,
            { id: 12, category: 'C', value: 8, timestamp: new Date('2024-01-01T18:00:00Z') } as Metric,
        ];
        const result = formatForLine(metrics);
        expect(result.type).toBe('line');
        expect(result.labels).toEqual(['2024-01-01', '2024-01-02']);
        expect(result.datasets[0].data).toEqual([15, 3]);
    });

    it('formatForLine retorna estruturas vazias quando não há métricas', () => {
        const result = formatForLine([] as Metric[]);
        expect(result.type).toBe('line');
        expect(result.labels).toEqual([]);
        expect(Array.isArray(result.datasets)).toBe(true);
        expect(result.datasets[0].data).toEqual([]);
    });

    it('formatForPie soma corretamente e mantém labels/values com mesmo comprimento', () => {
        const metrics: Metric[] = [
            { id: 20, category: 'P', value: 4, timestamp: new Date('2024-02-01T12:00:00Z') } as Metric,
            { id: 21, category: 'Q', value: 6, timestamp: new Date('2024-02-02T12:00:00Z') } as Metric,
            { id: 22, category: 'P', value: 10, timestamp: new Date('2024-02-01T18:00:00Z') } as Metric,
        ];
        const result = formatForPie(metrics);
        expect(result.type).toBe('pie');
        expect(result.labels.length).toBe(result.values.length);
        const total = (result.values as number[]).reduce((s, v) => s + v, 0);
        expect(total).toBe(20);
    });

    it('formatForPie e formatForBar retornam arrays vazios quando input é vazio', () => {
        const pie = formatForPie([] as Metric[]);
        expect(pie.type).toBe('pie');
        expect(pie.labels).toEqual([]);
        expect(pie.values).toEqual([]);

        const bar = formatForBar([] as Metric[]);
        expect(bar.type).toBe('bar');
        expect(bar.labels).toEqual([]);
        expect(bar.values).toEqual([]);
    });

    it('formatByChartType lança erro para tipo desconhecido (mensagem consistente)', () => {
        expect(() => formatByChartType('not-a-type' as any, [])).toThrow('Unsupported chart type: not-a-type');
    });
});

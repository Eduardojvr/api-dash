import { getChart, createMetric } from "../../../src/controller/chartsController";
import { getChartData, saveMetricData } from "../../../src/service/chartsService";

jest.mock('../../../src/service/chartsService');

describe('chartsController', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = { query: {}, body: {} };
        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('getChart', () => {
        it('deve retornar os dados do gráfico com sucesso', async () => {
            const mockData = [{ label: 'A', value: 10 }];
            (getChartData as jest.Mock).mockResolvedValue(mockData);


            req.query = { chartType: 'bar', startDate: '2024-01-01', endDate: '2024-01-31', groupBy: 'day' };

            await getChart(req, res);

            expect(getChartData).toHaveBeenCalledWith({
                chartType: 'bar',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                groupBy: 'day',
            });
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it('deve retornar erro 500 se ocorrer uma exceção', async () => {
            (getChartData as jest.Mock).mockRejectedValue(new Error('Erro interno'));

            await getChart(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno' });
        });


    });

    describe('createMetric', () => {
        it('deve retornar 400 se category ou value não forem informados', async () => {
            req.body = { category: '', value: null };


            await createMetric(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Campos obrigatórios: category e value.' });
        });

        it('deve salvar e retornar métrica com sucesso', async () => {
            const mockSaved = { id: 1, category: 'sales', value: 200 };
            (saveMetricData as jest.Mock).mockResolvedValue(mockSaved);

            req.body = { category: 'sales', value: 200 };

            await createMetric(req, res);

            expect(saveMetricData).toHaveBeenCalledWith({
                category: 'sales',
                value: 200,
                timestamp: undefined,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockSaved);
        });

        it('deve converter timestamp corretamente se informado', async () => {
            const mockSaved = { id: 2, category: 'visits', value: 10 };
            (saveMetricData as jest.Mock).mockResolvedValue(mockSaved);

            req.body = { category: 'visits', value: 10, timestamp: '2025-01-01T00:00:00Z' };

            await createMetric(req, res);

            expect(saveMetricData).toHaveBeenCalledWith({
                category: 'visits',
                value: 10,
                timestamp: new Date('2025-01-01T00:00:00Z'),
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockSaved);
        });

        it('deve retornar erro 500 se ocorrer uma exceção ao salvar', async () => {
            (saveMetricData as jest.Mock).mockRejectedValue(new Error('Falha ao salvar'));

            req.body = { category: 'sales', value: 200 };

            await createMetric(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao salvar' });
        });


    });
});

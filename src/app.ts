import express from 'express';
import chartsRoutes from './route/charts';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './swagger';

const app = express();
app.use(express.json());

/**
 * @swagger
 * /api/charts:
 *   get:
 *     summary: Retorna dados para gráficos
 *     parameters:
 *       - in: query
 *         name: chartType
 *         schema:
 *           type: string
 *         required: true
 *         description: Tipo de gráfico (pie, line, bar)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Data de início
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Data de fim
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *         required: false
 *         description: Agrupamento opcional (ex: day, month)
 *     responses:
 *       200:
 *         description: Dados do gráfico retornados com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       500:
 *         description: Erro interno do servidor
 */
app.use('/api/charts', chartsRoutes);

// Configura Swagger
setupSwagger(app);

// Middleware de erro
app.use(errorHandler);

export default app;

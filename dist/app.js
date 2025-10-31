"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const charts_1 = __importDefault(require("./route/charts"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
app.use('/api/charts', charts_1.default);
// Configura Swagger
(0, swagger_1.setupSwagger)(app);
// Middleware de erro
app.use(errorHandler_1.errorHandler);
exports.default = app;

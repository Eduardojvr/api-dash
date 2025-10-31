"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartData = getChartData;
const prismaClient_1 = require("../prismaClient");
const formatters_1 = require("../utils/formatters");
async function getChartData(options) {
    const { chartType, startDate, endDate } = options;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const metrics = await prismaClient_1.prisma.metric.findMany({
        where: {
            timestamp: {
                gte: start,
                lte: end
            }
        },
        orderBy: { timestamp: 'asc' }
    });
    return (0, formatters_1.formatByChartType)(chartType, metrics);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChart = getChart;
const chartsService_1 = require("../service/chartsService");
async function getChart(req, res) {
    try {
        const { chartType, startDate, endDate, groupBy } = req.query;
        const data = await (0, chartsService_1.getChartData)({
            chartType,
            startDate,
            endDate,
            groupBy
        });
        return res.json(data);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

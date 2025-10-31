"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChartRequest = validateChartRequest;
const zod_1 = require("zod");
const QuerySchema = zod_1.z.object({
    chartType: zod_1.z.string(),
    startDate: zod_1.z.string().refine(s => !Number.isNaN(Date.parse(s)), { message: 'startDate must be a valid ISO date string' }),
    endDate: zod_1.z.string().refine(s => !Number.isNaN(Date.parse(s)), { message: 'endDate must be a valid ISO date string' }),
    groupBy: zod_1.z.optional(zod_1.z.string())
});
function validateChartRequest(req, res, next) {
    const parseResult = QuerySchema.safeParse(req.query);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.format() });
    }
    const { startDate, endDate } = parseResult.data;
    if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ message: 'startDate must be before endDate' });
    }
    next();
}

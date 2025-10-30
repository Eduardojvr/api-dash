import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const QuerySchema = z.object({
  chartType: z.string(),
  startDate: z.string().refine(s => !Number.isNaN(Date.parse(s)), { message: 'startDate must be a valid ISO date string' }),
  endDate: z.string().refine(s => !Number.isNaN(Date.parse(s)), { message: 'endDate must be a valid ISO date string' }),
  groupBy: z.optional(z.string())
});

export function validateChartRequest(req: Request, res: Response, next: NextFunction) {
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
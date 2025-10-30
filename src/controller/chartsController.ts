import { Request, Response } from 'express';
import { getChartData } from '../service/chartsService';


export async function getChart(req: Request, res: Response) {
  try {
    const { chartType, startDate, endDate, groupBy } = req.query as any;
    const data = await getChartData({
      chartType,
      startDate,
      endDate,
      groupBy
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: (err as any).message });
  }
}
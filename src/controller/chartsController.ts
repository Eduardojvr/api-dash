import { Request, Response } from 'express';
import { getChartData, saveMetricData } from '../service/chartsService';


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


export async function createMetric(req: Request, res: Response) {
  try {
    const { category, value, timestamp } = req.body;

    if (!category || value == null) {
      return res.status(400).json({ message: 'Campos obrigatórios: category e value.' });
    }

    const saved = await saveMetricData({
      category,
      value: Number(value),
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: (err as any).message });
  }
}
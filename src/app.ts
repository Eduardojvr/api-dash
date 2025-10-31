import express from 'express';
import chartsRoutes from './route/charts';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';

const app = express();
app.use(express.json());


app.use('/api/charts', chartsRoutes);


const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(file);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(errorHandler);

export default app;

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;
const databaseUrl =
  env === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL não definida no arquivo .env');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;

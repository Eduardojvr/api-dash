import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;
const url = env === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

export const prisma = new PrismaClient({
  datasources: { db: { url } }
});

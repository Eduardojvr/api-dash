import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carrega variáveis do .env
dotenv.config();

// Escolhe a URL do banco conforme o ambiente
const env = process.env.NODE_ENV;
const databaseUrl =
  env === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

// Garante que a URL foi definida
if (!databaseUrl) {
  throw new Error('❌ DATABASE_URL não definida no arquivo .env');
}

// Cria uma instância única do PrismaClient
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

// Exporta para uso em toda a aplicação
export default prisma;

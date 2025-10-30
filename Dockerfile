FROM node:18

WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia todo o código
COPY . .

# Expõe a porta
EXPOSE 3000

# Script de start que aplica migrations, gera Prisma Client, compila TS e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run build && npm start"]

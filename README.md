# API Dinâmica para Dashboards

API REST construída para **gerenciar e consultar métricas de gráficos** de forma dinâmica, permitindo alimentar dashboards com dados em tempo real.

---

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Jest**
- **Swagger (OpenAPI 3.0.3)**
- **Docker & Docker Compose**
- **Prisma**
- **TypeScript**

---

## Estrutura da API

**Base URL:**
```
http://localhost:3000
```

---

## Endpoints

### **GET /api/charts**

Retorna dados para gráficos com base nos parâmetros de consulta.

#### Parâmetros de Query

| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|------------|
| `chartType` | `string` | Sim | Tipo de gráfico (`pie`, `line`, `bar`) |
| `startDate` | `string` (date-time) | Sim | Data inicial do período |
| `endDate` | `string` (date-time) | Sim | Data final do período |
| `groupBy` | `string` | Não | Agrupamento opcional (ex: `categoria`, `mês`) |

#### Exemplo de Requisição
```bash
GET http://localhost:3000/api/charts?chartType=bar&startDate=2025-10-01T00:00:00Z&endDate=2025-10-31T23:59:59Z
```

#### Respostas Possíveis

| Código | Descrição |
|--------|------------|
| `200` | Dados do gráfico retornados com sucesso |
| `400` | Parâmetros inválidos |
| `500` | Erro interno do servidor |

#### Exemplo de Resposta (200)
```json
[
  { "category": "Janeiro", "value": 150 },
  { "category": "Fevereiro", "value": 230 },
  { "category": "Março", "value": 180 }
]
```

---

### **POST /api/charts**

Cria um novo registro de métrica.

#### Corpo da Requisição (`application/json`)

| Campo | Tipo | Obrigatório | Descrição |
|--------|------|-------------|------------|
| `category` | `string` | Sim | Categoria da métrica (ex: `Vendas`, `Lucro`) |
| `value` | `number` | Sim | Valor numérico da métrica |
| `timestamp` | `string` (date-time) | Não | Data e hora do registro (default: atual) |

#### Exemplo de Requisição
```bash
POST http://localhost:3000/api/charts
Content-Type: application/json

{
  "category": "Vendas",
  "value": 120.5,
  "timestamp": "2025-10-30T14:00:00Z"
}
```

#### Respostas Possíveis

| Código | Descrição |
|--------|------------|
| `201` | Métrica criada com sucesso |
| `400` | Requisição inválida (campos ausentes ou incorretos) |
| `500` | Erro interno do servidor |

#### Exemplo de Resposta (201)
```json
{
  "message": "Métrica criada com sucesso",
  "data": {
    "id": 1,
    "category": "Vendas",
    "value": 120.5,
    "timestamp": "2025-10-30T14:00:00Z"
  }
}
```

---

## Usando Docker Compose

 basta rodar:

```bash
docker-compose up --build
```

Isso criará e iniciará todos os serviços definidos (ex: app, banco de dados, etc).

Para parar:
```bash
docker-compose down
```

---
## Testes unitários e de integração

Basta rodar:

```
npm i
```

Depois

```
npm run test
```
---

## Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```
---

## Exemplos de Uso via cURL

### Criar 
```bash
curl -X POST http://localhost:3000/api/charts -H "Content-Type: application/json" -d '{"category":"Vendas","value":250.75,"timestamp":"2025-10-30T10:00:00Z"}'
```

### Consultar 
```bash
curl "http://localhost:3000/api/charts?chartType=pie&startDate=2025-10-01T00:00:00Z&endDate=2025-10-31T23:59:59Z"
```


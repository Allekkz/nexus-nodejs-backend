import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
// Mantém exatamente o caminho da sua pasta personalizada gerada
import { PrismaClient } from "../../generated/prisma/client"; 

// Captura a URL do Postgres que você colocou no .env
const connectionString = `${process.env.DATABASE_URL}`;

// Cria a conexão nativa com o PostgreSQL do Neon
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Inicializa o Prisma Client usando o adaptador do Postgres
const prisma = new PrismaClient({ adapter });

export { prisma };
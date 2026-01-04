import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// استفاده از Connection String برای جلوگیری از خطای تفکیک پارامترها
const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  log: ['query', 'error', 'warn'] // اضافه کردن query برای دیباگ بهتر در کنسول
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
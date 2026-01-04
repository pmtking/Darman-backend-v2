# استفاده از ریجستری جایگزین برای دور زدن تحریم
FROM docker.ir/library/node:22-alpine

WORKDIR /app

# کپی فایل‌های پیکربندی
COPY package*.json ./
COPY prisma ./prisma/

# نصب وابستگی‌ها
RUN npm install

# کپی بقیه کدها
COPY . .

# تولید کلاینت پریزما (Prisma 7)
RUN npx prisma generate

# اجرای دستور همزمان برای Seed و Start
CMD ["sh", "-c", "npx prisma db push && node --import tsx prisma/seed.ts && npm run dev"]
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();
const PORT = 4001;

// --- ۱. میدل‌ورهای پایه (حتماً باید قبل از روت‌ها باشند) ---
app.use(cors());
app.use(express.json()); // حالا بادی قبل از رسیدن به روت‌ها خوانده می‌شود
app.use(express.urlencoded({ extended: true }));

// یک لاگ دیباگ برای اطمینان از دریافت بادی
app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log(`📥 [Core Service] Incoming Body:`, req.body);
    }
    next();
});

// --- ۲. مسیرهای اصلی اپلیکیشن ---
app.use('/', router);

// --- ۳. مسیر تست سلامت ---
app.get('/health', (req, res) => {
    res.json({ 
        status: 'Core Service is healthy',
        service: 'Core-Engine'
    });
});

// مدیریت خطای ۴۰۴ در مقصد
app.use((req, res) => {
    console.log(`❌ 404 in Core: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Route not found in Core Service" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Core Engine is ready on port ${PORT}`);
});
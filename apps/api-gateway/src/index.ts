import express, { Request, Response } from "express";
import {
  createProxyMiddleware,
  fixRequestBody,
  Options,
} from "http-proxy-middleware";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { protect } from "./authMiddleware";

dotenv.config();

const app = express();
const PORT = 4000;
const HOST = "0.0.0.0";

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const handleProxyError = (err: Error, req: any, res: any) => {
  console.error(`❌ Proxy Error:`, err.message);
  if (res && !res.headersSent) {
    res.status(502).json({
      status: "error",
      message: "Target service is unreachable",
    });
  }
};

// ۱. Auth Service
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: "http://127.0.0.1:4001/api/auth",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "" },
    on: {
      proxyReq: (proxyReq, req: any) => {
        // اگر بادی توسط express.json خوانده شده، آن را دوباره بنویس
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      error: handleProxyError,
    },
  })
);

// ۲. Core Service
// apps/api-gateway/src/index.ts

app.use('/api/v1/core', protect, createProxyMiddleware({
    target: 'http://127.0.0.1:4001',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/core': '' },
    on: {
        proxyReq: (proxyReq, req: any) => {
            // ۱. انتقال هدرهایی که در Middleware 'protect' ست کردیم به درخواست پروکسی
            if (req.headers['x-user-id']) {
                proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
            }
            if (req.headers['x-user-role']) {
                proxyReq.setHeader('x-user-role', req.headers['x-user-role']);
            }

            // ۲. فیکس کردن Body برای درخواست‌های POST (خیلی مهم)
            // اگر از bodyParser استفاده می‌کنی، پروکسی ممکنه اینجا فریز بشه
            if (req.body && Object.keys(req.body).length) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        error: (err, req, res: any) => {
            console.error("❌ Proxy Error:", err);
            if (!res.headersSent) {
                res.status(502).json({ message: "سرویس مقصد در دسترس نیست" });
            }
        }
    }
} as Options));

// ۳. Worker Service
app.use(
  "/api/v1/worker",
  protect,
  createProxyMiddleware({
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/worker": "" },
    on: {
      proxyReq: fixRequestBody,
      error: handleProxyError,
    },
  } as Options)
);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Gateway: Route not found" });
});

app.listen(PORT, HOST, () => {
  console.log(`📡 Gateway running on http://${HOST}:${PORT}`);
});

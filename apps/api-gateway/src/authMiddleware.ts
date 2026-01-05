import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "DRM_SECRET_2025";

export const protect = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // تزریق مستقیم به هدرهای درخواست قبل از پروکسی شدن
    req.headers["x-user-id"] = String(decoded.id);
    req.headers["x-user-role"] = String(decoded.role).toUpperCase(); // اطمینان از حروف بزرگ برای نقش (ADMIN)

    console.log(`🛡️ Gateway Auth: User ${decoded.id} with role ${decoded.role} verified.`);
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
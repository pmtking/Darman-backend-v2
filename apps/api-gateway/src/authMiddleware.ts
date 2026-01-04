import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export const protect = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "دسترسی غیرمجاز - توکن موجود نیست" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.headers["x-user-id"] = decoded.id;
    req.headers["x-user-role"] = decoded.role;
    next()
;  } catch (error) {
    return res
      .status(401)
      .json({ message: "دسترسی غیرمجاز - توکن نامعتبر است" });
  }
};

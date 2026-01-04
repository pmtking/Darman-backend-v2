import { db } from "../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "DRM_SECRET_2025";

export class AuthService {
  static async validateUser(nationalId: string, password: string) {
    // ۱. جستجوی پرسنل
    const personnel = await db.personnel.findFirst({ 
      where: { nationalId:String(nationalId) } 
    });

    if (!personnel) {
      throw new Error("پرسنل یافت نشد");
    }

    // ۲. بررسی وضعیت فعال بودن (اختیاری اما توصیه شده)
    if (!personnel.isActive) {
      throw new Error("حساب کاربری شما غیرفعال شده است");
    }

    // ۳. بررسی مطابقت رمز عبور
    const isMatch = await bcrypt.compare(password, personnel.password);
    if (!isMatch) {
      throw new Error("رمز عبور اشتباه است");
    }

    // ۴. تولید توکن
    const token = jwt.sign(
      {
        id: personnel.id,
        role: personnel.role,
        name: personnel.name,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // ۵. حذف پسورد از آبجکت بازگشتی برای امنیت
    const { password: _, ...personnelWithoutPassword } = personnel;

    return { 
      token, 
      personnel: personnelWithoutPassword 
    };
  }
}
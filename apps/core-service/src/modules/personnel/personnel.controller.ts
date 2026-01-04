import { Request, Response } from "express";
import { PersonnelService } from "./personnel.service.js";
import jwt from "jsonwebtoken";
import { CreatepersonnelSchema } from "./personnel.validator.js";
import { ZodError } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || 'DRM_SECRET_2025';

export const createPersonnel = async (req: Request, res: Response) => {
    try {
        // ۱. اعتبار‌سنجی ورودی با Zod
        // استفاده از parse باعث می‌شود اگر دیتا غلط باشد، بلافاصله به catch برود
        const validatorData = CreatepersonnelSchema.parse(req.body);
    
        // ۲. ایجاد پرسنل در دیتابیس (ارسال دیتای تایید شده به سرویس)
        const personnel = await PersonnelService.createPersonnel(validatorData);

        // ۳. صدور توکن JWT
        const token = jwt.sign(
            { 
                id: personnel.id, 
                role: personnel.role,
                name: personnel.name 
            }, 
            JWT_SECRET, 
            { expiresIn: '12h' }
        );

        // ۴. پاسخ موفقیت‌آمیز
        return res.status(201).json({
            status: "success",
            message: "پرسنل جدید با موفقیت در سیستم ثبت شد",
            token,
            data: {
                id: personnel.id,
                name: personnel.name,
                role: personnel.role
            }
        });

    } catch (error: any) {
        // الف) مدیریت خطاهای Zod (خطای اعتبار‌سنجی ورودی)
     if (error instanceof ZodError) {
            return res.status(400).json({
                status: "fail",
                message: "داده‌های ارسالی معتبر نیستند",
                // به جای error.errors، از error.issues استفاده کن که استانداردتر است
                errors: error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }

        // ب) مدیریت خطاهای Prisma (مثل کد ملی تکراری)
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                status: "fail", 
                message: "این کد ملی یا شماره موبایل قبلاً در سیستم ثبت شده است" 
            });
        }

        // ج) سایر خطاهای پیش‌بینی نشده
        console.error("❌ Register Error:", error);
        return res.status(500).json({ 
            status: "error", 
            message: "خطای داخلی سرور در هنگام ثبت پرسنل" 
        });
    }
};
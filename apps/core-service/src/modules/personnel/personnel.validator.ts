import { resolve } from "node:dns";
import { z } from "zod";

export const CreatepersonnelSchema = z.object({
  name: z.string().min(3, "نام باید حداقل ۳ کاراکتر باشد"),
  nationalId: z
    .string()
    .length(10, "کد  ملی  دقیقاً باید ۱۰ رقم باشد  ")
    .regex(/^\d+$/, "کد ملی باید فقط شامل اعداد باشد"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل باید با 09 شروع شده و 11 رقم باشد"),
  password: z.string().min(4, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  role: z.enum(["DOCTOR", "NURSE", "RESEPTION", "MANAGER", "ADMIN", "SERVICE"]),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  salaryType: z.enum(['FIXED', 'PERCENTAGE']).default('FIXED'),
});

export type CreatePersonnelInput = z.infer<typeof CreatepersonnelSchema>;
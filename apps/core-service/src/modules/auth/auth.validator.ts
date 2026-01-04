import {z} from "zod";

export const loginSchema = z.object({
    nationalId: z.string()
    .length(10, "کد ملی باید ۱۰ رقم باشد")
    .regex(/^\d+$/, "کد ملی فقط شامل اعداد است"),
    password: z.string().min(4, "رمز عبور باید حداقل ۴ کاراکتر باشد"),
})

export type LoginInput = z.infer<typeof loginSchema>;
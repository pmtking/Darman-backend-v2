import { Request, Response } from "express";
import ca from "zod/v4/locales/ca.js";
import { loginSchema } from "./auth.validator";
import { AuthService } from "./auth.service";

export const login = async (req: Request, res: Response) => {
  
  try {
    console.log('----...',req.body);
    const validatorData = loginSchema.parse(req.body);

    const result = await AuthService.validateUser(
      validatorData.nationalId,
      validatorData.password
    );
    return res.status(200).json({
      status: "success",
      message: "ورود با موفقیت انجام شد",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "خطای سرور داخلی رخ داده است",
      error: error.message,
    });
  }
};

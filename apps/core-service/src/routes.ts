import { Router } from "express";
import authRouter from './modules/auth/auth.routes'
import PersonnelRouter from './modules/personnel/personnel.routes'
const router = Router();
router.use('/auth' ,authRouter )
router.use('/personnel' ,PersonnelRouter)


export  default router ;

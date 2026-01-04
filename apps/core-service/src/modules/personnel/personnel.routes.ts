import { Router } from "express";
import { createPersonnel } from "./personnel.controller.js";

const router = Router();
router.post('/', createPersonnel);
// router.get('/', getPersonnelList);
// مسیر ثبت پرسنل جدید
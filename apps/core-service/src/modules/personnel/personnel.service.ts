import bcrypt from 'bcrypt';
import { db } from '../../lib/db.js';

export class PersonnelService {
    // ایجاد پرسنل جدید
    static async createPersonnel(data: any) {
    try {
        const existing = await this.findByNationalId(data.nationalId);
        if(existing) {
            throw new Error("Conflict: A user with this National Id already exists. ")
        }

        const hashedPassword = await bcrypt.hash(data.password , 12)
        return await db.personnel.create({
            data:{
                name:data.name ,
                nationalId:data.nationalId ,
                password:data.password ,
                phone:data.phone ,
                role:data.role ,
                gender:data.gender ,
                salaryType:data.salaryType ,
                isActive:data.isActive ,
            }
        })
    } catch (error:any) {
         
    }
    }

    // دریافت لیست پرسنل (بدون نمایش پسورد)
    static async getAll() {
        return await db.personnel.findMany({
            select: {
                id: true,
                name: true,
                nationalId: true,
                role: true,
                phone: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    // پیدا کردن یک پرسنل خاص برای لاگین
    static async findByNationalId(nationalId: string) {
        return await db.personn
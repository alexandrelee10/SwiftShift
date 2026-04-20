import { z } from "zod"

export const signUpSchema = z.object({
    firstName: z.string().min(3, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.email({ pattern: z.regexes.email }),
    phoneNum: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, 'invalid'),
    password:
        z.string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
});


export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const searchSchema = z.object({
  origin: z.string().trim().optional(),
  destination: z.string().trim().optional(),
  weight: z.string().optional(),
  equipment: z.string().trim().optional(),
  date: z.string().optional(),
});
import { z } from "zod"


export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNum: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["DRIVER", "BROKER", "DISPATCH"]),
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

export const changePasswordSchema = z.object({
  originalPassword: z.string().min(1, "Original Password is required"),
  newPassword: z.string().min(1, "New password is required"),
  confirmNewPassword: z.string().min(1, "Confirmed Password must match and is required")
})
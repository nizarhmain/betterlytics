import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  passwordHash: z.string().optional(),
  role: z.enum(["admin", "user"]).nullable(),
  emailVerified: z.date().nullable().optional(),
  image: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().nullable().optional(),
  passwordHash: z.string(),
  role: z.enum(["admin", "user"]).nullable().optional(),
});

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const AuthenticatedUserSchema = UserSchema.extend({
  dashboardId: z.string(),
  siteId: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserData = z.infer<typeof CreateUserSchema>;
export type RegisterUserData = z.infer<typeof RegisterUserSchema>;
export type LoginUserData = z.infer<typeof LoginUserSchema>;
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
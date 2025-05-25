import prisma from "@/lib/postgres";
import * as bcrypt from 'bcrypt';
import { 
  User,
  UserSchema,
  CreateUserData, 
  CreateUserSchema,
  RegisterUserSchema,
  RegisterUserData,
} from "@/entities/user";

const SALT_ROUNDS = 10;

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!prismaUser) return null;
    
    return UserSchema.parse(prismaUser);
  } catch (error) {
    console.error(`Error finding user by email ${email}:`, error);
    throw new Error(`Failed to find user by email ${email}.`);
  }
}

export async function createUser(data: CreateUserData): Promise<User> {
  try {
    const validatedData = CreateUserSchema.parse(data);
    
    const prismaUser = await prisma.user.create({
      data: validatedData,
    });
    
    return UserSchema.parse(prismaUser);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user.");
  }
}

export async function registerUser(data: RegisterUserData): Promise<User> {
  try {
    const validatedData = RegisterUserSchema.parse(data);
    
    const existingUser = await findUserByEmail(validatedData.email);
    
    if (existingUser) {
      throw new Error(`User with email ${validatedData.email} already exists.`);
    }
    
    const passwordHash = await bcrypt.hash(validatedData.password, SALT_ROUNDS);
    
    return await createUser({
      email: validatedData.email,
      name: validatedData.name || validatedData.email.split('@')[0],
      passwordHash,
      role: validatedData.role || 'admin',
    });
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
} 
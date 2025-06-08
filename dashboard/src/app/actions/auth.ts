'use server';

import { RegisterUserData, RegisterUserSchema } from '@/entities/user';
import { registerNewUser } from '@/services/auth.service';
import { isFeatureEnabled } from '@/lib/feature-flags';

export async function registerUserAction(registrationData: RegisterUserData) {
  if (!isFeatureEnabled('enableRegistration')) {
    throw new Error('Registration is disabled');
  }

  try {
    const validatedData = RegisterUserSchema.parse(registrationData);
    return await registerNewUser(validatedData);
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        throw new Error('A user with this email already exists');
      }
    }

    throw new Error('Registration failed. Please try again.');
  }
}
